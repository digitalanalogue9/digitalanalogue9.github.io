import 'fake-indexeddb/auto';
import { deleteDB } from 'idb';
import { afterEach, expect, test } from 'vitest';
import { closeSessionRepository, loadSession } from '../../src/lib/db/canonicalSessionRepository';
import { getExerciseServiceSingleton } from '../../src/lib/services/ExerciseServiceContext';
import {
  BEHAVIOUR_ATTEMPTS_STORAGE_KEY,
  getBehaviourAttemptServiceSingleton,
} from '../../src/lib/services/serviceSingleton';
import { SCENARIO_ATTEMPTS_STORAGE_KEY } from '../../src/lib/scenario-reflection/attemptStorage';
import { behaviourScenarios } from '../../src/lib/domain/behaviourScenarios';

const service = getExerciseServiceSingleton();
afterEach(async () => {
  await closeSessionRepository();
  await deleteDB('coreValuesData');
  localStorage.clear();
});

test('source service saves completed reasons and reflection in standard exports and deletes all session data', async () => {
  const record = await service.startSession({ targetCoreValues: 1, cardsInGame: 2 });
  const kept = record.currentRound.deck[0];
  const placed = await service.applyCommand({
    session: record.session,
    round: record.currentRound,
    command: { kind: 'drop', valueId: kept.id, toCategory: 'Very Important' },
  });
  const sorted = await service.applyCommand({
    ...placed,
    command: { kind: 'drop', valueId: placed.round.deck[0].id, toCategory: 'Not Important' },
  });
  await service.completeSession({ ...sorted, reasonsById: { [kept.id]: 'My reason' } });
  const reflection = {
    version: 1 as const,
    values: { [kept.id]: { observation: 'Private observation' } },
    goal: 'Private goal',
  };
  await service.saveReflection(record.session.id, reflection);
  expect((await service.loadSession(record.session.id)).completedSession?.finalValues[0].reason).toBe('My reason');
  const ordinary = await service.exportSession(record.session.id);
  expect(ordinary.completedSession?.reflection).toEqual(reflection);
  const backup = await service.exportSession(record.session.id, { includeReflection: true });
  expect(backup.completedSession?.reflection).toEqual(reflection);
  // Restoring a duplicate keeps the personal site's existing local session intact.
  await service.importSession(backup);
  expect(await service.listSessions()).toHaveLength(2);
  await service.deleteSession(record.session.id);
  expect(await loadSession(record.session.id)).toBeNull();
  expect(await service.listSessions()).toHaveLength(1);
});

test('existing scenario choices, notes and reminders migrate once and deleted attempts stay deleted', async () => {
  const scenario = behaviourScenarios[0];
  const possibility = scenario.responses[0].possibilities[0];
  const key = `${scenario.id}:${possibility.id}`;
  const legacy = {
    attempts: [
      {
        id: 'legacy-scenario',
        startedAt: 100,
        updatedAt: 200,
        position: 5,
        status: 'completed',
        answers: Object.fromEntries(behaviourScenarios.map((item) => [item.id, item.responses[0].id])),
        reflections: { [key]: { answer: 'worth-considering', note: 'Existing private note' } },
        reminder: {
          cadence: 'weekly',
          time: '10:30',
          timezone: 'Europe/London',
          weekday: 1,
          selectedPossibilityIds: [key],
        },
      },
    ],
  };
  localStorage.setItem(SCENARIO_ATTEMPTS_STORAGE_KEY, JSON.stringify(legacy));
  const scenarios = getBehaviourAttemptServiceSingleton();
  const [migrated] = await scenarios.listAttempts();
  expect(migrated.stage).toBe('finished');
  expect(migrated.scenarios[0].reflections?.[possibility.id]).toEqual({
    response: 'worth-considering',
    note: 'Existing private note',
  });
  expect(migrated.reminderSettings?.schedule.time).toBe('10:30');
  expect(localStorage.getItem(SCENARIO_ATTEMPTS_STORAGE_KEY)).toBe(JSON.stringify(legacy));
  expect(localStorage.getItem(BEHAVIOUR_ATTEMPTS_STORAGE_KEY)).not.toBeNull();
  expect(await scenarios.listAttempts()).toHaveLength(1);
  const payload = await scenarios.exportAttempt(migrated.id);
  expect(JSON.stringify(payload)).not.toContain('Existing private note');
  await scenarios.deleteAttempt(migrated.id);
  expect(await scenarios.listAttempts()).toHaveLength(0);
});
