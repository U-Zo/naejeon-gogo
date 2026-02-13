import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useRef, useState } from 'react';
import { openErrorDialog } from '#/client/components/error-dialog';
import { type MatchMethod, SelectPhase } from '#/client/components/select-phase';
import { TeamMatchCard } from '#/client/components/team-match-card';
import * as cardStyles from '#/client/components/team-match-card.css';
import type { MatchCandidate, TeamSlot } from '#/client/domains/match';
import { useCreateMatch } from '#/client/domains/match';
import { useGenerateMatch } from '#/client/domains/matchmaking';
import type { Member } from '#/client/domains/member';
import { useMembers } from '#/client/domains/member';
import { POSITION_LABELS } from '#/client/domains/position';
import * as styles from '#/client/pages/matchmaking/matchmaking-page.css';
import { RaceCanvas, type RaceCanvasHandle } from '#/client/pages/race/components/race-canvas';
import type { RaceResult } from '#/client/pages/race/engine/types';
import * as common from '#/client/styles/common.css';

type Phase = 'select' | 'race' | 'candidates';

type SlotId = {
  candidateIndex: number;
  team: 'A' | 'B';
  slotIndex: number;
};

function encodeSlotId(id: SlotId): string {
  return `${id.candidateIndex}-${id.team}-${id.slotIndex}`;
}

function decodeSlotId(encoded: string): SlotId | null {
  const parts = encoded.split('-');
  if (parts.length !== 3) return null;
  const candidateIndex = Number(parts[0]);
  const team = parts[1] as 'A' | 'B';
  const slotIndex = Number(parts[2]);
  if (Number.isNaN(candidateIndex) || Number.isNaN(slotIndex)) return null;
  if (team !== 'A' && team !== 'B') return null;
  return { candidateIndex, team, slotIndex };
}

function recalcCandidate(candidate: MatchCandidate, memberMap: Map<string, Member>): MatchCandidate {
  const teamATotal = candidate.teamA.reduce((sum, s) => sum + (memberMap.get(s.memberId)?.mmr ?? 0), 0);
  const teamBTotal = candidate.teamB.reduce((sum, s) => sum + (memberMap.get(s.memberId)?.mmr ?? 0), 0);
  return { ...candidate, teamATotal, teamBTotal, mmrDiff: Math.abs(teamATotal - teamBTotal) };
}

function isCandidateModified(original: MatchCandidate, edited: MatchCandidate): boolean {
  for (let i = 0; i < original.teamA.length; i++) {
    if (original.teamA[i].memberId !== edited.teamA[i].memberId) return true;
    if (original.teamA[i].position !== edited.teamA[i].position) return true;
  }
  for (let i = 0; i < original.teamB.length; i++) {
    if (original.teamB[i].memberId !== edited.teamB[i].memberId) return true;
    if (original.teamB[i].position !== edited.teamB[i].position) return true;
  }
  return false;
}

