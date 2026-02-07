import type { MmrDelta } from '#/server/match/types';

export interface IMmrCalculator {
  calculate(winnerIds: string[], loserIds: string[]): MmrDelta[];
}

const MMR_CHANGE = 25;

export class MmrCalculator implements IMmrCalculator {
  calculate(winnerIds: string[], loserIds: string[]): MmrDelta[] {
    const deltas: MmrDelta[] = [];

    for (const id of winnerIds) {
      deltas.push({ memberId: id, delta: MMR_CHANGE });
    }

    for (const id of loserIds) {
      deltas.push({ memberId: id, delta: -MMR_CHANGE });
    }

    return deltas;
  }
}
