'use client'

import { openDB, IDBPDatabase } from 'idb';
import { Session } from "@/types/Session.1";
import { Round } from "@/types/Round";
const isBrowser = typeof window !== 'undefined';
const dbName = 'CoreValuesDB';
const dbVersion = 1;

export async function initDB(): Promise<IDBPDatabase> {
  const db = await openDB(dbName, dbVersion, {
    upgrade(db) {
      db.createObjectStore('sessions', { keyPath: 'id' });
      db.createObjectStore('rounds', { keyPath: ['sessionId', 'roundNumber'] });
    },
  });
  return db;
}

export async function saveSession(session: Session): Promise<void> {
  const db = await initDB();
  await db.put('sessions', session);
}

export async function saveRound(sessionId: string, roundNumber: number, commands: any[]): Promise<void> {
  const db = await initDB();
  await db.put('rounds', {
    sessionId,
    roundNumber,
    commands
  });
}

export async function getSessions(): Promise<Session[]> {
  const db = await initDB();
  return db.getAll('sessions');
}

export async function getRound(sessionId: string, roundNumber: number): Promise<Round | undefined> {
  const db = await initDB();
  return db.get('rounds', [sessionId, roundNumber]);
}
