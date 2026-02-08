import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useRef, useState } from 'react';
import { openErrorDialog } from '#/client/components/ErrorDialog';
import type { MatchCandidate, TeamSlot } from '#/client/domains/match';
import { useCreateMatch } from '#/client/domains/match';
import { useGenerateMatch } from '#/client/domains/matchmaking';
import type { Member } from '#/client/domains/member';
import { filterMembersByName, useMembers } from '#/client/domains/member';
import { POSITION_LABELS } from '#/client/domains/position';
import { ShineBorder } from '#/client/components/ShineBorder';
import * as styles from '#/client/pages/matchmaking/MatchmakingPage.css';
import * as common from '#/client/styles/common.css';


function getStreakShines(count: number) {
  if (count >= 5) {
    const d = 7;
    return [
      { duration: d, shineColor: ['#d84a10', '#cc30a0'], delay: 0 },
      { duration: d, shineColor: ['#10a8c8', '#30b818'], delay: d / 3 },
      { duration: d, shineColor: ['#c8a010', '#d84a10'], delay: (d * 2) / 3 },
    ];
  }
  if (count === 4) {
    const d = 8;
    return [
      { duration: d, shineColor: ['#d84a10', '#b83838'], delay: 0 },
      { duration: d, shineColor: ['#c88030', '#d84a10'], delay: d / 2 },
    ];
  }
  if (count === 3) {
    return [{ duration: 10, shineColor: ['#b07850', '#a06858'], delay: 0 }];
  }
  return [{ duration: 12, shineColor: ['#6a5018', '#5a4828'], delay: 0 }];
}

type Phase = 'select' | 'candidates';

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
  const [originalCandidates, setOriginalCandidates] = useState<MatchCandidate[]>([]);
  const [editedCandidates, setEditedCandidates] = useState<MatchCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState(0);
  const [phase, setPhase] = useState<Phase>('select');

  const memberMap = new Map(members.map((m) => [m.id, m]));

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

  const handleGenerate = async () => {
    if (isGenerating) return;
    if (selectedIds.size !== 10) {
      openErrorDialog(`참가자 10명을 선택해주세요.\n(현재 ${selectedIds.size}명)`);
      return;
    }
    try {
      const result = await generateMatch([...selectedIds]);
      setOriginalCandidates(result);
      setEditedCandidates(deepCloneCandidates(result));
      setSelectedCandidate(0);
      setPhase('candidates');
    } catch (e) {
      openErrorDialog(e instanceof Error ? e.message : '매칭 생성에 실패했습니다.');
    }
  };

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
    if (isGenerating) return;
    try {
      const result = await generateMatch([...selectedIds]);
      setOriginalCandidates(result);
      setEditedCandidates(deepCloneCandidates(result));
      setSelectedCandidate(0);
    } catch (e) {
      openErrorDialog(e instanceof Error ? e.message : '매칭 생성에 실패했습니다.');
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
          // Same team: swap member + position
          const tempMemberId = fromSlot.memberId;
          const tempPosition = fromSlot.position;
          fromSlot.memberId = toSlot.memberId;
          fromSlot.position = toSlot.position;
          toSlot.memberId = tempMemberId;
          toSlot.position = tempPosition;
        } else {
          // Cross team: swap members only (keep positions)
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
          onGenerate={handleGenerate}
          loading={isGenerating}
        />
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
        />
      )}
    </>
  );
}

function SelectPhase({
  members,
  selectedIds,
  onToggle,
  onGenerate,
  loading,
}: {
  members: Member[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onGenerate: () => void;
  loading: boolean;
}) {
  const [search, setSearch] = useState('');
  const filtered = filterMembersByName(members, search);

  return (
    <div className={styles.section}>
      <p className={styles.selectionCount}>
        참가자 선택: <span className={styles.selectionCountHighlight}>{selectedIds.size}</span>
        /10
      </p>

      <input
        className={common.searchInput}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="멤버 검색"
      />

      <div className={styles.memberGrid}>
        {filtered.map((member) => {
          const selected = selectedIds.has(member.id);
          return (
            <div
              key={member.id}
              className={styles.memberRow}
              data-selected={selected}
              onClick={() => onToggle(member.id)}
            >
              {member.streak?.type === 'win' &&
                member.streak.count >= 2 &&
                getStreakShines(member.streak.count).map((shine, i) => (
                  <ShineBorder key={i} borderWidth={1} {...shine} />
                ))}
              <div className={styles.memberRowInfo}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className={styles.memberRowName}>{member.name}</span>
                  {member.streak && member.streak.count >= 2 && (
                    <span
                      className={
                        member.streak.type === 'win'
                          ? common.streakBadgeWin
                          : common.streakBadgeLose
                      }
                    >
                      {member.streak.count}
                      {member.streak.type === 'win' ? '연승' : '연패'}
                    </span>
                  )}
                </div>
                <div className={styles.memberRowMeta}>
                  <span>{POSITION_LABELS[member.mainPosition]}</span>
                  <span className={common.mmrText}>{member.mmr}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {members.length === 0 && (
        <div className={common.emptyState}>
          등록된 멤버가 없습니다.
          <br />
          멤버 탭에서 먼저 멤버를 등록하세요.
        </div>
      )}

      <div className={styles.actionBar}>
        <button
          className={common.buttonPrimary}
          style={{ flex: 1 }}
          disabled={loading}
          onClick={onGenerate}
        >
          {loading ? '매칭 중...' : '매칭 시작'}
        </button>
      </div>
    </div>
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
      className={`${isRight ? styles.memberSlotRight : styles.memberSlot} ${styles.draggableSlot} ${isDragging ? styles.draggableSlotDragging : ''} ${highlighted ? styles.droppableSlotOver : ''}`}
      {...attributes}
      {...listeners}
    >
      <span className={styles.positionTag}>{POSITION_LABELS[slot.position]}</span>
      <span className={styles.memberName}>{member?.name ?? '???'}</span>
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
      <div
        className={styles.candidateCard}
        data-selected={isSelected}
        onClick={handleCardClick}
      >
        <div className={styles.candidateHeader}>
          <span className={styles.candidateIndex}>
            후보 {candidateIndex + 1}
            {modified && <span className={styles.modifiedBadge} style={{ marginLeft: '8px' }}>수정됨</span>}
          </span>
          <span className={styles.mmrDiffBadge}>MMR 차이: {candidate.mmrDiff}</span>
        </div>

        <div className={styles.matchTeams}>
          <div className={styles.teamColumn}>
            <span className={styles.teamLabelA}>
              팀 A <span className={styles.teamMmr}>{candidate.teamATotal}</span>
            </span>
            <div className={styles.teamMembers}>
              {candidate.teamA.map((slot, slotIdx) => {
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
              })}
            </div>
          </div>

          <div className={styles.vsColumn}>
            <span className={styles.vsLabel}>VS</span>
          </div>

          <div className={styles.teamColumn}>
            <span className={styles.teamLabelB}>
              <span className={styles.teamMmr}>{candidate.teamBTotal}</span> 팀 B
            </span>
            <div className={styles.teamMembers}>
              {candidate.teamB.map((slot, slotIdx) => {
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
              })}
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeSlot && (
          <div className={styles.dragOverlay}>
            <span className={styles.positionTag}>{POSITION_LABELS[activeSlot.position]}</span>
            <span className={styles.memberName}>{activeMember?.name ?? '???'}</span>
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
          {loading ? '리롤 중...' : '리롤'}
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
