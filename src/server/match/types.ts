import type { Position, TeamSide } from '#/server/shared/types';

export type TeamSlot = {
  memberId: string;
  position: Position;
};

export type MatchStatus = 'in_progress' | 'completed';

export type Match = {
  id: string;
  date: string;
  teamA: TeamSlot[];
  teamB: TeamSlot[];
  status: MatchStatus;
  winner: TeamSide | null;
};

export type MmrDelta = {
  memberId: string;
  delta: number;
};
