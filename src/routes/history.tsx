import { createFileRoute } from '@tanstack/react-router';
import { matchesQueryOptions } from '#/client/domains/match';
import { membersQueryOptions } from '#/client/domains/member';
import { HistoryPage } from '#/client/pages/history/history-page';

export const Route = createFileRoute('/history')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(matchesQueryOptions),
      queryClient.ensureQueryData(membersQueryOptions),
    ]),
  component: HistoryPage,
});
