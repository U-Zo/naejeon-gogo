import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '#/client/domains/_shared/queryKeys';
import type { TeamSlot } from '#/client/domains/match/model';
import type { TeamSide } from '#/client/domains/position/model';
import { recordMatch } from '#/server/match/match.controller';

export function useRecordMatch() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: { teamA: TeamSlot[]; teamB: TeamSlot[]; winner: TeamSide }) =>
      recordMatch({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.matches });
      queryClient.invalidateQueries({ queryKey: queryKeys.members });
    },
  });
  return {
    execute: (data: { teamA: TeamSlot[]; teamB: TeamSlot[]; winner: TeamSide }) =>
      mutation.mutateAsync(data),
    isPending: mutation.isPending,
  };
}
