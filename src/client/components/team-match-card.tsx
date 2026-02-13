import type { ReactNode } from 'react';
import type { TeamSlot } from '#/client/domains/match';
import type { Member } from '#/client/domains/member';
import { POSITION_LABELS } from '#/client/domains/position';
import * as styles from './team-match-card.css';

type TeamMatchCardProps = {
  teamA: TeamSlot[];
  teamB: TeamSlot[];
  memberMap: Map<string, Member>;
  teamATotal?: number;
  teamBTotal?: number;
  mmrDiff?: number;
  header?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  renderSlotA?: (slot: TeamSlot, index: number) => ReactNode;
  renderSlotB?: (slot: TeamSlot, index: number) => ReactNode;
};

function DefaultSlot({
  slot,
  memberMap,
  isRight,
}: { slot: TeamSlot; memberMap: Map<string, Member>; isRight: boolean }) {
  const member = memberMap.get(slot.memberId);
  return (
    <div className={isRight ? styles.memberSlotRight : styles.memberSlot}>
      <span className={styles.positionTag}>{POSITION_LABELS[slot.position]}</span>
      <span className={styles.memberName}>{member?.name ?? '???'}</span>
    </div>
  );
}

export function TeamMatchCard({
  teamA,
  teamB,
  memberMap,
  teamATotal,
  teamBTotal,
  mmrDiff,
  header,
  selected,
  onClick,
  renderSlotA,
  renderSlotB,
}: TeamMatchCardProps) {
  const clickable = onClick != null;

  return (
    <div
      className={`${styles.card} ${clickable ? styles.cardClickable : ''}`}
      data-selected={selected}
      onClick={onClick}
    >
      {(header != null || mmrDiff != null) && (
        <div className={styles.header}>
          {header != null ? (
            <span className={styles.headerTitle}>{header}</span>
          ) : (
            <span />
          )}
          {mmrDiff != null && (
            <span className={styles.mmrDiffBadge}>MMR 차이: {mmrDiff}</span>
          )}
        </div>
      )}

      <div className={styles.matchTeams}>
        <div className={styles.teamColumn}>
          <span className={styles.teamLabelA}>
            팀 A {teamATotal != null && <span className={styles.teamMmr}>{teamATotal}</span>}
          </span>
          <div className={styles.teamMembers}>
            {teamA.map((slot, i) =>
              renderSlotA ? (
                renderSlotA(slot, i)
              ) : (
                <DefaultSlot key={slot.memberId} slot={slot} memberMap={memberMap} isRight={false} />
              ),
            )}
          </div>
        </div>

        <div className={styles.vsColumn}>
          <span className={styles.vsLabel}>VS</span>
        </div>

        <div className={styles.teamColumn}>
          <span className={styles.teamLabelB}>
            {teamBTotal != null && <span className={styles.teamMmr}>{teamBTotal}</span>} 팀 B
          </span>
          <div className={styles.teamMembers}>
            {teamB.map((slot, i) =>
              renderSlotB ? (
                renderSlotB(slot, i)
              ) : (
                <DefaultSlot key={slot.memberId} slot={slot} memberMap={memberMap} isRight={true} />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
