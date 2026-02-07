import { createFileRoute } from '@tanstack/react-router';
import { membersQueryOptions } from '#/client/domains/member';
import { MatchmakingPage } from '#/client/pages/matchmaking/MatchmakingPage';

export const Route = createFileRoute('/')({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(membersQueryOptions),
  component: MatchmakingPage,
});
