import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '#/client/domains/_shared/queryKeys';
import { deleteMember } from '#/server/member/member.controller';

export function useDeleteMember() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => deleteMember({ data: id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.members }),
  });
  return {
    execute: (id: string) => mutation.mutateAsync(id),
    isPending: mutation.isPending,
  };
}
