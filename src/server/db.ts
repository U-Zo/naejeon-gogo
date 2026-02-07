import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error('TURSO_DATABASE_URL environment variable is required');
}

export const db = createClient({
  url,
  authToken,
});

async function initDb(): Promise<void> {
  await db.batch([
    {
      sql: `CREATE TABLE IF NOT EXISTS members (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        mainPosition TEXT NOT NULL,
        subPositions TEXT NOT NULL,
        mmr INTEGER NOT NULL,
        isTemporary INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        streak TEXT
      )`,
      args: [],
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        winner TEXT NOT NULL
      )`,
      args: [],
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS match_slots (
        matchId TEXT NOT NULL,
        team TEXT NOT NULL,
        memberId TEXT NOT NULL,
        position TEXT NOT NULL,
        FOREIGN KEY (matchId) REFERENCES matches(id)
      )`,
      args: [],
    },
  ]);
}

export const dbReady = initDb();
