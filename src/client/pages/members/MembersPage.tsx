import { josa } from 'es-hangul';
import { useState } from 'react';
import { useMatches } from '#/client/domains/match';
import type { Member, MemberInput } from '#/client/domains/member';
import {
  useCreateMember,
  useDeleteMember,
  useMembers,
  useUpdateMember,
} from '#/client/domains/member';
import type { Position } from '#/client/domains/position';
import { POSITION_LABELS, POSITIONS } from '#/client/domains/position';
import * as styles from '#/client/pages/members/MembersPage.css';
import * as common from '#/client/styles/common.css';

type FormMode = 'create' | 'edit';

export function MembersPage() {
  const { data: members } = useMembers();
  const { data: matches } = useMatches();
  const { execute: createMember } = useCreateMember();
  const { execute: updateMember } = useUpdateMember();
  const { execute: deleteMember } = useDeleteMember();

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);

  const handleCreate = async (input: MemberInput) => {
    await createMember(input);
    setShowForm(false);
  };

  const handleUpdate = async (id: string, updates: Partial<MemberInput> & { mmr?: number }) => {
    await updateMember({ id, updates });
    setShowForm(false);
    setEditingMember(null);
  };

  const handleDelete = async (id: string) => {
    await deleteMember(id);
    setDeleteTarget(null);
  };

  const openCreate = () => {
    setFormMode('create');
    setEditingMember(null);
    setShowForm(true);
  };

  const openEdit = (member: Member) => {
    setFormMode('edit');
    setEditingMember(member);
    setShowForm(true);
  };

  const getStats = (memberId: string) => {
    let wins = 0;
    let losses = 0;
    for (const match of matches) {
      const inA = match.teamA.some((s) => s.memberId === memberId);
      const inB = match.teamB.some((s) => s.memberId === memberId);
      if (!inA && !inB) continue;
      if ((inA && match.winner === 'A') || (inB && match.winner === 'B')) {
        wins++;
      } else {
        losses++;
      }
    }
    return { wins, losses };
  };

  const [search, setSearch] = useState('');
  const filtered = members.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
  const regularMembers = filtered.filter((m) => !m.isTemporary);
  const tempMembers = filtered.filter((m) => m.isTemporary);

  return (
    <>
      <h2 className={common.pageTitle}>멤버 관리</h2>

      <MemberStats members={members} matches={matches} />

      <input
        className={common.searchInput}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="멤버 검색"
      />

      {regularMembers.length > 0 && (
        <div className={styles.memberList}>
          {regularMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              stats={getStats(member.id)}
              onEdit={() => openEdit(member)}
              onDelete={() => setDeleteTarget(member)}
            />
          ))}
        </div>
      )}

      {tempMembers.length > 0 && (
        <>
          <h3
            style={{
              fontSize: '0.875rem',
              color: '#a09b8c',
              margin: '16px 0 8px',
            }}
          >
            임시 참가자
          </h3>
          <div className={styles.memberList}>
            {tempMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                stats={getStats(member.id)}
                onEdit={() => openEdit(member)}
                onDelete={() => setDeleteTarget(member)}
              />
            ))}
          </div>
        </>
      )}

      {members.length === 0 && (
        <div className={common.emptyState}>
          등록된 멤버가 없습니다.
          <br />+ 버튼을 눌러 멤버를 추가하세요.
        </div>
      )}

      <div className={styles.addButtonWrapper}>
        <button className={styles.addButton} onClick={openCreate}>
          +
        </button>
      </div>

      {showForm && (
        <MemberForm
          mode={formMode}
          member={editingMember}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onClose={() => {
            setShowForm(false);
            setEditingMember(null);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          member={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}

function MemberStats({ members, matches }: { members: Member[]; matches: { id: string }[] }) {
  const totalMatches = matches.length;
  const avgMmr =
    members.length > 0 ? Math.round(members.reduce((s, m) => s + m.mmr, 0) / members.length) : 0;

  return (
    <div className={styles.statsRow}>
      <div className={styles.statBox}>
        <div className={styles.statValue}>{members.length}</div>
        <div className={styles.statLabel}>멤버</div>
      </div>
      <div className={styles.statBox}>
        <div className={styles.statValue}>{totalMatches}</div>
        <div className={styles.statLabel}>경기</div>
      </div>
      <div className={styles.statBox}>
        <div className={styles.statValue}>{avgMmr}</div>
        <div className={styles.statLabel}>평균 MMR</div>
      </div>
    </div>
  );
}

function MemberCard({
  member,
  stats,
  onEdit,
  onDelete,
}: {
  member: Member;
  stats: { wins: number; losses: number };
  onEdit: () => void;
  onDelete: () => void;
}) {
  const winRate =
    stats.wins + stats.losses > 0
      ? Math.round((stats.wins / (stats.wins + stats.losses)) * 100)
      : 0;

  return (
    <div className={styles.memberCard} onClick={onEdit}>
      <div className={styles.memberInfo}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={styles.memberName}>{member.name}</span>
          {member.isTemporary && <span className={styles.tempBadge}>임시</span>}
          {member.streak && member.streak.count >= 2 && (
            <span
              className={
                member.streak.type === 'win' ? common.streakBadgeWin : common.streakBadgeLose
              }
            >
              {member.streak.count}
              {member.streak.type === 'win' ? '연승' : '연패'}
            </span>
          )}
        </div>
        <div className={styles.memberMeta}>
          <span>{POSITION_LABELS[member.mainPosition]}</span>
          <span>·</span>
          <span className={common.mmrText}>{member.mmr}</span>
          <span>·</span>
          <span>
            {stats.wins}승 {stats.losses}패{stats.wins + stats.losses > 0 && ` (${winRate}%)`}
          </span>
        </div>
        <div className={styles.positionChips}>
          {member.subPositions.map((pos) => (
            <span key={pos} className={common.chip}>
              {POSITION_LABELS[pos]}
            </span>
          ))}
        </div>
      </div>
      <button
        className={common.buttonDanger}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}

function MemberForm({
  mode,
  member,
  onCreate,
  onUpdate,
  onClose,
}: {
  mode: FormMode;
  member: Member | null;
  onCreate: (input: MemberInput) => void;
  onUpdate: (id: string, updates: Partial<MemberInput> & { mmr?: number }) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(member?.name ?? '');
  const [mainPosition, setMainPosition] = useState<Position>(member?.mainPosition ?? 'mid');
  const [subPositions, setSubPositions] = useState<Position[]>(member?.subPositions ?? []);
  const [isTemporary, setIsTemporary] = useState(member?.isTemporary ?? false);
  const [mmr, setMmr] = useState(member?.mmr ?? 1000);
  const [error, setError] = useState('');

  const toggleSub = (pos: Position) => {
    setSubPositions((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos],
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    setError('');

    if (mode === 'create') {
      onCreate({ name, mainPosition, subPositions, isTemporary, mmr });
    } else if (member) {
      onUpdate(member.id, { name, mainPosition, subPositions, isTemporary, mmr });
    }
  };

  return (
    <div className={styles.formOverlay} onClick={onClose}>
      <div className={styles.formSheet} onClick={(e) => e.stopPropagation()}>
        <div className={common.dialogHeader}>
          <h3 className={styles.formTitle}>{mode === 'create' ? '멤버 등록' : '멤버 수정'}</h3>
          <button className={common.closeButton} onClick={onClose}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className={common.fieldGroup}>
          <label className={common.label}>이름</label>
          <input
            className={common.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="소환사명"
          />
        </div>

        <div className={common.fieldGroup}>
          <label className={common.label}>주 포지션</label>
          <div className={styles.positionGrid}>
            {POSITIONS.map((pos) => (
              <button
                key={pos}
                className={styles.positionToggle}
                data-selected={mainPosition === pos}
                onClick={() => setMainPosition(pos)}
              >
                {POSITION_LABELS[pos]}
              </button>
            ))}
          </div>
        </div>

        <div className={common.fieldGroup}>
          <label className={common.label}>부 포지션 (다중 선택 가능)</label>
          <div className={styles.positionGrid}>
            {POSITIONS.filter((p) => p !== mainPosition).map((pos) => (
              <button
                key={pos}
                className={styles.positionToggle}
                data-selected={subPositions.includes(pos)}
                onClick={() => toggleSub(pos)}
              >
                {POSITION_LABELS[pos]}
              </button>
            ))}
          </div>
        </div>

        <div className={common.fieldGroup}>
          <label className={common.label}>MMR</label>
          <input
            className={common.input}
            type="number"
            value={mmr}
            onChange={(e) => setMmr(Number(e.target.value))}
            min={0}
          />
        </div>

        <div className={common.fieldGroup}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              className={styles.checkboxInput}
              checked={isTemporary}
              onChange={(e) => setIsTemporary(e.target.checked)}
            />
            임시 참가자
          </label>
        </div>

        {error && <p className={common.errorText}>{error}</p>}

        <div className={styles.formActions}>
          <button className={common.buttonSecondary} style={{ flex: 1 }} onClick={onClose}>
            취소
          </button>
          <button className={common.buttonPrimary} style={{ flex: 1 }} onClick={handleSubmit}>
            {mode === 'create' ? '등록' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({
  member,
  onConfirm,
  onCancel,
}: {
  member: Member;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className={styles.formOverlay} onClick={onCancel}>
      <div className={styles.formSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.deleteConfirmContent}>
          <p className={styles.deleteConfirmText}>
            <strong>{member.name}</strong>
            {josa(member.name, '을/를').slice(member.name.length)} 삭제하시겠습니까?
            <br />
            <span style={{ fontSize: '0.875rem', color: '#a09b8c' }}>
              이 작업은 되돌릴 수 없습니다.
            </span>
          </p>
          <div className={styles.deleteConfirmActions}>
            <button className={common.buttonSecondary} onClick={onCancel}>
              취소
            </button>
            <button className={common.buttonDanger} onClick={onConfirm}>
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
