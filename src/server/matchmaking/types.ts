import type { TeamSlot } from '#/server/match/types';
import type { Position } from '#/server/shared/types';

export type PositionAssignment = {
  memberId: string;
  assignedPosition: Position;
  mmr: number;
};

export type MatchCandidate = {
  teamA: TeamSlot[];
  teamB: TeamSlot[];
  mmrDiff: number;
  teamATotal: number;
  teamBTotal: number;
};
