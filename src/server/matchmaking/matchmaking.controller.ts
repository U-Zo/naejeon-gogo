import { createServerFn } from '@tanstack/react-start';
import { BalanceCalculator } from '#/server/matchmaking/balance-calculator';
import { MatchmakingService } from '#/server/matchmaking/matchmaking.service';
import { PositionAssigner } from '#/server/matchmaking/position-assigner';
import { MemberService } from '#/server/member/member.service';
import { getMemberRepository } from '#/server/repository';

function getService() {
  return new MatchmakingService(new PositionAssigner(), new BalanceCalculator());
}

async function getMemberService() {
  return new MemberService(await getMemberRepository());
}

export const generateMatch = createServerFn({ method: 'POST' })
  .inputValidator((memberIds: string[]) => memberIds)
  .handler(async ({ data: memberIds }) => {
    if (memberIds.length !== 10) {
      throw new Error('정확히 10명의 참가자를 선택해주세요.');
    }

    const memberService = await getMemberService();
    const members = await Promise.all(memberIds.map((id: string) => memberService.getById(id)));

    const validMembers = members.filter((m) => m !== null);
    if (validMembers.length !== 10) {
      throw new Error('존재하지 않는 멤버가 포함되어 있습니다.');
    }

    return getService().generateCandidates(validMembers);
  });
