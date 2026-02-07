import { db, dbReady } from '#/server/db';
import type { IMemberRepository } from '#/server/member/member.repository';
import type { Member, Streak } from '#/server/member/types';

function rowToMember(row: Record<string, unknown>): Member {
  return {
    id: row.id as string,
    name: row.name as string,
    mainPosition: row.mainPosition as Member['mainPosition'],
    subPositions: JSON.parse(row.subPositions as string),
    mmr: row.mmr as number,
    isTemporary: row.isTemporary === 1,
    createdAt: row.createdAt as string,
    streak: row.streak ? (JSON.parse(row.streak as string) as Streak) : null,
  };
}

export class TursoMemberRepository implements IMemberRepository {
  async findAll(): Promise<Member[]> {
    await dbReady;
    const result = await db.execute('SELECT * FROM members ORDER BY name ASC');
    return result.rows.map((row) => rowToMember(row as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<Member | null> {
    await dbReady;
    const result = await db.execute({ sql: 'SELECT * FROM members WHERE id = ?', args: [id] });
    if (result.rows.length === 0) return null;
    return rowToMember(result.rows[0] as unknown as Record<string, unknown>);
  }

  async save(member: Member): Promise<void> {
    await dbReady;
    await db.execute({
      sql: `INSERT OR REPLACE INTO members (id, name, mainPosition, subPositions, mmr, isTemporary, createdAt, streak)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        member.id,
        member.name,
        member.mainPosition,
        JSON.stringify(member.subPositions),
        member.mmr,
        member.isTemporary ? 1 : 0,
        member.createdAt,
        member.streak ? JSON.stringify(member.streak) : null,
      ],
    });
  }

  async saveAll(members: Member[]): Promise<void> {
    await dbReady;
    await db.batch([
      { sql: 'DELETE FROM members', args: [] },
      ...members.map((member) => ({
        sql: `INSERT INTO members (id, name, mainPosition, subPositions, mmr, isTemporary, createdAt, streak)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          member.id,
          member.name,
          member.mainPosition,
          JSON.stringify(member.subPositions),
          member.mmr,
          member.isTemporary ? 1 : 0,
          member.createdAt,
          member.streak ? JSON.stringify(member.streak) : null,
        ],
      })),
    ]);
  }

  async delete(id: string): Promise<void> {
    await dbReady;
    await db.execute({ sql: 'DELETE FROM members WHERE id = ?', args: [id] });
  }
}
