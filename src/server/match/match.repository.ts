import type { Match } from '#/server/match/types';

export interface IMatchRepository {
  findAll(): Promise<Match[]>;
  findById(id: string): Promise<Match | null>;
  save(match: Match): Promise<void>;
  delete(id: string): Promise<void>;
}
