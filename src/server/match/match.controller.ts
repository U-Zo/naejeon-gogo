import { createServerFn } from '@tanstack/react-start';
import { JsonMatchRepository } from '#/server/match/match.repository.json';
import { MatchService } from '#/server/match/match.service';
import { MmrCalculator } from '#/server/match/mmr-calculator';
import type { TeamSlot } from '#/server/match/types';
import { JsonMemberRepository } from '#/server/member/member.repository.json';
import { MemberService } from '#/server/member/member.service';
import type { TeamSide } from '#/server/shared/types';

function getMatchService() {
  return new MatchService(new JsonMatchRepository(), new MmrCalculator());
}

function getMemberService() {
  return new MemberService(new JsonMemberRepository());
}

export const getMatches = createServerFn({ method: 'GET' }).handler(async () => {
  return getMatchService().getAll();
});

export const getMatch = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    return getMatchService().getById(id);
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
