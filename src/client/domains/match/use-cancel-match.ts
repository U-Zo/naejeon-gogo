import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '#/client/domains/_shared/query-keys';
import { cancelMatch } from '#/server/match/match.controller';

export function useCancelMatch() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => cancelMatch({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.matches });
    },
  });
  return {
    execute: (id: string) => mutation.mutateAsync(id),
    isPending: mutation.isPending,
  };
}
