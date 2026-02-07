import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { IMemberRepository } from '#/server/member/member.repository';
import type { Member } from '#/server/member/types';

const DATA_PATH = join(process.cwd(), 'data', 'members.json');

async function ensureFile(): Promise<void> {
  if (!existsSync(DATA_PATH)) {
    await mkdir(dirname(DATA_PATH), { recursive: true });
    await writeFile(DATA_PATH, '[]', 'utf-8');
  }
}

async function readData(): Promise<Member[]> {
  await ensureFile();
  const raw = await readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function writeData(members: Member[]): Promise<void> {
  await ensureFile();
  const tmpPath = `${DATA_PATH}.tmp`;
  await writeFile(tmpPath, JSON.stringify(members, null, 2), 'utf-8');
  await writeFile(DATA_PATH, JSON.stringify(members, null, 2), 'utf-8');
}

export class JsonMemberRepository implements IMemberRepository {
  async findAll(): Promise<Member[]> {
    return readData();
  }

  async findById(id: string): Promise<Member | null> {
    const members = await readData();
    return members.find((m) => m.id === id) ?? null;
  }

  async save(member: Member): Promise<void> {
    const members = await readData();
    const idx = members.findIndex((m) => m.id === member.id);
    if (idx >= 0) {
      members[idx] = member;
    } else {
      members.push(member);
    }
    await writeData(members);
  }

  async saveAll(members: Member[]): Promise<void> {
    await writeData(members);
  }

  async delete(id: string): Promise<void> {
    const members = await readData();
    const filtered = members.filter((m) => m.id !== id);
    await writeData(filtered);
  }
}
