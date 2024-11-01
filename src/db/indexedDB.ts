'use client'
import { getEnvBoolean,generateSessionName } from '@/utils';
import { openDB, IDBPDatabase } from 'idb';
import { Session } from "../types/Session";
import { Round } from "@/types/Round";
import { Command } from '@/types/Command';

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

export async function addSession(session: Omit<Session, 'id'>): Promise<string> {
  if (debug) console.log('💾 Saving session:', session);
  try {
    const db = await initDB();
    const sessionId = await generateSessionName(db);
    await db.put('sessions', { ...session, id: sessionId });
    if (debug) console.log('✅ Session saved successfully');
    return sessionId;
  } catch (error) {
    console.error('❌ Error saving session:', error);
    throw error;
  }
}

export async function saveRound(
  sessionId: string, 
  roundNumber: number, 
  commands: Command[]
): Promise<void> {
  if (debug) console.log('💾 Saving round:', { sessionId, roundNumber, commands });
  try {
    if (!sessionId) return;
    const db = await initDB();

    const round: Round = {
      sessionId,
      roundNumber,
      commands,
      timestamp: Date.now()
    };

    await db.put('rounds', round);
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

export async function getRoundsBySession(sessionId: string): Promise<Round[]> {
  if (debug) console.log('🔍 Fetching all rounds for session:', sessionId);
  try {
    const db = await initDB();
    const rounds = await db.getAllFromIndex('rounds', 'sessionId', sessionId);
    if (debug) console.log('✅ Rounds fetched successfully:', rounds);
    return rounds;
  } catch (error) {
    console.error('❌ Error fetching rounds:', error);
    throw error;
  }
}

// In src/db/indexedDB.ts (if not already present)
export const updateSession = async (sessionId: string, updates: Partial<Session>) => {
  const db = await initDB();
  const tx = db.transaction('sessions', 'readwrite');
  const store = tx.objectStore('sessions');
  const session = await store.get(sessionId);
  if (session) {
    await store.put({ ...session, ...updates });
  }
  await tx.done;
};
