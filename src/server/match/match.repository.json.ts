import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { IMatchRepository } from '#/server/match/match.repository';
import type { Match } from '#/server/match/types';

const DATA_DIR = resolve(process.cwd(), 'data');
const FILE_PATH = resolve(DATA_DIR, 'matches.json');

function readData(): Match[] {
  if (!existsSync(FILE_PATH)) return [];
  return JSON.parse(readFileSync(FILE_PATH, 'utf-8')) as Match[];
}

function writeData(matches: Match[]): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(FILE_PATH, JSON.stringify(matches, null, 2), 'utf-8');
}

export class JsonMatchRepository implements IMatchRepository {
  async findAll(): Promise<Match[]> {
    return readData();
  }

  async findById(id: string): Promise<Match | null> {
    return readData().find((m) => m.id === id) ?? null;
  }

  async save(match: Match): Promise<void> {
    const matches = readData();
    const index = matches.findIndex((m) => m.id === match.id);
    if (index >= 0) {
      matches[index] = match;
    } else {
      matches.push(match);
    }
    writeData(matches);
  }

  async delete(id: string): Promise<void> {
    writeData(readData().filter((m) => m.id !== id));
  }
}
