import { queryOptions, useQuery } from '@tanstack/react-query';
import { queryKeys } from '#/client/domains/_shared/query-keys';
import type { Member } from '#/client/domains/member/model';
import { getMembers } from '#/server/member/member.controller';

export const membersQueryOptions = queryOptions({
  queryKey: queryKeys.members,
  queryFn: () => getMembers(),
});

export function useMembers(): { data: Member[]; isLoading: boolean } {
  const { data, isLoading } = useQuery(membersQueryOptions);
  return { data: data ?? [], isLoading };
}
