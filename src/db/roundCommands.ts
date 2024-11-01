import { Round } from '@/types';
import { openDB } from 'idb';

const DB_NAME = 'gameDB';
const STORE_NAME = 'roundCommands';

export async function saveRoundCommands(round: Round) {
    const db = await openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: ['sessionId', 'roundNumber'] });
        }
      },
    });
  
    await db.put(STORE_NAME, {
      sessionId: round.sessionId,
      roundNumber: round.roundNumber,
      commands: round.commands,
      timestamp: Date.now(), // Change this to store as number instead of ISO string
    });
  }

export async function getRoundCommands(sessionId: string, roundNumber: number) {
  const db = await openDB(DB_NAME, 1);
  return db.get(STORE_NAME, [sessionId, roundNumber]);
}

export async function getAllRoundCommands() {
  const db = await openDB(DB_NAME, 1);
  return db.getAll(STORE_NAME);
}

export async function getRoundCommandsBySession(sessionId: string) {
  const db = await openDB(DB_NAME, 1);
  const allCommands = await db.getAll(STORE_NAME);
  return allCommands.filter(cmd => cmd.sessionId === sessionId);
}
