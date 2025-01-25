'use client';

import { generateSessionName } from '@/components/features/Exercise/utils';
import { openDB, IDBPDatabase } from 'idb';
import { Session } from '@/lib/types/Session';
import { Round } from '@/lib/types/Round';
import { Command } from '@/lib/types/Command';
import { Value, CompletedSession, Categories } from '@/lib/types';

const isBrowser = typeof window !== 'undefined';
const dbName = 'coreValuesData';
const dbVersion = 4;
const storeNames = {
  sessions: 'sessions',
  rounds: 'rounds',
  completedSessions: 'completedSessions',
};
const isDebug = process.env.NEXT_PUBLIC_DEBUG === 'true';

// Database initialization
/**
 * Initializes the IndexedDB database with the specified schema.
 *
 * This function opens the IndexedDB database with the given name and version.
 * If the database needs to be upgraded, it creates the necessary object stores
 * and indexes.
 *
 * @returns {Promise<IDBPDatabase>} A promise that resolves to the initialized IndexedDB database instance.
 *
 * @throws Will throw an error if the database initialization fails.
 *
 * @example
 * ```typescript
 * initDB().then(db => {
 *   console.log('Database initialized:', db);
 * }).catch(error => {
 *   console.error('Failed to initialize database:', error);
 * });
 * ```
 */
export async function initDB(): Promise<IDBPDatabase> {
  if (isDebug) console.log('🔵 Initializing IndexedDB');
  try {
    const db = await openDB(dbName, dbVersion, {
      upgrade(db, oldVersion, newVersion) {
        if (isDebug) console.log('🆙 Upgrading IndexedDB schema');

        // Create stores
        if (!db.objectStoreNames.contains(storeNames.sessions)) {
          db.createObjectStore(storeNames.sessions, {
            keyPath: 'id',
          });
        }

        // Handle rounds store
        if (!db.objectStoreNames.contains(storeNames.rounds)) {
          // Create new store with index
          const store = db.createObjectStore(storeNames.rounds, {
            keyPath: ['sessionId', 'roundNumber'],
          });
          try {
            store.createIndex('sessionId', 'sessionId');
          } catch (e) {
            console.warn('Failed to create index:', e);
          }
        }
        if (!db.objectStoreNames.contains(storeNames.completedSessions)) {
          db.createObjectStore(storeNames.completedSessions, {
            keyPath: 'sessionId',
          }); // Single string, not array
        }
      },
    });
    if (isDebug) console.log('✅ IndexedDB initialized successfully');
    return db;
  } catch (error) {
    console.error('❌ Error initializing IndexedDB:', error);
    throw error;
  }
}

// Session operations
/**
 * Retrieves a session from the IndexedDB using the provided session ID.
 *
 * @param sessionId - The unique identifier of the session to fetch.
 * @returns A promise that resolves to the session object if found, or undefined if not found.
 * @throws Will throw an error if there is an issue fetching the session from the database.
 */
export async function getSession(sessionId: string): Promise<Session | undefined> {
  if (isDebug) console.log('🔍 Fetching session:', sessionId);
  try {
    const db = await initDB();
    const session = await db.get(storeNames.sessions, sessionId);
    if (session && !session.exerciseType) {
      session.exerciseType = 'personal'; // Default to 'personal' if not present
    }
    if (isDebug) console.log('✅ Session fetched successfully:', session);
    return session;
  } catch (error) {
    console.error('❌ Error fetching session:', error);
    throw error;
  }
}

/**
 * Adds a new session to the IndexedDB and creates an initial round for it.
 *
 * @param session - The session object to be added, excluding the 'id' property.
 * @param initialCategories - The initial categories to be used in the first round.
 * @returns A promise that resolves to the generated session ID.
 * @throws Will throw an error if there is an issue saving the session or initial round.
 */
export async function addSession(session: Omit<Session, 'id'>, initialCategories: Categories): Promise<string> {
  if (isDebug) console.log('💾 Saving session:', session);
  try {
    const db = await initDB();
    const sessionId = await generateSessionName(db);

    // Start a transaction that includes both stores
    const tx = db.transaction([storeNames.sessions, storeNames.rounds], 'readwrite');

    // Save the session
    await tx.objectStore(storeNames.sessions).put({
      ...session,
      id: sessionId,
    });

    // Create initial round
    const initialRound: Round = {
      sessionId,
      roundNumber: 1,
      commands: [],
      availableCategories: initialCategories,
      timestamp: Date.now(),
    };

    // Save the initial round
    await tx.objectStore(storeNames.rounds).add(initialRound);

    // Wait for the transaction to complete
    await tx.done;

    if (isDebug) console.log('✅ Session and initial round saved successfully');
    return sessionId;
  } catch (error) {
    console.error('❌ Error saving session:', error);
    throw error;
  }
}
/**
 * Fetches all sessions from the IndexedDB.
 *
 * @returns {Promise<Session[]>} A promise that resolves to an array of sessions.
 * @throws Will throw an error if there is an issue fetching the sessions.
 *
 * @example
 * ```typescript
 * getSessions().then(sessions => {
 *   console.log(sessions);
 * }).catch(error => {
 *   console.error('Error fetching sessions:', error);
 * });
 * ```
 */
