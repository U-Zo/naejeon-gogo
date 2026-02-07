import { createServerFn } from '@tanstack/react-start';
import { MatchService } from '#/server/match/match.service';
import { MmrCalculator } from '#/server/match/mmr-calculator';
import type { TeamSlot } from '#/server/match/types';
import { MemberService } from '#/server/member/member.service';
import { getMatchRepository, getMemberRepository } from '#/server/repository';
import type { TeamSide } from '#/server/shared/types';

async function getMatchService() {
  return new MatchService(await getMatchRepository(), new MmrCalculator());
}

async function getMemberService() {
  return new MemberService(await getMemberRepository());
}

export const getMatches = createServerFn({ method: 'GET' }).handler(async () => {
  return (await getMatchService()).getAll();
});

export const createMatch = createServerFn({ method: 'POST' })
  .inputValidator((data: { teamA: TeamSlot[]; teamB: TeamSlot[] }) => data)
  .handler(async ({ data }) => {
    return (await getMatchService()).createMatch(data.teamA, data.teamB);
  });

export const completeMatch = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; winner: TeamSide }) => data)
  .handler(async ({ data }) => {
    const matchService = await getMatchService();
    const memberService = await getMemberService();

    const { match, deltas } = await matchService.completeMatch(data.id, data.winner);

    const winnerTeam = data.winner === 'A' ? match.teamA : match.teamB;
    const loserTeam = data.winner === 'A' ? match.teamB : match.teamA;
    const winnerIds = winnerTeam.map((s) => s.memberId);
    const loserIds = loserTeam.map((s) => s.memberId);

    await memberService.applyMmrDeltas(deltas, winnerIds, loserIds);

    return { match, deltas };
  });

export const cancelMatch = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await (await getMatchService()).cancelMatch(data.id);
  });
