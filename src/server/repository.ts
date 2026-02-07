import type { IMatchRepository } from '#/server/match/match.repository';
import type { IMemberRepository } from '#/server/member/member.repository';

const isProduction = process.env.NODE_ENV === 'production';

export async function getMatchRepository(): Promise<IMatchRepository> {
  if (isProduction) {
    const { TursoMatchRepository } = await import('#/server/match/match.repository.turso');
    return new TursoMatchRepository();
  }
  const { JsonMatchRepository } = await import('#/server/match/match.repository.json');
  return new JsonMatchRepository();
}

export async function getMemberRepository(): Promise<IMemberRepository> {
  if (isProduction) {
    const { TursoMemberRepository } = await import('#/server/member/member.repository.turso');
    return new TursoMemberRepository();
  }
  const { JsonMemberRepository } = await import('#/server/member/member.repository.json');
  return new JsonMemberRepository();
}
