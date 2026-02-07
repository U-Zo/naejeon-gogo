import type { Match, TeamSlot } from '#/client/domains/match';
import { useMatches } from '#/client/domains/match';
import type { Member } from '#/client/domains/member';
import { useMembers } from '#/client/domains/member';
import { POSITION_LABELS } from '#/client/domains/position';
import * as styles from '#/client/pages/history/HistoryPage.css';
import * as common from '#/client/styles/common.css';

export function HistoryPage() {
  const { data: matches } = useMatches();
  const { data: members } = useMembers();
  const memberMap = new Map(members.map((m) => [m.id, m]));

  const sortedMatches = [...matches].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <>
      <h2 className={common.pageTitle}>전적</h2>

      {matches.length === 0 && (
        <div className={common.emptyState}>
          아직 기록된 경기가 없습니다.
          <br />
          매칭 탭에서 경기를 진행해보세요.
        </div>
      )}

      <div className={styles.matchList}>
        {sortedMatches.map((match) => (
          <MatchCard key={match.id} match={match} memberMap={memberMap} />
        ))}
      </div>
    </>
  );
}

function MatchCard({ match, memberMap }: { match: Match; memberMap: Map<string, Member> }) {
  const getName = (id: string) => memberMap.get(id)?.name ?? '???';
  const isWinnerA = match.winner === 'A';

  return (
    <div className={styles.matchCard}>
      <div className={styles.matchHeader}>
        <span className={styles.matchDate}>{formatDate(match.date)}</span>
        <span className={isWinnerA ? styles.winnerBadgeA : styles.winnerBadgeB}>
          팀 {match.winner} 승
        </span>
      </div>

      <div className={styles.matchTeams}>
        <TeamColumn label="A" side="A" slots={match.teamA} getName={getName} isWinner={isWinnerA} />
        <div className={styles.vsColumn}>
          <span className={styles.vsLabel}>VS</span>
        </div>
        <TeamColumn
          label="B"
          side="B"
          slots={match.teamB}
          getName={getName}
          isWinner={!isWinnerA}
        />
      </div>
    </div>
  );
}

function TeamColumn({
  label,
  side,
  slots,
  getName,
  isWinner,
}: {
  label: string;
  side: 'A' | 'B';
  slots: TeamSlot[];
  getName: (id: string) => string;
  isWinner: boolean;
}) {
  return (
    <div className={styles.teamColumn}>
      <span className={side === 'A' ? styles.teamLabelA : styles.teamLabelB}>
        팀 {label} {isWinner && '🏆'}
      </span>
      <div className={styles.teamMembers}>
        {slots.map((slot) => (
          <div
            key={slot.memberId}
            className={side === 'B' ? styles.memberSlotRight : styles.memberSlot}
          >
            <span className={styles.positionTag}>{POSITION_LABELS[slot.position]}</span>
            <span className={styles.memberName}>{getName(slot.memberId)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}`;
}
