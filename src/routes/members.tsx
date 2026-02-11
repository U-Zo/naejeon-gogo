import { createFileRoute } from '@tanstack/react-router';
import { matchesQueryOptions } from '#/client/domains/match';
import { membersQueryOptions } from '#/client/domains/member';
import { MembersPage } from '#/client/pages/members/members-page';

export const Route = createFileRoute('/members')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(membersQueryOptions),
      queryClient.ensureQueryData(matchesQueryOptions),
    ]),
  component: MembersPage,
});
