import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { IMemberRepository } from '#/server/member/member.repository';
import type { Member } from '#/server/member/types';

const DATA_DIR = resolve(process.cwd(), 'data');
const FILE_PATH = resolve(DATA_DIR, 'members.json');

function readData(): Member[] {
  if (!existsSync(FILE_PATH)) return [];
  return JSON.parse(readFileSync(FILE_PATH, 'utf-8')) as Member[];
}

function writeData(members: Member[]): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(FILE_PATH, JSON.stringify(members, null, 2), 'utf-8');
}

export class JsonMemberRepository implements IMemberRepository {
  async findAll(): Promise<Member[]> {
    return readData().sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }

  async findById(id: string): Promise<Member | null> {
    return readData().find((m) => m.id === id) ?? null;
  }

  async save(member: Member): Promise<void> {
    const members = readData();
    const index = members.findIndex((m) => m.id === member.id);
    if (index >= 0) {
      members[index] = member;
    } else {
      members.push(member);
    }
    writeData(members);
  }

  async saveAll(members: Member[]): Promise<void> {
    writeData(members);
  }

  async delete(id: string): Promise<void> {
    writeData(readData().filter((m) => m.id !== id));
  }
}
