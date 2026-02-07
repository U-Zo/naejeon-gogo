import type { Position, TeamSide } from '#/server/shared/types';

export type TeamSlot = {
  memberId: string;
  position: Position;
};

export type Match = {
  id: string;
  date: string;
  teamA: TeamSlot[];
  teamB: TeamSlot[];
  winner: TeamSide;
};

export type MmrDelta = {
  memberId: string;
  delta: number;
};
