import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '#/client/domains/_shared/queryKeys';
import type { TeamSlot } from '#/client/domains/match/model';
import { createMatch } from '#/server/match/match.controller';

export function useCreateMatch() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: { teamA: TeamSlot[]; teamB: TeamSlot[] }) => createMatch({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.matches });
    },
  });
  return {
    execute: (data: { teamA: TeamSlot[]; teamB: TeamSlot[] }) => mutation.mutateAsync(data),
    isPending: mutation.isPending,
  };
}
