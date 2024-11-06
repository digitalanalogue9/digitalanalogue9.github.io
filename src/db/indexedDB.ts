'use client'
import { getEnvBoolean, generateSessionName } from '@/utils';
import { openDB, IDBPDatabase } from 'idb';
import { Session } from "../types/Session";
import { Round } from "@/types/Round";
import { Command } from '@/types/Command';
import { Value, CompletedSession, Categories } from '@/types';

const isBrowser = typeof window !== 'undefined';
const dbName = 'coreValuesData';
const dbVersion = 3;
const storeNames = {
  sessions: 'sessions',
  rounds: 'rounds',
  completedSessions: 'completedSessions',
};

const debug = getEnvBoolean('debug', false);

// Database initialization
export async function initDB(): Promise<IDBPDatabase> {
  if (debug) console.log('🔵 Initializing IndexedDB');
  try {
    const db = await openDB(dbName, dbVersion, {
      upgrade(db, oldVersion, newVersion) {
        if (debug) console.log('🆙 Upgrading IndexedDB schema');
        
        // Create stores
        if (!db.objectStoreNames.contains(storeNames.sessions)) {
          db.createObjectStore(storeNames.sessions, { keyPath: 'id' });
        }
        
        // Handle rounds store
        if (!db.objectStoreNames.contains(storeNames.rounds)) {
          // Create new store with index
          const store = db.createObjectStore(storeNames.rounds, { 
            keyPath: ['sessionId', 'roundNumber'] 
          });
          try {
            store.createIndex('sessionId', 'sessionId');
          } catch (e) {
            console.warn('Failed to create index:', e);
          }
        }

        if (!db.objectStoreNames.contains(storeNames.completedSessions)) {
          db.createObjectStore(storeNames.completedSessions, { keyPath: 'sessionId' });  // Single string, not array
        }
      }
    });
    if (debug) console.log('✅ IndexedDB initialized successfully');
    return db;
  } catch (error) {
    console.error('❌ Error initializing IndexedDB:', error);
    throw error;
  }
}




// Session operations
export async function addSession(session: Omit<Session, 'id'>): Promise<string> {
  if (debug) console.log('💾 Saving session:', session);
  try {
    const db = await initDB();
    const sessionId = await generateSessionName(db);
    await db.put(storeNames.sessions, { ...session, id: sessionId });
    if (debug) console.log('✅ Session saved successfully');
    return sessionId;
  } catch (error) {
    console.error('❌ Error saving session:', error);
    throw error;
  }
}

export async function getSessions(): Promise<Session[]> {
  if (debug) console.log('🔍 Fetching all sessions');
  try {
    const db = await initDB();
    const sessions = await db.getAll(storeNames.sessions);
    if (debug) console.log('✅ Sessions fetched successfully:', sessions);
    return sessions;
  } catch (error) {
    console.error('❌ Error fetching sessions:', error);
    throw error;
  }
}

export async function updateSession(sessionId: string, updates: Partial<Session>) {
  if (debug) console.log('🔄 Updating session:', { sessionId, updates });
  try {
    const db = await initDB();
    const tx = db.transaction(storeNames.sessions, 'readwrite');
    const store = tx.objectStore(storeNames.sessions);
    const session = await store.get(sessionId);
    if (session) {
      await store.put({ ...session, ...updates });
      if (debug) console.log('✅ Session updated successfully');
    }
    await tx.done;
  } catch (error) {
    console.error('❌ Error updating session:', error);
    throw error;
  }
}

// Round operations
export async function saveRound(
  sessionId: string, 
  roundNumber: number, 
  commands: Command[],
  availableCategories: Categories // Add this parameter
): Promise<void> {
  if (debug) console.log('💾 Saving round:', { sessionId, roundNumber, commands });
  try {
    if (!sessionId) return;
    const db = await initDB();
    const existingRound = await db.get(storeNames.rounds, [sessionId, roundNumber]);

    const round: Round = {
      sessionId,
      roundNumber,
      commands,
      availableCategories,
      timestamp: Date.now()
    };

    if (existingRound) {
      if (debug) console.log('🔄 Updating existing round');
      await db.put(storeNames.rounds, {
        ...existingRound,
        commands: round.commands,
        availableCategories : round.availableCategories,
        timestamp: round.timestamp
      });
    } else {
      if (debug) console.log('➕ Creating new round');
      await db.add(storeNames.rounds, round);
    }

    if (debug) console.log('✅ Round saved successfully');
  } catch (error) {
    console.error('❌ Error saving round:', error);
    throw error;
  }
}

export async function getRound(sessionId: string, roundNumber: number): Promise<Round | undefined> {
  if (debug) console.log('🔍 Fetching round:', { sessionId, roundNumber });
  try {
    const db = await initDB();
    const round = await db.get(storeNames.rounds, [sessionId, roundNumber]);
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
    const rounds = await db.getAllFromIndex(storeNames.rounds, 'sessionId', sessionId);
    if (debug) console.log('✅ Rounds fetched successfully:', rounds);
    return rounds;
  } catch (error) {
    console.error('❌ Error fetching rounds:', error);
    throw error;
  }
}

// Completed sessions operations
export async function saveCompletedSession(sessionId: string, finalValues: Value[]) {
  if (debug) console.log('💾 Saving completed session:', { sessionId, valuesCount: finalValues.length });
  try {
    const db = await initDB();
    await db.put(storeNames.completedSessions, {
      sessionId,  // This needs to be included since it's the keyPath
      finalValues,
      timestamp: Date.now()
    });  // No need for second argument since sessionId is in the object as keyPath
    if (debug) console.log('✅ Completed session saved successfully');
  } catch (error) {
    console.error('❌ Error saving completed session:', error);
    throw error;
  }
}

export async function getCompletedSession(sessionId: string): Promise<CompletedSession | undefined> {
  if (debug) console.log('🔍 Fetching completed session:', sessionId);
  try {
    const db = await initDB();
    const completedSession = await db.get(storeNames.completedSessions, sessionId);
    if (debug) console.log('✅ Completed session fetched successfully:', completedSession);
    return completedSession;
  } catch (error) {
    console.error('❌ Error fetching completed session:', error);
    throw error;
  }
}
