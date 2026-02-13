import { useState } from 'react';
import { ShineBorder } from '#/client/components/shine-border';
import type { Member } from '#/client/domains/member';
import { filterMembersByName } from '#/client/domains/member';
import { POSITION_LABELS } from '#/client/domains/position';
import * as styles from '#/client/pages/matchmaking/matchmaking-page.css';
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

export type MatchMethod = 'algorithm' | 'roulette';

type SelectPhaseProps = {
  members: Member[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  method?: MatchMethod;
  onMethodChange?: (method: MatchMethod) => void;
};

export function SelectPhase({
  members,
  selectedIds,
  onToggle,
  onSubmit,
  submitLabel,
  loadingLabel,
  loading = false,
  disabled = false,
  method,
  onMethodChange,
}: SelectPhaseProps) {
  const [search, setSearch] = useState('');
  const filtered = filterMembersByName(members, search);

  return (
    <div className={styles.section}>
      {method != null && onMethodChange != null && (
        <div className={styles.methodToggle}>
          <div
            className={styles.methodOption}
            data-active={method === 'algorithm'}
            onClick={() => onMethodChange('algorithm')}
          >
            자동
          </div>
          <div
            className={styles.methodOption}
            data-active={method === 'roulette'}
            onClick={() => onMethodChange('roulette')}
          >
            룰렛 (Beta)
          </div>
        </div>
      )}

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
          disabled={disabled || loading}
          onClick={onSubmit}
        >
          {loading && loadingLabel ? loadingLabel : submitLabel}
        </button>
      </div>
    </div>
  );
}
