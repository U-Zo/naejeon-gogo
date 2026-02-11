import { useMutation } from '@tanstack/react-query';
import { generateMatch } from '#/server/matchmaking/matchmaking.controller';

export function useGenerateMatch() {
  const mutation = useMutation({
    mutationFn: (memberIds: string[]) => generateMatch({ data: memberIds }),
  });
  return {
    execute: (memberIds: string[]) => mutation.mutateAsync(memberIds),
    isPending: mutation.isPending,
  };
}