function deepCloneCandidates(candidates: MatchCandidate[]): MatchCandidate[] {
  return candidates.map((c) => ({
    ...c,
    teamA: c.teamA.map((s) => ({ ...s })),
    teamB: c.teamB.map((s) => ({ ...s })),
  }));
}
export function MatchmakingPage() {
  const { data: members } = useMembers();
  const { execute: generateMatch, isPending: isGenerating } = useGenerateMatch();
  const { execute: createMatch, isPending: isCreating } = useCreateMatch();
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [method, setMethod] = useState<MatchMethod>('algorithm');
  const [originalCandidates, setOriginalCandidates] = useState<MatchCandidate[]>([]);
  const [editedCandidates, setEditedCandidates] = useState<MatchCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState(0);
  const [phase, setPhase] = useState<Phase>('select');
  const [raceKey, setRaceKey] = useState(0);
  const raceCanvasRef = useRef<RaceCanvasHandle>(null);

  const memberMap = new Map(members.map((m) => [m.id, m]));

  const selectedMembers = [...selectedIds]
    .map((id) => memberMap.get(id))
    .filter((m): m is NonNullable<typeof m> => m != null)
    .map((m) => ({ id: m.id, name: m.name }));

  const toggleMember = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 10) {
        next.add(id);
      }
      return next;
    });
  };

  const raceResultsToCandidates = useCallback(
    (results: RaceResult[]): MatchCandidate[] => {
      const toSlot = (r: RaceResult) => {
        const member = memberMap.get(r.memberId);
        return { memberId: r.memberId, position: member?.mainPosition ?? ('mid' as const) };
      };
      const teamA = results.filter((r) => r.finishOrder % 2 === 1).map(toSlot);
      const teamB = results.filter((r) => r.finishOrder % 2 === 0).map(toSlot);
      const teamATotal = teamA.reduce((sum, s) => sum + (memberMap.get(s.memberId)?.mmr ?? 0), 0);
      const teamBTotal = teamB.reduce((sum, s) => sum + (memberMap.get(s.memberId)?.mmr ?? 0), 0);
      return [{ teamA, teamB, teamATotal, teamBTotal, mmrDiff: Math.abs(teamATotal - teamBTotal) }];
    }, [memberMap],
  );

  const handleSubmit = async () => {
    if (selectedIds.size !== 10) {
      openErrorDialog(`참가자 10명을 선택해주세요.\n(현재 ${selectedIds.size}명)`);
      return;
    }

    if (method === 'roulette') {
      setRaceKey((k) => k + 1);
      setPhase('race');
    } else {
      if (isGenerating) return;
      try {
        const result = await generateMatch([...selectedIds]);
        setOriginalCandidates(result);
        setEditedCandidates(deepCloneCandidates(result));
        setSelectedCandidate(0);
        setPhase('candidates');
      } catch (e) {
        openErrorDialog(e instanceof Error ? e.message : '매칭 생성에 실패했습니다.');
      }
    }
  };

  const handleRaceComplete = useCallback(
    (results: RaceResult[]) => {
      const candidates = raceResultsToCandidates(results);
      setOriginalCandidates(candidates);
      setEditedCandidates(deepCloneCandidates(candidates));
      setSelectedCandidate(0);
      setPhase('candidates');
    },
    [raceResultsToCandidates],
  );

  const handleConfirm = async () => {
    if (isCreating) return;
    const candidate = editedCandidates[selectedCandidate];
    if (!candidate) return;
    try {
      await createMatch({ teamA: candidate.teamA, teamB: candidate.teamB });
      navigate({ to: '/history' });
    } catch (e) {
      openErrorDialog(e instanceof Error ? e.message : '매치 생성에 실패했습니다.');
    }
  };

  const handleReroll = async () => {
    if (method === 'roulette') {
      setRaceKey((k) => k + 1);
      setPhase('race');
    } else {
      if (isGenerating) return;
      try {
        const result = await generateMatch([...selectedIds]);
        setOriginalCandidates(result);
        setEditedCandidates(deepCloneCandidates(result));
        setSelectedCandidate(0);
      } catch (e) {
        openErrorDialog(e instanceof Error ? e.message : '매칭 생성에 실패했습니다.');
      }
    }
  };

  const handleBack = () => {
    setPhase('select');
    setOriginalCandidates([]);
    setEditedCandidates([]);
  };

  const handleSwapSlots = useCallback(
    (from: SlotId, to: SlotId) => {
      setEditedCandidates((prev) => {
        const next = deepCloneCandidates(prev);
        const candidate = next[from.candidateIndex];
        if (!candidate) return prev;

        const fromTeam = from.team === 'A' ? candidate.teamA : candidate.teamB;
        const toTeam = to.team === 'A' ? candidate.teamA : candidate.teamB;
        const fromSlot = fromTeam[from.slotIndex];
        const toSlot = toTeam[to.slotIndex];
        if (!fromSlot || !toSlot) return prev;

        if (from.team === to.team) {
          const tempMemberId = fromSlot.memberId;
          const tempPosition = fromSlot.position;
          fromSlot.memberId = toSlot.memberId;
          fromSlot.position = toSlot.position;
          toSlot.memberId = tempMemberId;
          toSlot.position = tempPosition;
        } else {
          const tempMemberId = fromSlot.memberId;
          fromSlot.memberId = toSlot.memberId;
          toSlot.memberId = tempMemberId;
        }

        next[from.candidateIndex] = recalcCandidate(candidate, memberMap);
        return next;
      });
    },
    [memberMap],
  );

  return (
    <>
      <h2 className={common.pageTitle}>매칭</h2>

      {phase === 'select' && (
        <SelectPhase
          members={members}
          selectedIds={selectedIds}
          onToggle={toggleMember}
          onSubmit={handleSubmit}
          submitLabel="매칭 시작"
          loadingLabel="매칭 중..."
          loading={isGenerating}
          method={method}
          onMethodChange={setMethod}
        />
      )}

      {phase === 'race' && (
        <>
          <RaceCanvas
            ref={raceCanvasRef}
            key={raceKey}
            members={selectedMembers}
            onComplete={handleRaceComplete}
          />
          <button
            className={`${common.buttonPrimary} ${styles.forceFinishButton}`}
            onClick={() => raceCanvasRef.current?.forceFinish()}
          >
            즉시 종료
          </button>
        </>
      )}

      {phase === 'candidates' && (
        <CandidatesPhase
          originalCandidates={originalCandidates}
          editedCandidates={editedCandidates}
          selectedCandidate={selectedCandidate}
          onSelect={setSelectedCandidate}
          memberMap={memberMap}
          onConfirm={handleConfirm}
          onReroll={handleReroll}
          onBack={handleBack}
          onSwapSlots={handleSwapSlots}
          loading={isGenerating || isCreating}
          rerollLabel={method === 'roulette' ? '다시 룰렛' : '리롤'}
          rerollLoadingLabel={method === 'roulette' ? undefined : '리롤 중...'}
        />
      )}
    </>
  );
}

