'use client'
import { getEnvBoolean } from '@/utils/envUtils';
import { openDB, IDBPDatabase } from 'idb';
import { Session } from "@/types/Session";

import { Round } from "@/types/Round";
const isBrowser = typeof window !== 'undefined';
const dbName = 'CoreValuesDB';
const dbVersion = 1;

const debug = getEnvBoolean('debug', false);

export async function initDB(): Promise<IDBPDatabase> {
    if (debug) console.log('🔵 Initializing IndexedDB');
  try {
    const db = await openDB(dbName, dbVersion, {
      upgrade(db) {
        if (debug) console.log('🆙 Upgrading IndexedDB schema');
        db.createObjectStore('sessions', { keyPath: 'id' });
        db.createObjectStore('rounds', { keyPath: ['sessionId', 'roundNumber'] });
      },
    });
    if (debug) console.log('✅ IndexedDB initialized successfully');
    return db;
  } catch (error) {
    console.error('❌ Error initializing IndexedDB:', error);
    throw error;
  }
}

export async function saveSession(session: Session): Promise<void> {
  if (debug) console.log('💾 Saving session:', session);
  try {
    const db = await initDB();
    await db.put('sessions', session);
    if (debug) console.log('✅ Session saved successfully');
  } catch (error) {
    console.error('❌ Error saving session:', error);
    throw error;
  }
}

export async function saveRound(sessionId: string, roundNumber: number, commands: any[]): Promise<void> {
  if (debug) console.log('💾 Saving round:', { sessionId, roundNumber, commands });
  try {
    const db = await initDB();
    await db.put('rounds', {
      sessionId,
      roundNumber,
      commands
    });
    if (debug) console.log('✅ Round saved successfully');
  } catch (error) {
    console.error('❌ Error saving round:', error);
    throw error;
  }
}

export async function getSessions(): Promise<Session[]> {
  if (debug) console.log('🔍 Fetching all sessions');
  try {
    const db = await initDB();
    const sessions = await db.getAll('sessions');
    if (debug) console.log('✅ Sessions fetched successfully:', sessions);
    return sessions;
  } catch (error) {
    console.error('❌ Error fetching sessions:', error);
    throw error;
  }
}

export async function getRound(sessionId: string, roundNumber: number): Promise<Round | undefined> {
  if (debug) console.log('🔍 Fetching round:', { sessionId, roundNumber });
  try {
    const db = await initDB();
    const round = await db.get('rounds', [sessionId, roundNumber]);
    if (debug) console.log('✅ Round fetched successfully:', round);
    return round;
  } catch (error) {
    console.error('❌ Error fetching round:', error);
    throw error;
  }
}
