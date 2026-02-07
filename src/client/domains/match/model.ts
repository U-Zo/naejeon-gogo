import type { Position, TeamSide } from '#/client/domains/position/model';

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

export type MatchCandidate = {
  teamA: TeamSlot[];
  teamB: TeamSlot[];
  mmrDiff: number;
  teamATotal: number;
  teamBTotal: number;
};
