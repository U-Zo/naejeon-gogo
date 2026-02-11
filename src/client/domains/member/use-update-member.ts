import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '#/client/domains/_shared/query-keys';
import type { MemberInput } from '#/client/domains/member/model';
import { updateMember } from '#/server/member/member.controller';

export function useUpdateMember() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<MemberInput> & { mmr?: number } }) =>
      updateMember({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.members }),
  });
  return {
    execute: (data: { id: string; updates: Partial<MemberInput> & { mmr?: number } }) =>
      mutation.mutateAsync(data),
    isPending: mutation.isPending,
  };
}
