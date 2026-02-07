import type { IBalanceCalculator } from '#/server/matchmaking/balance-calculator';
import type { IPositionAssigner } from '#/server/matchmaking/position-assigner';
import type { MatchCandidate } from '#/server/matchmaking/types';
import type { Member } from '#/server/member/types';

export interface IMatchmakingService {
  generateCandidates(members: Member[]): MatchCandidate[];
}

export class MatchmakingService implements IMatchmakingService {
  constructor(
    private positionAssigner: IPositionAssigner,
    private balanceCalculator: IBalanceCalculator,
  ) {}

  generateCandidates(members: Member[]): MatchCandidate[] {
    if (members.length !== 10) {
      throw new Error('정확히 10명의 참가자가 필요합니다.');
    }

    const assignments = this.positionAssigner.assign(members);
    if (!assignments) {
      throw new Error('포지션 배정이 불가능합니다. 참가자들의 포지션을 확인해주세요.');
    }

    return this.balanceCalculator.findBestSplits(assignments);
  }
}
