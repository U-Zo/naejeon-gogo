import type { IMatchRepository } from '#/server/match/match.repository';
import type { IMmrCalculator } from '#/server/match/mmr-calculator';
import type { Match, MmrDelta, TeamSlot } from '#/server/match/types';
import type { TeamSide } from '#/server/shared/types';

export class MatchService {
  constructor(
    private repo: IMatchRepository,
    private mmrCalculator: IMmrCalculator,
  ) {}

  async getAll(): Promise<Match[]> {
    const matches = await this.repo.findAll();
    return matches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getById(id: string): Promise<Match | null> {
    return this.repo.findById(id);
  }

  async recordMatch(
    teamA: TeamSlot[],
    teamB: TeamSlot[],
    winner: TeamSide,
  ): Promise<{ match: Match; deltas: MmrDelta[] }> {
    const match: Match = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      teamA,
      teamB,
      winner,
    };

    await this.repo.save(match);

    const winnerSlots = winner === 'A' ? teamA : teamB;
    const loserSlots = winner === 'A' ? teamB : teamA;

    const deltas = this.mmrCalculator.calculate(
      winnerSlots.map((s) => s.memberId),
      loserSlots.map((s) => s.memberId),
    );

    return { match, deltas };
  }
}
