import type { Member } from '#/server/member/types';
import type { Position } from '#/server/shared/types';

let counter = 0;

export function createMember(
  overrides: Partial<Member> & { mainPosition: Position } = { mainPosition: 'mid' },
): Member {
  counter++;
  return {
    id: overrides.id ?? `m${counter}`,
    name: overrides.name ?? `Player${counter}`,
    mainPosition: overrides.mainPosition,
    subPositions: overrides.subPositions ?? [],
    mmr: overrides.mmr ?? 1000,
    isTemporary: overrides.isTemporary ?? false,
    createdAt: overrides.createdAt ?? '2026-01-01T00:00:00.000Z',
    streak: overrides.streak ?? null,
  };
}

export function resetCounter() {
  counter = 0;
}

/** 포지션별 2명씩 총 10명의 기본 멤버 셋 생성 */
export function createStandardMembers(mmrMap?: Partial<Record<Position, [number, number]>>): Member[] {
  const positions: Position[] = ['top', 'jungle', 'mid', 'adc', 'support'];
  const members: Member[] = [];

  for (const pos of positions) {
    const [mmr1, mmr2] = mmrMap?.[pos] ?? [1000, 1000];
    members.push(createMember({ mainPosition: pos, mmr: mmr1 }));
    members.push(createMember({ mainPosition: pos, mmr: mmr2 }));
  }

  return members;
}
