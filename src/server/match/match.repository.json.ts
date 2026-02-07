import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { IMatchRepository } from '#/server/match/match.repository';
import type { Match } from '#/server/match/types';

const DATA_PATH = join(process.cwd(), 'data', 'matches.json');

async function ensureFile(): Promise<void> {
  if (!existsSync(DATA_PATH)) {
    await mkdir(dirname(DATA_PATH), { recursive: true });
    await writeFile(DATA_PATH, '[]', 'utf-8');
  }
}

async function readData(): Promise<Match[]> {
  await ensureFile();
  const raw = await readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function writeData(matches: Match[]): Promise<void> {
  await ensureFile();
  await writeFile(DATA_PATH, JSON.stringify(matches, null, 2), 'utf-8');
}

export class JsonMatchRepository implements IMatchRepository {
  async findAll(): Promise<Match[]> {
    return readData();
  }

  async findById(id: string): Promise<Match | null> {
    const matches = await readData();
    return matches.find((m) => m.id === id) ?? null;
  }

  async save(match: Match): Promise<void> {
    const matches = await readData();
    const idx = matches.findIndex((m) => m.id === match.id);
    if (idx >= 0) {
      matches[idx] = match;
    } else {
      matches.push(match);
    }
    await writeData(matches);
  }
}
