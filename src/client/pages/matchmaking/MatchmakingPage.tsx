import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { openErrorDialog } from '#/client/components/ErrorDialog';
import type { MatchCandidate } from '#/client/domains/match';
import { useCreateMatch } from '#/client/domains/match';
import { useGenerateMatch } from '#/client/domains/matchmaking';
import type { Member } from '#/client/domains/member';
import { useMembers } from '#/client/domains/member';
import { POSITION_LABELS } from '#/client/domains/position';
import * as styles from '#/client/pages/matchmaking/MatchmakingPage.css';
import * as common from '#/client/styles/common.css';

type Phase = 'select' | 'candidates';

export function MatchmakingPage() {
  const { data: members } = useMembers();
  const { execute: generateMatch, isPending: isGenerating } = useGenerateMatch();
  const { execute: createMatch, isPending: isCreating } = useCreateMatch();
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [candidates, setCandidates] = useState<MatchCandidate[]>([]);
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
      setCandidates(result);
      setSelectedCandidate(0);
      setPhase('candidates');
    } catch (e) {
      openErrorDialog(e instanceof Error ? e.message : '매칭 생성에 실패했습니다.');
    }
  };

  const handleConfirm = async () => {
    if (isCreating) return;
    const candidate = candidates[selectedCandidate];
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
      setCandidates(result);
      setSelectedCandidate(0);
    } catch (e) {
      openErrorDialog(e instanceof Error ? e.message : '매칭 생성에 실패했습니다.');
    }
  };

  const handleBack = () => {
    setPhase('select');
    setCandidates([]);
  };

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
          candidates={candidates}
          selectedCandidate={selectedCandidate}
          onSelect={setSelectedCandidate}
          memberMap={memberMap}
          onConfirm={handleConfirm}
          onReroll={handleReroll}
          onBack={handleBack}
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
  const filtered = members.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

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

function CandidatesPhase({
  candidates,
  selectedCandidate,
  onSelect,
  memberMap,
  onConfirm,
  onReroll,
  onBack,
  loading,
}: {
  candidates: MatchCandidate[];
  selectedCandidate: number;
  onSelect: (i: number) => void;
  memberMap: Map<string, Member>;
  onConfirm: () => void;
  onReroll: () => void;
  onBack: () => void;
  loading: boolean;
}) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>매칭 후보 ({candidates.length}개)</h3>

      {candidates.map((candidate, i) => (
        <button
          key={i}
          type="button"
          className={styles.candidateCard}
          data-selected={selectedCandidate === i}
          onClick={() => onSelect(i)}
        >
          <div className={styles.candidateHeader}>
            <span className={styles.candidateIndex}>후보 {i + 1}</span>
            <span className={styles.mmrDiffBadge}>MMR 차이: {candidate.mmrDiff}</span>
          </div>

          <div className={styles.teamSection}>
            <div className={styles.teamLabelA}>
              <span>팀 A</span>
              <span className={styles.teamMmr}>{candidate.teamATotal}</span>
            </div>
            {candidate.teamA.map((slot) => {
              const member = memberMap.get(slot.memberId);
              return (
                <div key={slot.memberId} className={styles.slotRow}>
                  <span className={styles.slotPosition}>{POSITION_LABELS[slot.position]}</span>
                  <span className={styles.slotName}>{member?.name ?? '???'}</span>
                  <span className={common.mmrText}>{member?.mmr ?? 0}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.vsText}>VS</div>

          <div className={styles.teamSection}>
            <div className={styles.teamLabelB}>
              <span>팀 B</span>
              <span className={styles.teamMmr}>{candidate.teamBTotal}</span>
            </div>
            {candidate.teamB.map((slot) => {
              const member = memberMap.get(slot.memberId);
              return (
                <div key={slot.memberId} className={styles.slotRow}>
                  <span className={styles.slotPosition}>{POSITION_LABELS[slot.position]}</span>
                  <span className={styles.slotName}>{member?.name ?? '???'}</span>
                  <span className={common.mmrText}>{member?.mmr ?? 0}</span>
                </div>
              );
            })}
          </div>
        </button>
      ))}

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
