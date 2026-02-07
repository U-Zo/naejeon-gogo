import type { MmrDelta } from '#/server/match/types';
import type { IMemberRepository } from '#/server/member/member.repository';
import type { Member, MemberInput } from '#/server/member/types';

const INITIAL_MMR = 1000;

export class MemberService {
  constructor(private repo: IMemberRepository) {}

  async getAll(): Promise<Member[]> {
    return this.repo.findAll();
  }

  async getById(id: string): Promise<Member | null> {
    return this.repo.findById(id);
  }

  async create(input: MemberInput): Promise<Member> {
    if (!input.name.trim()) {
      throw new Error('이름을 입력해주세요.');
    }

    const member: Member = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      mainPosition: input.mainPosition,
      subPositions: input.subPositions,
      mmr: INITIAL_MMR,
      isTemporary: input.isTemporary,
      createdAt: new Date().toISOString(),
      streak: null,
    };

    await this.repo.save(member);
    return member;
  }

  async update(id: string, updates: Partial<MemberInput> & { mmr?: number }): Promise<Member> {
    const member = await this.repo.findById(id);
    if (!member) {
      throw new Error('멤버를 찾을 수 없습니다.');
    }

    const updated: Member = {
      ...member,
      ...(updates.name !== undefined && { name: updates.name.trim() }),
      ...(updates.mainPosition !== undefined && { mainPosition: updates.mainPosition }),
      ...(updates.subPositions !== undefined && { subPositions: updates.subPositions }),
      ...(updates.isTemporary !== undefined && { isTemporary: updates.isTemporary }),
      ...(updates.mmr !== undefined && { mmr: Math.max(0, updates.mmr) }),
    };

    await this.repo.save(updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async applyMmrDeltas(deltas: MmrDelta[], winnerIds: string[], loserIds: string[]): Promise<void> {
    const members = await this.repo.findAll();
    const memberMap = new Map(members.map((m) => [m.id, m]));

    for (const delta of deltas) {
      const member = memberMap.get(delta.memberId);
      if (member) {
        member.mmr = Math.max(0, member.mmr + delta.delta);
      }
    }

    const winnerSet = new Set(winnerIds);
    const loserSet = new Set(loserIds);

    for (const member of memberMap.values()) {
      if (winnerSet.has(member.id)) {
        member.streak =
          member.streak?.type === 'win'
            ? { count: member.streak.count + 1, type: 'win' }
            : { count: 1, type: 'win' };
      } else if (loserSet.has(member.id)) {
        member.streak =
          member.streak?.type === 'lose'
            ? { count: member.streak.count + 1, type: 'lose' }
            : { count: 1, type: 'lose' };
      }
    }

    await this.repo.saveAll([...memberMap.values()]);
  }
}
