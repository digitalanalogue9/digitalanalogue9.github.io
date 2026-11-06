import 'fake-indexeddb/auto';
import { openDB, deleteDB } from 'idb';
import { afterEach, describe, expect, test } from 'vitest';
import {
  completeSession,
  closeSessionRepository,
  createSession,
  deleteSession,
  listSessions,
  loadSession,
  migrateLegacySessions,
  saveSessionProgress,
} from '../../src/lib/db/canonicalSessionRepository';

const DB_NAME = 'coreValuesData';

test('deleting a migrated Session removes its retained legacy records without affecting another Session', async () => {
  await seedVersionFourDatabase();
  await listSessions();
  await deleteSession('completed-session');
  expect((await listSessions()).map((session) => session.id)).toEqual(['active-session']);
  const db = await openDB(DB_NAME);
  expect(await db.get('sessions', 'completed-session')).toBeUndefined();
  expect(await db.get('completedSessions', 'completed-session')).toBeUndefined();
  expect(await db.getAllFromIndex('rounds', 'sessionId', 'completed-session')).toEqual([]);
  expect(await db.get('sessions', 'active-session')).toBeDefined();
  db.close();
});

function value(id: string) {
  return { id, title: `Value ${id}`, description: `Description ${id}` };
}

async function seedVersionFourDatabase() {
  const db = await openDB(DB_NAME, 4, {
    upgrade(database) {
      database.createObjectStore('sessions', { keyPath: 'id' });
      const rounds = database.createObjectStore('rounds', { keyPath: ['sessionId', 'roundNumber'] });
      rounds.createIndex('sessionId', 'sessionId');
      database.createObjectStore('completedSessions', { keyPath: 'sessionId' });
    },
  });
  const tx = db.transaction(['sessions', 'rounds', 'completedSessions'], 'readwrite');
  await tx.objectStore('sessions').put({
    id: 'active-session',
    timestamp: 100,
    targetCoreValues: 1,
    currentRound: 1,
    completed: false,
    initialValues: [value('a'), value('b')],
    remainingValues: [value('a'), value('b')],
    exerciseType: 'personal',
  });
  await tx.objectStore('rounds').put({
    sessionId: 'active-session',
    roundNumber: 1,
    timestamp: 110,
    commands: [{ type: 'DROP', payload: { cardId: 'a', cardTitle: 'Value a', category: 'Very Important' } }],
    availableCategories: { 'Very Important': [value('a')], 'Not Important': [] },
  });
  await tx.objectStore('sessions').put({
    id: 'completed-session',
    timestamp: 200,
    targetCoreValues: 1,
    currentRound: 2,
    completed: true,
    initialValues: [value('c'), value('d')],
    remainingValues: [value('c')],
    exerciseType: 'team',
  });
  await tx.objectStore('rounds').put({
    sessionId: 'completed-session',
    roundNumber: 1,
    timestamp: 210,
    commands: [
      { type: 'DROP', payload: { cardId: 'c', cardTitle: 'Value c', category: 'Very Important' } },
      { type: 'DROP', payload: { cardId: 'd', cardTitle: 'Value d', category: 'Very Important' } },
    ],
    availableCategories: { 'Very Important': [value('c'), value('d')], 'Not Important': [] },
  });
  await tx.objectStore('rounds').put({
    sessionId: 'completed-session',
    roundNumber: 2,
    timestamp: 215,
    commands: [
      { type: 'DROP', payload: { cardId: 'c', cardTitle: 'Value c', category: 'Very Important' } },
      { type: 'DROP', payload: { cardId: 'd', cardTitle: 'Value d', category: 'Not Important' } },
      {
        type: 'MOVE',
        payload: { cardId: 'c', cardTitle: 'Value c', fromCategory: 'Very Important', toCategory: 'Very Important' },
      },
    ],
    availableCategories: { 'Very Important': [value('c')], 'Not Important': [value('d')] },
  });
  await tx.objectStore('completedSessions').put({
    sessionId: 'completed-session',
    timestamp: 220,
    finalValues: [{ ...value('c'), reason: 'It matters to me.' }],
  });
  await tx.objectStore('sessions').put({
    id: 'ambiguous-session',
    timestamp: 300,
    targetCoreValues: 1,
    currentRound: 1,
    completed: false,
    initialValues: [value('d')],
    remainingValues: [value('d')],
    exerciseType: 'personal',
  });
  await tx.done;
  db.close();
}

