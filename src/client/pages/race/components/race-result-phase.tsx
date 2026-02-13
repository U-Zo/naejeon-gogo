import * as common from '#/client/styles/common.css';
import * as styles from '../race-page.css';
import type { RaceResult } from '../engine/types';

type RaceResultPhaseProps = {
  results: RaceResult[];
  onConfirm: () => void;
  onRerun: () => void;
  onBack: () => void;
  loading: boolean;
};

export function RaceResultPhase({
  results,
  onConfirm,
  onRerun,
  onBack,
  loading,
}: RaceResultPhaseProps) {
  const teamA = results.filter((r) => r.finishOrder <= 5);
  const teamB = results.filter((r) => r.finishOrder > 5);

  return (
    <div className={styles.resultContainer}>
      <div className={styles.resultTeams}>
        <div className={styles.resultTeamColumn}>
          <div className={styles.resultTeamLabelA}>Team A</div>
          {teamA.map((r) => (
            <div key={r.memberId} className={styles.resultMemberRow}>
              <span className={styles.resultRank}>{r.finishOrder}</span>
              <span className={styles.resultName}>{r.name}</span>
            </div>
          ))}
        </div>

        <div className={styles.resultTeamColumn}>
          <div className={styles.resultTeamLabelB}>Team B</div>
          {teamB.map((r) => (
            <div key={r.memberId} className={styles.resultMemberRow}>
              <span className={styles.resultRank}>{r.finishOrder}</span>
              <span className={styles.resultName}>{r.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actionBar}>
        <button
          type="button"
          className={common.buttonPrimary}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? '저장 중...' : '매치 확정'}
        </button>
        <button
          type="button"
          className={common.buttonSecondary}
          onClick={onRerun}
          disabled={loading}
        >
          다시 룰렛
        </button>
        <button
          type="button"
          className={common.buttonSecondary}
          onClick={onBack}
          disabled={loading}
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}
