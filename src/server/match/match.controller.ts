import { createServerFn } from '@tanstack/react-start';
import { TursoMatchRepository } from '#/server/match/match.repository.turso';
import { MatchService } from '#/server/match/match.service';
import { MmrCalculator } from '#/server/match/mmr-calculator';
import type { TeamSlot } from '#/server/match/types';
import { TursoMemberRepository } from '#/server/member/member.repository.turso';
import { MemberService } from '#/server/member/member.service';
import type { TeamSide } from '#/server/shared/types';

function getMatchService() {
  return new MatchService(new TursoMatchRepository(), new MmrCalculator());
}

function getMemberService() {
  return new MemberService(new TursoMemberRepository());
}

export const getMatches = createServerFn({ method: 'GET' }).handler(async () => {
  return getMatchService().getAll();
});

export const recordMatch = createServerFn({ method: 'POST' })
  .inputValidator((data: { teamA: TeamSlot[]; teamB: TeamSlot[]; winner: TeamSide }) => data)
  .handler(async ({ data }) => {
    const matchService = getMatchService();
    const memberService = getMemberService();

    const { match, deltas } = await matchService.recordMatch(data.teamA, data.teamB, data.winner);

    const winnerTeam = data.winner === 'A' ? data.teamA : data.teamB;
    const loserTeam = data.winner === 'A' ? data.teamB : data.teamA;
    const winnerIds = winnerTeam.map((s) => s.memberId);
    const loserIds = loserTeam.map((s) => s.memberId);

    await memberService.applyMmrDeltas(deltas, winnerIds, loserIds);

    return { match, deltas };
  });
