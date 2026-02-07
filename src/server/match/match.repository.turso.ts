import { db, dbReady } from '#/server/db';
import type { IMatchRepository } from '#/server/match/match.repository';
import type { Match, TeamSlot } from '#/server/match/types';

export class TursoMatchRepository implements IMatchRepository {
  async findAll(): Promise<Match[]> {
    await dbReady;
    const matchResult = await db.execute('SELECT * FROM matches');
    const slotResult = await db.execute('SELECT * FROM match_slots');

    const slotsByMatch = new Map<string, { teamA: TeamSlot[]; teamB: TeamSlot[] }>();

    for (const row of slotResult.rows) {
      const matchId = row.matchId as string;
      if (!slotsByMatch.has(matchId)) {
        slotsByMatch.set(matchId, { teamA: [], teamB: [] });
      }
      const slot: TeamSlot = {
        memberId: row.memberId as string,
        position: row.position as TeamSlot['position'],
      };

      const slots = slotsByMatch.get(matchId)!;
      if (row.team === 'A') {
        slots.teamA.push(slot);
      } else {
        slots.teamB.push(slot);
      }
    }

    return matchResult.rows.map((row) => {
      const matchId = row.id as string;
      const slots = slotsByMatch.get(matchId) ?? { teamA: [], teamB: [] };
      return {
        id: matchId,
        date: row.date as string,
        winner: row.winner as Match['winner'],
        teamA: slots.teamA,
        teamB: slots.teamB,
      };
    });
  }

  async findById(id: string): Promise<Match | null> {
    await dbReady;
    const matchResult = await db.execute({ sql: 'SELECT * FROM matches WHERE id = ?', args: [id] });
    if (matchResult.rows.length === 0) return null;

    const row = matchResult.rows[0];
    const slotResult = await db.execute({
      sql: 'SELECT * FROM match_slots WHERE matchId = ?',
      args: [id],
    });

    const teamA: TeamSlot[] = [];
    const teamB: TeamSlot[] = [];

    for (const slotRow of slotResult.rows) {
      const slot: TeamSlot = {
        memberId: slotRow.memberId as string,
        position: slotRow.position as TeamSlot['position'],
      };
      if (slotRow.team === 'A') {
        teamA.push(slot);
      } else {
        teamB.push(slot);
      }
    }

    return {
      id: row.id as string,
      date: row.date as string,
      winner: row.winner as Match['winner'],
      teamA,
      teamB,
    };
  }

  async save(match: Match): Promise<void> {
    await dbReady;
    const slotStatements = [
      { sql: 'DELETE FROM match_slots WHERE matchId = ?', args: [match.id] },
      ...match.teamA.map((slot) => ({
        sql: 'INSERT INTO match_slots (matchId, team, memberId, position) VALUES (?, ?, ?, ?)',
        args: [match.id, 'A', slot.memberId, slot.position],
      })),
      ...match.teamB.map((slot) => ({
        sql: 'INSERT INTO match_slots (matchId, team, memberId, position) VALUES (?, ?, ?, ?)',
        args: [match.id, 'B', slot.memberId, slot.position],
      })),
    ];

    await db.batch([
      {
        sql: `INSERT OR REPLACE INTO matches (id, date, winner) VALUES (?, ?, ?)`,
        args: [match.id, match.date, match.winner],
      },
      ...slotStatements,
    ]);
  }
}
