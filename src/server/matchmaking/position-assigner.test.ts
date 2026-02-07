import { beforeEach, describe, expect, it } from 'vitest';
import { PositionAssigner } from '#/server/matchmaking/position-assigner';
import { POSITIONS } from '#/server/shared/types';
import { createMember, createStandardMembers, resetCounter } from './test-helpers';

describe('PositionAssigner', () => {
  const assigner = new PositionAssigner();

  beforeEach(() => resetCounter());

  it('포지션별 2명씩 10명이면 정상 배정', () => {
    const members = createStandardMembers();
    const result = assigner.assign(members);

    expect(result).not.toBeNull();
    expect(result).toHaveLength(10);

    // 각 포지션에 정확히 2명씩 배정되었는지 확인
    for (const pos of POSITIONS) {
      const count = result!.filter((r) => r.assignedPosition === pos).length;
      expect(count).toBe(2);
    }
  });

  it('10명이 아니면 null 반환', () => {
    const members = createStandardMembers().slice(0, 8);
    expect(assigner.assign(members)).toBeNull();
  });

  it('빈 배열이면 null 반환', () => {
    expect(assigner.assign([])).toBeNull();
  });

  it('주 포지션을 우선 배정', () => {
    const members = createStandardMembers();
    const result = assigner.assign(members)!;

    // 모든 멤버가 자신의 주 포지션에 배정되었는지 확인
    for (const assignment of result) {
      const member = members.find((m) => m.id === assignment.memberId)!;
      expect(assignment.assignedPosition).toBe(member.mainPosition);
    }
  });

  it('서브 포지션으로 대체 배정 가능', () => {
    // mid 3명, top 1명 — 1명은 서브 포지션(top)으로 배정되어야 함
    const members = [
      createMember({ mainPosition: 'mid', subPositions: ['top'] }),
      createMember({ mainPosition: 'mid' }),
      createMember({ mainPosition: 'mid', subPositions: ['top'] }),
      createMember({ mainPosition: 'top' }),
      createMember({ mainPosition: 'jungle' }),
      createMember({ mainPosition: 'jungle' }),
      createMember({ mainPosition: 'adc' }),
      createMember({ mainPosition: 'adc' }),
      createMember({ mainPosition: 'support' }),
      createMember({ mainPosition: 'support' }),
    ];

    const result = assigner.assign(members);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(10);

    const topAssigned = result!.filter((r) => r.assignedPosition === 'top');
    expect(topAssigned).toHaveLength(2);
  });

  it('주 포지션이 3명 겹치면 서브 포지션으로 분산 배정', () => {
    // mid 3명 중 1명은 서브 포지션(adc)으로 배정되어야 함
    const members = [
      createMember({ mainPosition: 'top' }),
      createMember({ mainPosition: 'top' }),
      createMember({ mainPosition: 'jungle' }),
      createMember({ mainPosition: 'jungle' }),
      createMember({ mainPosition: 'mid' }),
      createMember({ mainPosition: 'mid' }),
      createMember({ mainPosition: 'mid', subPositions: ['adc'] }),
      createMember({ mainPosition: 'adc' }),
      createMember({ mainPosition: 'support' }),
      createMember({ mainPosition: 'support' }),
    ];

    const result = assigner.assign(members);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(10);

    const midAssigned = result!.filter((r) => r.assignedPosition === 'mid');
    const adcAssigned = result!.filter((r) => r.assignedPosition === 'adc');
    expect(midAssigned).toHaveLength(2);
    expect(adcAssigned).toHaveLength(2);

    // mid 주 포지션 3명 중 1명이 adc로 배정되었는지 확인
    const midMainMembers = members.filter((m) => m.mainPosition === 'mid');
    const midMainAssignedToOther = midMainMembers.filter((m) => {
      const assignment = result!.find((r) => r.memberId === m.id);
      return assignment?.assignedPosition !== 'mid';
    });
    expect(midMainAssignedToOther).toHaveLength(1);
    expect(midMainAssignedToOther[0].subPositions).toContain('adc');
  });

  it('주 포지션이 4명 겹치면 서브 포지션이 있는 멤버들로 분산', () => {
    // mid 4명: 2명은 mid에 배정, 나머지 2명은 각각 서브 포지션으로
    const members = [
      createMember({ mainPosition: 'top' }),
      createMember({ mainPosition: 'top' }),
      createMember({ mainPosition: 'mid' }),
      createMember({ mainPosition: 'mid' }),
      createMember({ mainPosition: 'mid', subPositions: ['jungle'] }),
      createMember({ mainPosition: 'mid', subPositions: ['support'] }),
      createMember({ mainPosition: 'adc' }),
      createMember({ mainPosition: 'adc' }),
      createMember({ mainPosition: 'support' }),
      createMember({ mainPosition: 'jungle' }),
    ];

    const result = assigner.assign(members);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(10);

    // 모든 포지션에 정확히 2명씩
    for (const pos of POSITIONS) {
      const count = result!.filter((r) => r.assignedPosition === pos).length;
      expect(count).toBe(2);
    }

    // mid 주 포지션 4명 중 2명만 mid에 배정
    const midMainMembers = members.filter((m) => m.mainPosition === 'mid');
    const midMainInMid = midMainMembers.filter((m) => {
      const assignment = result!.find((r) => r.memberId === m.id);
      return assignment?.assignedPosition === 'mid';
    });
    expect(midMainInMid).toHaveLength(2);
  });

  it('주 포지션 3명 겹침 + 서브 포지션도 없으면 null 반환', () => {
    // mid 3명인데 서브 포지션이 없고, adc는 1명뿐 → 배정 불가
    const members = [
      createMember({ mainPosition: 'top' }),
      createMember({ mainPosition: 'top' }),
      createMember({ mainPosition: 'jungle' }),
      createMember({ mainPosition: 'jungle' }),
      createMember({ mainPosition: 'mid' }),
      createMember({ mainPosition: 'mid' }),
      createMember({ mainPosition: 'mid' }),
      createMember({ mainPosition: 'adc' }),
      createMember({ mainPosition: 'support' }),
      createMember({ mainPosition: 'support' }),
    ];

    expect(assigner.assign(members)).toBeNull();
  });

  it('포지션 배정이 불가능한 조합이면 null 반환', () => {
    // 10명 모두 mid만 가능 — 다른 포지션 채울 수 없음
    const members = Array.from({ length: 10 }, () => createMember({ mainPosition: 'mid' }));
    expect(assigner.assign(members)).toBeNull();
  });

  it('모든 멤버가 고유하게 배정됨 (중복 없음)', () => {
    const members = createStandardMembers();
    const result = assigner.assign(members)!;

    const memberIds = result.map((r) => r.memberId);
    expect(new Set(memberIds).size).toBe(10);
  });
});
