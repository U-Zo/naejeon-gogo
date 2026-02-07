import type { PositionAssignment } from '#/server/matchmaking/types';
import type { Member } from '#/server/member/types';
import type { Position } from '#/server/shared/types';
import { POSITIONS } from '#/server/shared/types';

export interface IPositionAssigner {
  assign(members: Member[]): PositionAssignment[] | null;
}

export class PositionAssigner implements IPositionAssigner {
  assign(members: Member[]): PositionAssignment[] | null {
    if (members.length !== 10) return null;

    const result: PositionAssignment[] = [];
    const assigned = new Set<string>();

    // Try all permutations using backtracking
    // Each member needs exactly one position, each position needs exactly 2 members (one per team)
    const positionSlots: { position: Position; count: number }[] = POSITIONS.flatMap((p) => [
      { position: p, count: 0 },
      { position: p, count: 1 },
    ]);

    const canPlay = (member: Member, position: Position): boolean => {
      return member.mainPosition === position || member.subPositions.includes(position);
    };

    const backtrack = (slotIdx: number): boolean => {
      if (slotIdx === positionSlots.length) return true;

      const slot = positionSlots[slotIdx];

      // Sort candidates: prefer main position first
      const candidates = members
        .filter((m) => !assigned.has(m.id) && canPlay(m, slot.position))
        .sort((a, b) => {
          const aMain = a.mainPosition === slot.position ? 0 : 1;
          const bMain = b.mainPosition === slot.position ? 0 : 1;
          return aMain - bMain;
        });

      for (const candidate of candidates) {
        assigned.add(candidate.id);
        result.push({
          memberId: candidate.id,
          assignedPosition: slot.position,
          mmr: candidate.mmr,
        });

        if (backtrack(slotIdx + 1)) return true;

        assigned.delete(candidate.id);
        result.pop();
      }

      return false;
    };

    if (!backtrack(0)) return null;
    return result;
  }
}
