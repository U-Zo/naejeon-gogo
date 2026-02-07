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

  async createMatch(teamA: TeamSlot[], teamB: TeamSlot[]): Promise<Match> {
    const match: Match = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      teamA,
      teamB,
      status: 'in_progress',
      winner: null,
    };

    await this.repo.save(match);
    return match;
  }

  async completeMatch(id: string, winner: TeamSide): Promise<{ match: Match; deltas: MmrDelta[] }> {
    const match = await this.repo.findById(id);
    if (!match) {
      throw new Error('매치를 찾을 수 없습니다.');
    }
    if (match.status !== 'in_progress') {
      throw new Error('진행 중인 매치만 완료할 수 있습니다.');
    }

    const updated: Match = { ...match, status: 'completed', winner };
    await this.repo.save(updated);

    const winnerSlots = winner === 'A' ? match.teamA : match.teamB;
    const loserSlots = winner === 'A' ? match.teamB : match.teamA;

    const deltas = this.mmrCalculator.calculate(
      winnerSlots.map((s) => s.memberId),
      loserSlots.map((s) => s.memberId),
    );

    return { match: updated, deltas };
  }

  async cancelMatch(id: string): Promise<void> {
    const match = await this.repo.findById(id);
    if (!match) {
      throw new Error('매치를 찾을 수 없습니다.');
    }
    if (match.status !== 'in_progress') {
      throw new Error('진행 중인 매치만 취소할 수 있습니다.');
    }

    await this.repo.delete(id);
  }
}
