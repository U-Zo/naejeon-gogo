import type { Member } from '#/server/member/types';

export interface IMemberRepository {
  findAll(): Promise<Member[]>;
  findById(id: string): Promise<Member | null>;
  save(member: Member): Promise<void>;
  saveAll(members: Member[]): Promise<void>;
  delete(id: string): Promise<void>;
}
