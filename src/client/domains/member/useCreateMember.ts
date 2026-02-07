import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '#/client/domains/_shared/queryKeys';
import type { MemberInput } from '#/client/domains/member/model';
import { createMember } from '#/server/member/member.controller';

export function useCreateMember() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: MemberInput) => createMember({ data: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.members }),
  });
  return {
    execute: (input: MemberInput) => mutation.mutateAsync(input),
    isPending: mutation.isPending,
  };
}
