import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { JsonMemberRepository } from '#/server/member/member.repository.json';
import type { Member } from '#/server/member/types';

const DATA_DIR = resolve(process.cwd(), 'data');
const FILE_PATH = resolve(DATA_DIR, 'members.json');

function makeMember(name: string, id?: string): Member {
  return {
    id: id ?? name,
    name,
    mainPosition: 'mid',
    subPositions: [],
    mmr: 1000,
    isTemporary: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    streak: null,
  };
}

describe('JsonMemberRepository', () => {
  let original: string | null = null;
  const repo = new JsonMemberRepository();

  beforeEach(() => {
    if (existsSync(FILE_PATH)) {
      original = require('node:fs').readFileSync(FILE_PATH, 'utf-8');
    }
  });

  afterEach(() => {
    if (original !== null) {
      writeFileSync(FILE_PATH, original, 'utf-8');
    } else if (existsSync(FILE_PATH)) {
      rmSync(FILE_PATH);
    }
  });

  it('findAll은 이름 기준 가나다순으로 정렬된 결과를 반환한다', async () => {
    const members = [
      makeMember('다람쥐', 'd'),
      makeMember('가나다', 'g'),
      makeMember('바나나', 'b'),
      makeMember('아이유', 'a'),
      makeMember('나비', 'n'),
    ];
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE_PATH, JSON.stringify(members, null, 2), 'utf-8');

    const result = await repo.findAll();

    const names = result.map((m) => m.name);
    expect(names).toEqual(['가나다', '나비', '다람쥐', '바나나', '아이유']);
  });

  it('빈 목록일 때 빈 배열을 반환한다', async () => {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE_PATH, JSON.stringify([], null, 2), 'utf-8');

    const result = await repo.findAll();
    expect(result).toEqual([]);
  });

  it('한 명일 때 그대로 반환한다', async () => {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE_PATH, JSON.stringify([makeMember('가')], null, 2), 'utf-8');

    const result = await repo.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('가');
  });
});