export async function getSessions(): Promise<Session[]> {
  if (isDebug) console.log('🔍 Fetching all sessions');
  try {
    const db = await initDB();
    const sessions = await db.getAll(storeNames.sessions);
    sessions.forEach(session => {
      if (!session.exerciseType) {
        session.exerciseType = 'personal';
      }
    });
    if (isDebug) console.log('✅ Sessions fetched successfully:', sessions);
    return sessions;
  } catch (error) {
    console.error('❌ Error fetching sessions:', error);
    throw error;
  }
}
/**
 * Updates a session in the IndexedDB with the given updates.
 *
 * @param {string} sessionId - The ID of the session to update.
 * @param {Partial<Session>} updates - An object containing the updates to apply to the session.
 * @returns {Promise<void>} A promise that resolves when the session has been updated.
 * @throws Will throw an error if the update operation fails.
 */
export async function updateSession(sessionId: string, updates: Partial<Session>) {
  if (isDebug)
    console.log('🔄 Updating session:', {
      sessionId,
      updates,
    });
  try {
    const db = await initDB();
    const tx = db.transaction(storeNames.sessions, 'readwrite');
    const store = tx.objectStore(storeNames.sessions);
    const session = await store.get(sessionId);
    if (session) {
      await store.put({
        ...session,
        ...updates,
      });
      if (isDebug) console.log('✅ Session updated successfully');
    }
    await tx.done;
  } catch (error) {
    console.error('❌ Error updating session:', error);
    throw error;
  }
}

// Round operations
/**
 * Saves a round to the IndexedDB.
 *
 * @param {string} sessionId - The ID of the session.
 * @param {number} roundNumber - The number of the round.
 * @param {Command[]} commands - The list of commands executed in the round.
 * @param {Categories} availableCategories - The available categories for the round.
 * @returns {Promise<void>} A promise that resolves when the round is saved.
 *
 * @throws Will throw an error if there is an issue saving the round.
 */
export async function saveRound(
  sessionId: string,
  roundNumber: number,
  commands: Command[],
  availableCategories: Categories // Add this parameter
): Promise<void> {
  if (isDebug)
    console.log('💾 Saving round:', {
      sessionId,
      roundNumber,
      commands,
    });
  try {
    if (!sessionId) return;
    const db = await initDB();
    const existingRound = await db.get(storeNames.rounds, [sessionId, roundNumber]);
    const round: Round = {
      sessionId,
      roundNumber,
      commands,
      availableCategories,
      timestamp: Date.now(),
    };
    if (existingRound) {
      if (isDebug) console.log('🔄 Updating existing round');
      await db.put(storeNames.rounds, {
        ...existingRound,
        commands: round.commands,
        availableCategories: round.availableCategories,
        timestamp: round.timestamp,
      });
    } else {
      if (isDebug) console.log('➕ Creating new round');
      await db.add(storeNames.rounds, round);
    }
    if (isDebug) console.log('✅ Round saved successfully');
  } catch (error) {
    console.error('❌ Error saving round:', error);
    throw error;
  }
}
/**
 * Fetches a specific round from the IndexedDB based on the given session ID and round number.
 *
 * @param sessionId - The ID of the session to which the round belongs.
 * @param roundNumber - The number of the round to fetch.
 * @returns A promise that resolves to the fetched round, or undefined if the round is not found.
 * @throws Will throw an error if there is an issue fetching the round from the database.
 */
export async function getRound(sessionId: string, roundNumber: number): Promise<Round | undefined> {
  if (isDebug)
    console.log('🔍 Fetching round:', {
      sessionId,
      roundNumber,
    });
  try {
    const db = await initDB();
    const round = await db.get(storeNames.rounds, [sessionId, roundNumber]);
    if (isDebug) console.log('✅ Round fetched successfully:', round);
    return round;
  } catch (error) {
    console.error('❌ Error fetching round:', error);
    throw error;
  }
}
/**
 * Fetches all rounds associated with a given session ID from the IndexedDB.
 *
 * @param {string} sessionId - The ID of the session for which to fetch rounds.
 * @returns {Promise<Round[]>} A promise that resolves to an array of rounds associated with the session ID.
 * @throws Will throw an error if there is an issue fetching the rounds from the database.
 */
