import 'fake-indexeddb/auto';
import { deleteDB } from 'idb';
import { afterEach, describe, expect, test } from 'vitest';
import {
  closeSessionRepository,
  exportSessionData,
  importSessionData,
  listSessions,
  loadSession,
} from '../../src/lib/db/canonicalSessionRepository';

const DB_NAME = 'coreValuesData';
const value = (id: string) => ({ id, title: `Value ${id}`, description: `Description ${id}` });

const legacyBackup = {
  session: {
    id: 'portable-session',
    timestamp: 100,
    targetCoreValues: 1,
    currentRound: 2,
    completed: true,
    initialValues: [value('a'), value('b')],
    remainingValues: [value('a')],
    exerciseType: 'personal' as const,
  },
  completedSession: {
    sessionId: 'portable-session',
    timestamp: 220,
    finalValues: [{ ...value('a'), reason: 'It matters.' }],
  },
  rounds: [
    {
      sessionId: 'portable-session',
      roundNumber: 1,
      timestamp: 110,
      commands: [
        { type: 'DROP', payload: { cardId: 'a', cardTitle: 'Value a', category: 'Very Important' } },
        { type: 'DROP', payload: { cardId: 'b', cardTitle: 'Value b', category: 'Not Important' } },
      ],
      availableCategories: { 'Very Important': [value('a')], 'Not Important': [value('b')] },
    },
    {
      sessionId: 'portable-session',
      roundNumber: 2,
      timestamp: 210,
      commands: [{ type: 'DROP', payload: { cardId: 'a', cardTitle: 'Value a', category: 'Very Important' } }],
      availableCategories: { 'Very Important': [value('a')], 'Not Important': [] },
    },
  ],
};

afterEach(async () => {
  await closeSessionRepository();
  await deleteDB(DB_NAME);
});

describe('saved Session backups', () => {
  test('imports a supported historical backup and keeps its completed rounds and choices', async () => {
    const importedId = await importSessionData(legacyBackup);

    expect(importedId).toBe('portable-session');
    expect(await listSessions()).toHaveLength(1);
    const restored = await loadSession(importedId);
    expect(restored?.session.status).toBe('completed');
    expect(restored?.rounds.map((round) => round.commands)).toHaveLength(2);
    expect(restored?.rounds[0].categories['Not Important']).toEqual([value('b')]);
    expect(restored?.completedSession?.finalValues).toEqual([{ ...value('a'), reason: 'It matters.' }]);
  });

  test('exports a cross-version backup and assigns a new ID when importing a duplicate', async () => {
    await importSessionData(legacyBackup);
    const exported = await exportSessionData('portable-session');
    expect(exported).toMatchObject({
      session: { id: 'portable-session' },
      rounds: [{ roundNumber: 1 }, { roundNumber: 2 }],
    });

    const importedId = await importSessionData(exported);
    expect(importedId).not.toBe('portable-session');
    const duplicate = await loadSession(importedId);
    expect(duplicate?.rounds[0].commands).toEqual((await loadSession('portable-session'))?.rounds[0].commands);
    expect(await listSessions()).toHaveLength(2);
  });

  test('rejects malformed backup data without adding a Session', async () => {
    await expect(importSessionData({ session: { id: 'broken' }, rounds: [] })).rejects.toThrow();
    expect(await listSessions()).toEqual([]);
  });
});
