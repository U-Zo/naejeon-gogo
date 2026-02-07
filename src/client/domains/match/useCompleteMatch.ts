import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '#/client/domains/_shared/queryKeys';
import type { TeamSide } from '#/client/domains/position/model';
import { completeMatch } from '#/server/match/match.controller';

export function useCompleteMatch() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: { id: string; winner: TeamSide }) => completeMatch({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.matches });
      queryClient.invalidateQueries({ queryKey: queryKeys.members });
    },
  });
  return {
    execute: (data: { id: string; winner: TeamSide }) => mutation.mutateAsync(data),
    isPending: mutation.isPending,
  };
}
