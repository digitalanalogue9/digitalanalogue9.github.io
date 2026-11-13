import { describe, expect, test } from 'vitest';
import { InMemorySessionRepository } from '@/lib/repository/inMemorySessionRepository';
import { ExerciseServiceImpl } from '@/lib/services/exerciseService';
import { makeCompletedSession, makeImportEnvelope, makeSession, makeValueCards } from '../utils/importFixtures';

describe('complete values-session backup export and import', () => {
  test('includes saved reflection in the standard export and round-trips it', async () => {
    const source = new ExerciseServiceImpl(new InMemorySessionRepository());
    const session = makeSession({ id: 'reflection-backup', status: 'completed' });
    const fastPaceValue = {
      id: '2',
      title: 'FAST PACE',
      description: 'You enjoy working rapidly at a high pace.',
    };
    const completedSession = makeCompletedSession(session.id, [fastPaceValue]);
    await source.importSession(makeImportEnvelope({ session, completedSession }));
    const reflection = {
      version: 1 as const,
      goal: 'Make room for careful work.',
      values: {
        '2': {
          observation: 'I paused before replying.',
          suggestions: { 'personal-fast-pace-overplayed': 'recognised' as const },
        },
      },
      schedulePreferences: {
        frequency: 'weekly' as const,
        localTime: '08:30',
        timeZone: 'Europe/London',
        weeklyDay: 'monday' as const,
      },
    };
    await source.saveReflection(session.id, reflection);

    const defaultExport = await source.exportSession(session.id);
    expect(defaultExport.completedSession?.finalValues).toEqual(completedSession.finalValues);
    expect(defaultExport.completedSession?.reflection).toEqual(reflection);

    const reflectionBackup = await source.exportSession(session.id, { includeReflection: true });
    expect(reflectionBackup.completedSession?.finalValues).toEqual(completedSession.finalValues);
    expect(reflectionBackup.completedSession?.reflection).toEqual(reflection);

    const restored = new ExerciseServiceImpl(new InMemorySessionRepository());
    await restored.importSession(reflectionBackup);
    expect((await restored.loadSession(session.id)).completedSession?.reflection).toEqual(reflection);
  });

  test('replacing a reflected session with a backup without reflection clears the old reflection', async () => {
    const service = new ExerciseServiceImpl(new InMemorySessionRepository());
    const session = makeSession({ id: 'reflection-replacement', status: 'completed' });
    const completedSession = makeCompletedSession(session.id, makeValueCards(2));
    const original = makeImportEnvelope({ session, completedSession });
    await service.importSession(original);
    await service.saveReflection(session.id, {
      version: 1,
      values: { 'value-1': { observation: 'This reflection should be replaced.' } },
    });

    await service.importSession(original);

    expect((await service.loadSession(session.id)).completedSession).not.toHaveProperty('reflection');
  });

  test('rejects imported responses for unknown suggestion IDs', async () => {
    const service = new ExerciseServiceImpl(new InMemorySessionRepository());
    const session = makeSession({ id: 'unknown-suggestion-import', status: 'completed' });
    const completedSession = {
      ...makeCompletedSession(session.id, makeValueCards(2)),
      reflection: {
        version: 1 as const,
        values: { 'value-1': { suggestions: { 'unknown-suggestion': 'recognised' as const } } },
      },
    };

    await expect(service.importSession(makeImportEnvelope({ session, completedSession }))).rejects.toThrow(
      'Import payload is invalid'
    );
  });

  test('rejects saved responses for unknown suggestion IDs', async () => {
    const service = new ExerciseServiceImpl(new InMemorySessionRepository());
    const session = makeSession({ id: 'unknown-suggestion-save', status: 'completed' });
    const completedSession = makeCompletedSession(session.id, makeValueCards(2));
    await service.importSession(makeImportEnvelope({ session, completedSession }));

    await expect(
      service.saveReflection(session.id, {
        version: 1,
        values: { 'value-1': { suggestions: { 'unknown-suggestion': 'recognised' } } },
      })
    ).rejects.toThrow('Reflection data is invalid for this session.');
  });
});
