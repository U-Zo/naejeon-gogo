import { queryOptions, useQuery } from '@tanstack/react-query';
import { queryKeys } from '#/client/domains/_shared/queryKeys';
import type { Match } from '#/client/domains/match/model';
import { getMatches } from '#/server/match/match.controller';

export const matchesQueryOptions = queryOptions({
  queryKey: queryKeys.matches,
  queryFn: () => getMatches(),
});

export function useMatches(): { data: Match[]; isLoading: boolean } {
  const { data, isLoading } = useQuery(matchesQueryOptions);
  return { data: data ?? [], isLoading };
}
