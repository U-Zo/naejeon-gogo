import { beforeEach, describe, expect, it } from 'vitest';
import { BalanceCalculator } from '#/server/matchmaking/balance-calculator';
import type { PositionAssignment } from '#/server/matchmaking/types';
import type { Position } from '#/server/shared/types';
import { resetCounter } from './test-helpers';

function createAssignments(mmrPairs: Record<Position, [number, number]>): PositionAssignment[] {
  let id = 0;
  const result: PositionAssignment[] = [];

  for (const [pos, [mmr1, mmr2]] of Object.entries(mmrPairs)) {
    result.push({ memberId: `p${++id}`, assignedPosition: pos as Position, mmr: mmr1 });
    result.push({ memberId: `p${++id}`, assignedPosition: pos as Position, mmr: mmr2 });
  }

  return result;
}

describe('BalanceCalculator', () => {
  const calculator = new BalanceCalculator();

  beforeEach(() => resetCounter());

  it('10명의 배정에서 최대 3개 후보를 반환', () => {
    const assignments = createAssignments({
      top: [1000, 1000],
      jungle: [1000, 1000],
      mid: [1000, 1000],
      adc: [1000, 1000],
      support: [1000, 1000],
    });

    const candidates = calculator.findBestSplits(assignments);
    expect(candidates.length).toBeGreaterThanOrEqual(1);
    expect(candidates.length).toBeLessThanOrEqual(3);
  });

  it('모든 MMR이 동일하면 차이가 0', () => {
    const assignments = createAssignments({
      top: [1000, 1000],
      jungle: [1000, 1000],
      mid: [1000, 1000],
      adc: [1000, 1000],
      support: [1000, 1000],
    });

    const candidates = calculator.findBestSplits(assignments);
    expect(candidates[0].mmrDiff).toBe(0);
  });

  it('MMR 차이가 적은 순서로 정렬', () => {
    const assignments = createAssignments({
      top: [1200, 800],
      jungle: [1100, 900],
      mid: [1050, 950],
      adc: [1000, 1000],
      support: [1000, 1000],
    });

    const candidates = calculator.findBestSplits(assignments);
    for (let i = 1; i < candidates.length; i++) {
      expect(candidates[i].mmrDiff).toBeGreaterThanOrEqual(candidates[i - 1].mmrDiff);
    }
  });

  it('각 후보의 teamA + teamB 합이 전체 MMR과 일치', () => {
    const assignments = createAssignments({
      top: [1200, 800],
      jungle: [1100, 900],
      mid: [1050, 950],
      adc: [1000, 1000],
      support: [1000, 1000],
    });

    const totalMmr = assignments.reduce((sum, a) => sum + a.mmr, 0);
    const candidates = calculator.findBestSplits(assignments);

    for (const c of candidates) {
      expect(c.teamATotal + c.teamBTotal).toBe(totalMmr);
    }
  });

  it('각 팀에 5개 포지션이 모두 존재', () => {
    const assignments = createAssignments({
      top: [1000, 900],
      jungle: [1100, 1000],
      mid: [1050, 950],
      adc: [1000, 1000],
      support: [950, 1050],
    });

    const candidates = calculator.findBestSplits(assignments);
    const positions = ['top', 'jungle', 'mid', 'adc', 'support'].sort();

    for (const c of candidates) {
      const teamAPos = c.teamA.map((s) => s.position).sort();
      const teamBPos = c.teamB.map((s) => s.position).sort();
      expect(teamAPos).toEqual(positions);
      expect(teamBPos).toEqual(positions);
    }
  });

  it('후보 간 중복 팀 구성이 없음', () => {
    const assignments = createAssignments({
      top: [1200, 800],
      jungle: [1100, 900],
      mid: [1050, 950],
      adc: [1000, 1000],
      support: [1000, 1000],
    });

    const candidates = calculator.findBestSplits(assignments);
    const keys = candidates.map((c) =>
      c.teamA
        .map((s) => s.memberId)
        .sort()
        .join(','),
    );

    expect(new Set(keys).size).toBe(keys.length);
  });

  it('10명이 아닌 배정이면 빈 배열 반환', () => {
    const assignments: PositionAssignment[] = [
      { memberId: 'p1', assignedPosition: 'mid', mmr: 1000 },
    ];
    expect(calculator.findBestSplits(assignments)).toEqual([]);
  });

  it('극단적 MMR 차이에서도 최선의 밸런스를 찾음', () => {
    // 포지션 4개는 [2000, 500], 1개는 [1000, 1000]
    // 최적: 짝수개(4개) 포지션을 2-2로 교차 배치 → 차이 0
    const assignments = createAssignments({
      top: [2000, 500],
      jungle: [2000, 500],
      mid: [2000, 500],
      adc: [2000, 500],
      support: [1000, 1000],
    });

    const candidates = calculator.findBestSplits(assignments);
    expect(candidates[0].mmrDiff).toBe(0);
  });
});
