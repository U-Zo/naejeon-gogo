import { createFileRoute } from '@tanstack/react-router';
import { membersQueryOptions } from '#/client/domains/member';
import { RacePage } from '#/client/pages/race/race-page';

export const Route = createFileRoute('/race')({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(membersQueryOptions),
  component: RacePage,
});
