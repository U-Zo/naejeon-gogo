import { createServerFn } from '@tanstack/react-start';
import { TursoMemberRepository } from '#/server/member/member.repository.turso';
import { MemberService } from '#/server/member/member.service';
import type { MemberInput } from '#/server/member/types';

function getService() {
  return new MemberService(new TursoMemberRepository());
}

export const getMembers = createServerFn({ method: 'GET' }).handler(async () => {
  return getService().getAll();
});

export const createMember = createServerFn({ method: 'POST' })
  .inputValidator((input: MemberInput) => input)
  .handler(async ({ data: input }) => {
    return getService().create(input);
  });

export const updateMember = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: Partial<MemberInput> & { mmr?: number } }) => data)
  .handler(async ({ data }) => {
    return getService().update(data.id, data.updates);
  });

export const deleteMember = createServerFn({ method: 'POST' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    return getService().remove(id);
  });
