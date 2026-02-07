import type { TeamSlot } from '#/server/match/types';
import type { MatchCandidate, PositionAssignment } from '#/server/matchmaking/types';
import { POSITIONS } from '#/server/shared/types';

export interface IBalanceCalculator {
  findBestSplits(assignments: PositionAssignment[]): MatchCandidate[];
}

export class BalanceCalculator implements IBalanceCalculator {
  private readonly TOP_N = 3;

  findBestSplits(assignments: PositionAssignment[]): MatchCandidate[] {
    if (assignments.length !== 10) return [];

    // Group by position — each position has exactly 2 players
    const byPosition = new Map<string, PositionAssignment[]>();
    for (const a of assignments) {
      const list = byPosition.get(a.assignedPosition) ?? [];
      list.push(a);
      byPosition.set(a.assignedPosition, list);
    }

    // Generate all possible splits: for each position, player 0 or 1 goes to team A
    // 5 positions × 2 choices = 2^5 = 32 combinations
    const candidates: MatchCandidate[] = [];
    const positionEntries = POSITIONS.map((p) => byPosition.get(p)!);

    for (let mask = 0; mask < 32; mask++) {
      const teamA: TeamSlot[] = [];
      const teamB: TeamSlot[] = [];
      let teamATotal = 0;
      let teamBTotal = 0;

      for (let i = 0; i < 5; i++) {
        const pair = positionEntries[i];
        const aIdx = (mask >> i) & 1;
        const bIdx = 1 - aIdx;

        teamA.push({ memberId: pair[aIdx].memberId, position: pair[aIdx].assignedPosition });
        teamB.push({ memberId: pair[bIdx].memberId, position: pair[bIdx].assignedPosition });
        teamATotal += pair[aIdx].mmr;
        teamBTotal += pair[bIdx].mmr;
      }

      candidates.push({
        teamA,
        teamB,
        mmrDiff: Math.abs(teamATotal - teamBTotal),
        teamATotal,
        teamBTotal,
      });
    }

    // Sort by MMR difference and return top N
    candidates.sort((a, b) => a.mmrDiff - b.mmrDiff);

    // Deduplicate mirrored teams (mask and ~mask produce same split)
    const seen = new Set<string>();
    const unique: MatchCandidate[] = [];
    for (const c of candidates) {
      const key = c.teamA
        .map((s) => s.memberId)
        .sort()
        .join(',');
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(c);
      }
      if (unique.length >= this.TOP_N) break;
    }

    return unique;
  }
}