function DraggableSlot({
  id,
  slot,
  memberMap,
  isRight,
  isDragging,
  isOver,
}: {
  id: string;
  slot: TeamSlot;
  memberMap: Map<string, Member>;
  isRight: boolean;
  isDragging: boolean;
  isOver: boolean;
}) {
  const { attributes, listeners, setNodeRef: setDragRef } = useDraggable({ id });
  const { setNodeRef: setDropRef, isOver: isDropOver } = useDroppable({ id });
  const member = memberMap.get(slot.memberId);
  const highlighted = isOver || isDropOver;

  return (
    <div
      ref={(node) => {
        setDragRef(node);
        setDropRef(node);
      }}
      className={`${isRight ? cardStyles.memberSlotRight : cardStyles.memberSlot} ${styles.draggableSlot} ${isDragging ? styles.draggableSlotDragging : ''} ${highlighted ? styles.droppableSlotOver : ''}`}
      {...attributes}
      {...listeners}
    >
      <span className={cardStyles.positionTag}>{POSITION_LABELS[slot.position]}</span>
      <span className={cardStyles.memberName}>{member?.name ?? '???'}</span>
    </div>
  );
}

function CandidateCard({
  candidateIndex,
  candidate,
  original,
  isSelected,
  onSelect,
  memberMap,
  onSwapSlots,
}: {
  candidateIndex: number;
  candidate: MatchCandidate;
  original: MatchCandidate;
  isSelected: boolean;
  onSelect: () => void;
  memberMap: Map<string, Member>;
  onSwapSlots: (from: SlotId, to: SlotId) => void;
}) {
  const isDraggingRef = useRef(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const modified = isCandidateModified(original, candidate);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = (event: DragStartEvent) => {
    isDraggingRef.current = true;
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 0);

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = decodeSlotId(active.id as string);
    const to = decodeSlotId(over.id as string);
    if (!from || !to) return;
    if (from.candidateIndex !== to.candidateIndex) return;

    onSwapSlots(from, to);
  };

  const handleCardClick = () => {
    if (isDraggingRef.current) return;
    onSelect();
  };

  const activeSlotId = activeId ? decodeSlotId(activeId) : null;
  const activeSlot = activeSlotId
    ? (activeSlotId.team === 'A' ? candidate.teamA : candidate.teamB)[activeSlotId.slotIndex]
    : null;
  const activeMember = activeSlot ? memberMap.get(activeSlot.memberId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <TeamMatchCard
        teamA={candidate.teamA}
        teamB={candidate.teamB}
        memberMap={memberMap}
        teamATotal={candidate.teamATotal}
        teamBTotal={candidate.teamBTotal}
        mmrDiff={candidate.mmrDiff}
        header={
          <>
            후보 {candidateIndex + 1}
            {modified && <span className={styles.modifiedBadge} style={{ marginLeft: '8px' }}>수정됨</span>}
          </>
        }
        selected={isSelected}
        onClick={handleCardClick}
        renderSlotA={(slot, slotIdx) => {
          const slotId = encodeSlotId({ candidateIndex, team: 'A', slotIndex: slotIdx });
          return (
            <DraggableSlot
              key={slotId}
              id={slotId}
              slot={slot}
              memberMap={memberMap}
              isRight={false}
              isDragging={activeId === slotId}
              isOver={false}
            />
          );
        }}
        renderSlotB={(slot, slotIdx) => {
          const slotId = encodeSlotId({ candidateIndex, team: 'B', slotIndex: slotIdx });
          return (
            <DraggableSlot
              key={slotId}
              id={slotId}
              slot={slot}
              memberMap={memberMap}
              isRight={true}
              isDragging={activeId === slotId}
              isOver={false}
            />
          );
        }}
      />

      <DragOverlay>
        {activeSlot && (
          <div className={styles.dragOverlay}>
            <span className={cardStyles.positionTag}>{POSITION_LABELS[activeSlot.position]}</span>
            <span className={cardStyles.memberName}>{activeMember?.name ?? '???'}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function CandidatesPhase({
  originalCandidates,
  editedCandidates,
  selectedCandidate,
  onSelect,
  memberMap,
  onConfirm,
  onReroll,
  onBack,
  onSwapSlots,
  loading,
  rerollLabel = '리롤',
  rerollLoadingLabel = '리롤 중...',
}: {
  originalCandidates: MatchCandidate[];
  editedCandidates: MatchCandidate[];
  selectedCandidate: number;
  onSelect: (i: number) => void;
  memberMap: Map<string, Member>;
  onConfirm: () => void;
  onReroll: () => void;
  onBack: () => void;
  onSwapSlots: (from: SlotId, to: SlotId) => void;
  loading: boolean;
  rerollLabel?: string;
  rerollLoadingLabel?: string;
}) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>매칭 후보 ({editedCandidates.length}개)</h3>

      <div className={styles.candidateList}>
        {editedCandidates.map((candidate, i) => (
          <CandidateCard
            key={i}
            candidateIndex={i}
            candidate={candidate}
            original={originalCandidates[i]}
            isSelected={selectedCandidate === i}
            onSelect={() => onSelect(i)}
            memberMap={memberMap}
            onSwapSlots={onSwapSlots}
          />
        ))}
      </div>

      <div className={styles.actionBar}>
        <button className={common.buttonSecondary} onClick={onBack}>
          뒤로
        </button>
        <button
          className={common.buttonSecondary}
          style={{ flex: 1 }}
          disabled={loading}
          onClick={onReroll}
        >
          {loading && rerollLoadingLabel ? rerollLoadingLabel : rerollLabel}
        </button>
        <button
          className={common.buttonPrimary}
          style={{ flex: 1 }}
          disabled={loading}
          onClick={onConfirm}
        >
          확정
        </button>
      </div>
    </div>
  );
}