afterEach(async () => {
  await closeSessionRepository();
  await deleteDB(DB_NAME);
});

describe('v4 Session preservation', () => {
  test('lists, resumes, completes, and replays migrated records while retaining legacy stores', async () => {
    await seedVersionFourDatabase();

    const sessions = await listSessions();
    expect(sessions.map((session) => session.id).sort()).toEqual(['active-session', 'completed-session']);

    const active = await loadSession('active-session');
    expect(active?.session.status).toBe('active');
    expect(active?.currentRound.deck).toEqual([value('b')]);
    expect(active?.currentRound.categories['Very Important']).toEqual([value('a')]);
    expect(active?.currentRound.categories['Not Important']).toEqual([]);

    const completed = await loadSession('completed-session');
    expect(completed?.session.exerciseType).toBe('team');
    expect(completed?.rounds).toHaveLength(2);
    expect(completed?.rounds[0].categories['Very Important']).toEqual([value('c'), value('d')]);
    expect(completed?.completedSession?.finalValues).toEqual([{ ...value('c'), reason: 'It matters to me.' }]);
    expect(completed?.rounds[1].commands[2]).toEqual({
      kind: 'move',
      valueId: 'c',
      fromCategory: 'Very Important',
      toCategory: 'Very Important',
    });

    await completeSession('active-session', [{ ...value('a'), reason: 'This is important.' }]);
    expect((await loadSession('active-session'))?.session.status).toBe('completed');

    const db = await openDB(DB_NAME);
    expect(db.objectStoreNames.contains('sessions')).toBe(true);
    expect(db.objectStoreNames.contains('canonicalSessions')).toBe(true);
    expect(await db.get('sessions', 'active-session')).toMatchObject({ id: 'active-session', completed: false });
    expect(await db.get('completedSessions', 'completed-session')).toMatchObject({ sessionId: 'completed-session' });
    expect(await db.getAllFromIndex('rounds', 'sessionId', 'completed-session')).toHaveLength(2);
    expect(await db.getAll('canonicalSessions')).toHaveLength(2);
    db.close();
  });

  test('migration is idempotent after reload and leaves malformed source rows untouched', async () => {
    await seedVersionFourDatabase();
    await listSessions();
    await closeSessionRepository();
    await listSessions();
    await migrateLegacySessions();
    await migrateLegacySessions();

    const db = await openDB(DB_NAME);
    expect(await db.getAll('canonicalSessions')).toHaveLength(2);
    expect(await db.get('sessions', 'ambiguous-session')).toMatchObject({ id: 'ambiguous-session' });
    expect(await db.get('metadata', 'v4-session-canonical-migration-v1')).toMatchObject({
      migratedSessions: 2,
      skippedInvalidRecords: 1,
    });
    db.close();
  });

  test('a new exercise can be saved and resumed at its current round', async () => {
    const started = await createSession({
      initialValues: [value('x'), value('y')],
      targetCoreValues: 1,
      exerciseType: 'personal',
    });
    const round = {
      ...started.currentRound,
      deck: [value('y')],
      categories: {
        ...started.currentRound.categories,
        'Very Important': [value('x')],
      },
      commands: [{ kind: 'drop' as const, valueId: 'x', toCategory: 'Very Important' as const }],
    };
    await saveSessionProgress(started.session.id, round);
    await closeSessionRepository();

    const resumed = await loadSession(started.session.id);
    expect(resumed?.currentRound.deck).toEqual([value('y')]);
    expect(resumed?.currentRound.categories['Very Important']).toEqual([value('x')]);
    expect(resumed?.session.currentRoundNumber).toBe(1);
  });
});
