import { openDB } from 'idb';

const dbName = 'CoreValuesDB';
const dbVersion = 1;

export async function initDB() {
  const db = await openDB(dbName, dbVersion, {
    upgrade(db) {
      db.createObjectStore('sessions', { keyPath: 'id' });
      db.createObjectStore('rounds', { keyPath: ['sessionId', 'roundNumber'] });
    },
  });
  return db;
}

export async function saveSession(session) {
  const db = await initDB();
  await db.put('sessions', session);
}

export async function saveRound(sessionId, roundNumber, commands) {
  const db = await initDB();
  await db.put('rounds', {
    sessionId,
    roundNumber,
    commands
  });
}

export async function getSessions() {
  const db = await initDB();
  return db.getAll('sessions');
}