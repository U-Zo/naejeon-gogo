import { createServerFn } from '@tanstack/react-start';
import { MemberService } from '#/server/member/member.service';
import type { MemberInput } from '#/server/member/types';
import { getMemberRepository } from '#/server/repository';

async function getService() {
  return new MemberService(await getMemberRepository());
}

export const getMembers = createServerFn({ method: 'GET' }).handler(async () => {
  return (await getService()).getAll();
});

export const createMember = createServerFn({ method: 'POST' })
  .inputValidator((input: MemberInput) => input)
  .handler(async ({ data: input }) => {
    return (await getService()).create(input);
  });

export const updateMember = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: Partial<MemberInput> & { mmr?: number } }) => data)
  .handler(async ({ data }) => {
    return (await getService()).update(data.id, data.updates);
  });

export const deleteMember = createServerFn({ method: 'POST' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    return (await getService()).remove(id);
  });
