import type { Position, TeamSide } from '#/client/domains/position/model';

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

export type MatchCandidate = {
  teamA: TeamSlot[];
  teamB: TeamSlot[];
  mmrDiff: number;
  teamATotal: number;
  teamBTotal: number;
};