export async function getRoundsBySession(sessionId: string): Promise<Round[]> {
  if (isDebug) console.log('🔍 Fetching all rounds for session:', sessionId);
  try {
    const db = await initDB();
    const rounds = await db.getAllFromIndex(storeNames.rounds, 'sessionId', sessionId);
    if (isDebug) console.log('✅ Rounds fetched successfully:', rounds);
    return rounds;
  } catch (error) {
    console.error('❌ Error fetching rounds:', error);
    throw error;
  }
}

// Completed sessions operations
/**
 * Saves a completed session to the IndexedDB.
 *
 * @param {string} sessionId - The unique identifier for the session.
 * @param {Value[]} finalValues - An array of final values associated with the session.
 * @returns {Promise<void>} A promise that resolves when the session is successfully saved.
 * @throws Will throw an error if there is an issue saving the session.
 */
export async function saveCompletedSession(sessionId: string, finalValues: Value[]) {
  if (isDebug)
    console.log('💾 Saving completed session:', {
      sessionId,
      valuesCount: finalValues.length,
    });
  try {
    const db = await initDB();
    await db.put(storeNames.completedSessions, {
      sessionId,
      // This needs to be included since it's the keyPath
      finalValues,
      timestamp: Date.now(),
    }); // No need for second argument since sessionId is in the object as keyPath
    if (isDebug) console.log('✅ Completed session saved successfully');
  } catch (error) {
    console.error('❌ Error saving completed session:', error);
    throw error;
  }
}
/**
 * Fetches a completed session from the IndexedDB.
 *
 * @param {string} sessionId - The ID of the session to fetch.
 * @returns {Promise<CompletedSession | undefined>} A promise that resolves to the completed session if found, or undefined if not found.
 * @throws Will throw an error if there is an issue fetching the session from the database.
 */
export async function getCompletedSession(sessionId: string): Promise<CompletedSession | undefined> {
  if (isDebug) console.log('🔍 Fetching completed session:', sessionId);
  try {
    const db = await initDB();
    const completedSession = await db.get(storeNames.completedSessions, sessionId);
    if (isDebug) console.log('✅ Completed session fetched successfully:', completedSession);
    return completedSession;
  } catch (error) {
    console.error('❌ Error fetching completed session:', error);
    throw error;
  }
}

/**
 * Deletes a session and its associated rounds from the IndexedDB.
 *
 * @param sessionId - The ID of the session to be deleted.
 * @returns A promise that resolves when the session and its rounds have been deleted.
 *
 * @throws Will throw an error if there is an issue deleting the session or rounds.
 *
 * @example
 * ```typescript
 * await deleteSession('sessionId123');
 * ```
 */
export const deleteSession = async (sessionId: string): Promise<void> => {
  if (isDebug) console.log('🗑️ Deleting session and associated rounds:', sessionId);
  try {
    const db = await initDB();

    // Start a transaction that includes both stores
    const tx = db.transaction([storeNames.sessions, storeNames.rounds, storeNames.completedSessions], 'readwrite');

    // Delete the session
    await tx.objectStore(storeNames.sessions).delete(sessionId);
    await tx.objectStore(storeNames.completedSessions).delete(sessionId);
    // Delete all rounds for this session using the index
    const roundsStore = tx.objectStore(storeNames.rounds);
    const sessionRoundsIndex = roundsStore.index('sessionId');
    const roundsToDelete = await sessionRoundsIndex.getAllKeys(sessionId);

    // Delete each round
    for (const roundKey of roundsToDelete) {
      await roundsStore.delete(roundKey);
    }

    // Wait for the transaction to complete
    await tx.done;

    if (isDebug) console.log('✅ Successfully deleted session and rounds');
  } catch (error) {
    console.error('❌ Error deleting session and rounds:', error);
    throw error;
  }
};

export async function importSession(session: Session, completedSession: CompletedSession, rounds: Round[]) {
  const db = await initDB();
  const tx = db.transaction(['sessions', 'completedSessions', 'rounds'], 'readwrite');

  // Import session
  const sessionStore = tx.objectStore('sessions');
  await sessionStore.put(session);

  // Import completed session
  if (completedSession) {
    const completedSessionStore = tx.objectStore('completedSessions');
    await completedSessionStore.put(completedSession);
  }

  // Import rounds
  const roundsStore = tx.objectStore('rounds');
  for (const round of rounds) {
    await roundsStore.put(round);
  }

  await tx.done;
}
