import { beforeEach, describe, expect, it } from 'vitest';
import { BalanceCalculator } from '#/server/matchmaking/balance-calculator';
import { MatchmakingService } from '#/server/matchmaking/matchmaking.service';
import { PositionAssigner } from '#/server/matchmaking/position-assigner';
import { createMember, createStandardMembers, resetCounter } from './test-helpers';

describe('MatchmakingService', () => {
  const service = new MatchmakingService(new PositionAssigner(), new BalanceCalculator());

  beforeEach(() => resetCounter());

  it('10명의 유효한 멤버로 후보를 생성', () => {
    const members = createStandardMembers();
    const candidates = service.generateCandidates(members);

    expect(candidates.length).toBeGreaterThanOrEqual(1);
    expect(candidates.length).toBeLessThanOrEqual(3);

    for (const c of candidates) {
      expect(c.teamA).toHaveLength(5);
      expect(c.teamB).toHaveLength(5);
    }
  });

  it('10명이 아니면 에러', () => {
    const members = createStandardMembers().slice(0, 8);
    expect(() => service.generateCandidates(members)).toThrow('정확히 10명');
  });

  it('포지션 배정 불가능하면 에러', () => {
    const members = Array.from({ length: 10 }, () => createMember({ mainPosition: 'mid' }));
    expect(() => service.generateCandidates(members)).toThrow('포지션 배정이 불가능');
  });

  it('MMR 차이가 있는 멤버들로도 밸런스 있는 후보 생성', () => {
    const members = createStandardMembers({
      top: [1200, 800],
      jungle: [1100, 900],
      mid: [1300, 700],
      adc: [1050, 950],
      support: [1000, 1000],
    });

    const candidates = service.generateCandidates(members);

    // 첫 번째 후보가 가장 밸런스가 좋아야 함
    expect(candidates[0].mmrDiff).toBeLessThanOrEqual(candidates[candidates.length - 1].mmrDiff);
  });

  it('서브 포지션이 있는 멤버 조합에서도 후보 생성', () => {
    const members = [
      createMember({ mainPosition: 'top' }),
      createMember({ mainPosition: 'top', subPositions: ['jungle'] }),
      createMember({ mainPosition: 'jungle' }),
      createMember({ mainPosition: 'mid', subPositions: ['jungle'] }),
      createMember({ mainPosition: 'mid' }),
      createMember({ mainPosition: 'mid', subPositions: ['adc'] }),
      createMember({ mainPosition: 'adc' }),
      createMember({ mainPosition: 'adc', subPositions: ['support'] }),
      createMember({ mainPosition: 'support' }),
      createMember({ mainPosition: 'support' }),
    ];

    const candidates = service.generateCandidates(members);
    expect(candidates.length).toBeGreaterThanOrEqual(1);
  });

  it('생성된 후보의 모든 멤버가 원본 목록에 존재', () => {
    const members = createStandardMembers();
    const candidates = service.generateCandidates(members);
    const memberIds = new Set(members.map((m) => m.id));

    for (const c of candidates) {
      for (const slot of [...c.teamA, ...c.teamB]) {
        expect(memberIds.has(slot.memberId)).toBe(true);
      }
    }
  });

  it('생성된 후보에서 한 멤버가 양 팀에 동시 배정되지 않음', () => {
    const members = createStandardMembers();
    const candidates = service.generateCandidates(members);

    for (const c of candidates) {
      const allIds = [...c.teamA, ...c.teamB].map((s) => s.memberId);
      expect(new Set(allIds).size).toBe(10);
    }
  });
});
