import { describe, expect, test } from 'vitest';
import teamValuesData from '@/data/team-values.json';
import valuesData from '@/data/values.json';
import type { CategoryName, ValueCard } from '@/lib/contracts/types';
import { InMemorySessionRepository } from '@/lib/repository/inMemorySessionRepository';
import { ExerciseServiceImpl } from '@/lib/services/exerciseService';
import { makeCompletedSession, makeImportEnvelope, makeSession, makeValueCards } from '../utils/importFixtures';

type StartedSession = Awaited<ReturnType<ExerciseServiceImpl['startSession']>>;

async function sortAllCards(service: ExerciseServiceImpl, record: StartedSession, assignments: CategoryName[]) {
  let session = record.session;
  let round = record.currentRound;

  for (const toCategory of assignments) {
    const valueId = round.deck[0]?.id;
    if (!valueId) {
      throw new Error('Test assignment count exceeded remaining deck size');
    }

    const result = await service.applyCommand({
      session,
      round,
      command: {
        kind: 'drop',
        valueId,
        toCategory,
      },
    });
    session = result.session;
    round = result.round;
  }

  return { session, round };
}

describe('ExerciseService', () => {
  test('starts a personal session by default', async () => {
    const repository = new InMemorySessionRepository();
    const service = new ExerciseServiceImpl(repository);

    const record = await service.startSession({
      targetCoreValues: 3,
      cardsInGame: 6,
    });

    const personalTitles = new Set(valuesData.values.map((value) => value.title));
    expect(record.session.exerciseType).toBe('personal');
    expect(record.session.initialValues).toHaveLength(6);
    expect(record.session.initialValues.every((value) => personalTitles.has(value.title))).toBe(true);
  });

  test('starts a team session with team values when requested', async () => {
    const repository = new InMemorySessionRepository();
    const service = new ExerciseServiceImpl(repository);

    const record = await service.startSession({
      targetCoreValues: 5,
      cardsInGame: teamValuesData.values.length,
      exerciseType: 'team',
    });

    const teamTitles = new Set(teamValuesData.values.map((value) => value.title));
    const returnedTitles = new Set(record.session.initialValues.map((value) => value.title));

    expect(record.session.exerciseType).toBe('team');
    expect(record.currentRound.deck).toHaveLength(teamValuesData.values.length);
    expect(returnedTitles).toEqual(teamTitles);
  });

  test('starts session and applies command', async () => {
    const repository = new InMemorySessionRepository();
    const service = new ExerciseServiceImpl(repository);

    const record = await service.startSession({
      targetCoreValues: 3,
      cardsInGame: 6,
    });
    expect(record.session.id).toMatch(/^[a-z]+-[a-z]+-[a-z]+$/);
    expect(record.session).not.toHaveProperty('label');
    expect(record.currentRound.deck).toHaveLength(6);

    const firstCard = record.currentRound.deck[0];
    const apply = await service.applyCommand({
      session: record.session,
      round: record.currentRound,
      command: {
        kind: 'drop',
        valueId: firstCard.id,
        toCategory: 'Very Important',
      },
    });

    expect(apply.round.deck).toHaveLength(5);
    expect(apply.round.categories['Very Important']).toHaveLength(1);
  });

  test('exports and imports session payload', async () => {
    const source = new ExerciseServiceImpl(new InMemorySessionRepository());
    const target = new ExerciseServiceImpl(new InMemorySessionRepository());
    const record = await source.startSession({
      targetCoreValues: 3,
      cardsInGame: 5,
    });

    const envelope = await source.exportSession(record.session.id);
    await target.importSession(envelope);
    const imported = await target.loadSession(record.session.id);
    expect(imported.session.id).toBe(record.session.id);
    expect(imported.session).not.toHaveProperty('label');
    expect(imported.rounds).toHaveLength(1);
  });

  test('normal completion persists a normalized final round', async () => {
    const repository = new InMemorySessionRepository();
    const service = new ExerciseServiceImpl(repository);
    const record = await service.startSession({
      targetCoreValues: 2,
      cardsInGame: 5,
    });
    const sorted = await sortAllCards(service, record, [
      'Very Important',
      'Very Important',
      'Not Important',
      'Not Important',
      'Not Important',
    ]);

    const result = await service.advanceRound({
      session: sorted.session,
      round: sorted.round,
      earlyFinish: false,
    });

    expect(result.kind).toBe('ready-to-complete');
    if (result.kind === 'ready-to-complete') {
      expect(result.round.activeCategories).toEqual(['Very Important', 'Not Important']);
      expect(result.round.categories['Very Important']).toHaveLength(2);
      expect(result.round.categories['Not Important']).toHaveLength(3);
      expect(result.round.categories['Quite Important']).toHaveLength(0);
      expect(result.round.categories.Important).toHaveLength(0);
      expect(result.round.commands).toHaveLength(5);
    }

    const stored = await service.loadSession(record.session.id);
    expect(stored.currentRound.activeCategories).toEqual(['Very Important', 'Not Important']);
    expect(stored.currentRound.categories['Very Important']).toHaveLength(2);
    expect(stored.currentRound.categories['Not Important']).toHaveLength(3);
  });

  test('completeSession defensively normalizes the persisted completed round', async () => {
    const repository = new InMemorySessionRepository();
    const service = new ExerciseServiceImpl(repository);
    const record = await service.startSession({
      targetCoreValues: 2,
      cardsInGame: 5,
    });
    const sorted = await sortAllCards(service, record, [
      'Very Important',
      'Very Important',
      'Quite Important',
      'Important',
      'Not Important',
    ]);
    const reasonsById = Object.fromEntries(
      sorted.round.categories['Very Important'].map((value) => [value.id, `Reason for ${value.title}`])
    );

    const completed = await service.completeSession({
      session: sorted.session,
      round: sorted.round,
      reasonsById,
    });

    expect(completed.finalValues).toHaveLength(2);
    const stored = await service.loadSession(record.session.id);
    expect(stored.session.status).toBe('completed');
    expect(stored.completedSession?.finalValues).toHaveLength(2);
    expect(stored.currentRound.activeCategories).toEqual(['Very Important', 'Not Important']);
    expect(stored.currentRound.categories['Very Important']).toHaveLength(2);
    expect(stored.currentRound.categories['Not Important']).toHaveLength(3);
    expect(stored.currentRound.categories['Quite Important']).toHaveLength(0);
    expect(stored.currentRound.categories.Important).toHaveLength(0);
    expect(stored.currentRound.commands).toHaveLength(5);
  });

  test('saves and reopens optional reflection without adding it to the default export', async () => {
    const service = new ExerciseServiceImpl(new InMemorySessionRepository());
    const session = makeSession({ id: 'saved-reflection', status: 'completed' });
    const fastPaceValue = {
      id: '2',
      title: 'FAST PACE',
      description: 'You enjoy working rapidly at a high pace.',
    };
    const completedSession = makeCompletedSession(session.id, [fastPaceValue]);
    await service.importSession(makeImportEnvelope({ session, completedSession }));

    await service.saveReflection(session.id, {
      version: 1,
      goal: 'Pause before replying under pressure.',
      schedulePreferences: {
        frequency: 'weekly',
        localTime: '17:40',
        timeZone: 'Europe/London',
        weeklyDay: 'friday',
      },
      values: {
        '2': {
          observation: 'I noticed I paused before replying.',
          action: 'Ask one question first.',
          suggestions: {
            'personal-fast-pace-constructive': 'recognised',
            'personal-fast-pace-overplayed': 'rejected',
            'personal-fast-pace-frustrated': 'unsure',
          },
        },
      },
    });

    const reopened = await service.loadSession(session.id);
    expect(reopened.completedSession?.reflection?.values['2']).toEqual({
      observation: 'I noticed I paused before replying.',
      action: 'Ask one question first.',
      suggestions: {
        'personal-fast-pace-constructive': 'recognised',
        'personal-fast-pace-overplayed': 'rejected',
        'personal-fast-pace-frustrated': 'unsure',
      },
    });
    expect(reopened.completedSession?.reflection?.goal).toBe('Pause before replying under pressure.');
    expect(reopened.completedSession?.reflection?.schedulePreferences).toEqual({
      frequency: 'weekly',
      localTime: '17:40',
      timeZone: 'Europe/London',
      weeklyDay: 'friday',
    });
    const exported = await service.exportSession(session.id);
    expect(exported.completedSession).not.toHaveProperty('reflection');
  });

  test('rejects reflection notes for values outside the completed selection', async () => {
    const service = new ExerciseServiceImpl(new InMemorySessionRepository());
    const session = makeSession({ id: 'reflection-reference-check', status: 'completed' });
    const completedSession = makeCompletedSession(session.id, makeValueCards(2));
    await service.importSession(makeImportEnvelope({ session, completedSession }));

    await expect(
      service.saveReflection(session.id, {
        version: 1,
        values: { 'not-selected': { observation: 'Out of scope.' } },
      })
    ).rejects.toThrow('Reflection data is invalid for this session.');
  });

  test('returns sparse, stable possibilities with wording for the selected exercise type', () => {
    const service = new ExerciseServiceImpl(new InMemorySessionRepository());

    const personal = service.getReflectionContent('personal', {
      id: '2',
      title: 'FAST PACE',
      description: 'You enjoy working rapidly at a high pace.',
    });
    const team = service.getReflectionContent('team', {
      id: '12',
      title: 'EXCELLENCE',
      description: 'We strive for the highest standards in everything we do, inspiring ourselves and others to excel.',
    });

    expect(personal.possibilities.map(({ id, lens }) => [id, lens])).toEqual([
      ['personal-fast-pace-constructive', 'constructive'],
      ['personal-fast-pace-overplayed', 'overplayed'],
      ['personal-fast-pace-frustrated', 'frustrated'],
    ]);
    expect(personal.possibilities[1].personal).toContain('might');
    expect(team.possibilities[0].team).toContain('us');
  });

  test('returns no curated traits for unknown or mismatched value identities', () => {
    const service = new ExerciseServiceImpl(new InMemorySessionRepository());

    const unknown = service.getReflectionContent('personal', {
      id: 'custom-money',
      title: 'MONEY',
      description: 'A customised value card.',
    });
    const money = service.getReflectionContent('personal', {
      id: '3',
      title: 'MONEY',
      description: 'Earning a large amount of money is important to you.',
    });
    const mismatched = service.getReflectionContent('team', {
      id: '2',
      title: 'FAST PACE',
      description: 'A personal value with a team identity.',
    });

    expect(unknown.possibilities).toEqual([]);
    expect(unknown.questions.personal).toHaveLength(2);
    expect(money.possibilities).toEqual([]);
    expect(mismatched.possibilities).toEqual([]);
  });

  test('suggests curated value relationships only when both original matching values are selected', () => {
    const service = new ExerciseServiceImpl(new InMemorySessionRepository());
    const fastPace = { id: '2', title: 'FAST PACE', description: 'You enjoy working rapidly at a high pace.' };
    const preciseWork = {
      id: '7',
      title: 'PRECISE WORK',
      description: 'You like to do things accurately and thoroughly.',
    };
    const independence = { id: '31', title: 'INDEPENDENCE', description: 'You prefer to work independently.' };
    const preciseWorkDescription = valuesData.values.find((value) => value.id === '7')?.description;
    expect(preciseWorkDescription).toBeDefined();
    preciseWork.description = preciseWorkDescription ?? '';

    const selected = service.getReflectionRelationships('personal', [fastPace, preciseWork, independence]);
    expect(selected.map((relationship) => relationship.id)).toEqual(['personal-fast-pace-precise-work']);
    expect(selected[0].personal).toMatch(/might|could/);
    expect(selected[0].personal).not.toMatch(/opposite|contradiction|risk score/i);

    expect(service.getReflectionRelationships('personal', [fastPace])).toEqual([]);
    expect(
      service.getReflectionRelationships('personal', [fastPace, { ...preciseWork, description: 'custom' }])
    ).toEqual([]);

    expect(
      service.getReflectionRelationships('personal', valuesData.values as ValueCard[]).map(({ id }) => id)
    ).toEqual([
      'personal-fast-pace-precise-work',
      'personal-independence-work-with-others',
      'personal-security-risk',
      'personal-promotion-time-freedom',
      'personal-routine-variety',
    ]);
    expect(
      service.getReflectionRelationships('team', teamValuesData.values as ValueCard[]).map(({ id }) => id)
    ).toEqual([
      'team-excellence-balance',
      'team-innovation-standards',
      'team-transparency-empathy',
      'team-accountability-safety',
      'team-focus-flexibility',
    ]);
  });

  test('summarises recognition, notes, actions and unconfirmed possibilities separately', async () => {
    const service = new ExerciseServiceImpl(new InMemorySessionRepository());
    const session = makeSession({ id: 'reflection-summary', status: 'completed' });
    const fastPace = { id: '2', title: 'FAST PACE', description: 'You enjoy working rapidly at a high pace.' };
    const preciseWork = {
      id: '7',
      title: 'PRECISE WORK',
      description: valuesData.values.find((value) => value.id === '7')?.description ?? '',
    };
    const completedSession = makeCompletedSession(session.id, [fastPace, preciseWork]);
    await service.importSession(makeImportEnvelope({ session, completedSession }));
    const [relationship] = service.getReflectionRelationships('personal', [fastPace, preciseWork]);
    await service.saveReflection(session.id, {
      version: 1,
      values: {
        '2': {
          observation: 'I slowed down to check one detail.',
          action: 'Ask when speed matters most.',
          suggestions: {
            'personal-fast-pace-constructive': 'recognised',
            'personal-fast-pace-overplayed': 'rejected',
            'personal-fast-pace-frustrated': 'unsure',
          },
        },
      },
      relationships: {
        [relationship.id]: { observation: 'The pair helps us choose a useful pace.', action: 'Agree a review point.' },
      },
    });

    const reopened = await service.loadSession(session.id);
    expect(reopened.completedSession?.reflection?.relationships?.[relationship.id]).toEqual({
      observation: 'The pair helps us choose a useful pace.',
      action: 'Agree a review point.',
    });
    const summary = service.getReflectionSummary(
      'personal',
      [fastPace, preciseWork],
      reopened.completedSession?.reflection
    );
    expect(summary.recognisedPossibilities.map(({ text }) => text)).toEqual([
      'A fast pace might help me create momentum when a decision or response is needed.',
    ]);
    expect(summary.observations.map(({ text }) => text)).toEqual([
      'I slowed down to check one detail.',
      'The pair helps us choose a useful pace.',
    ]);
    expect(summary.actions.map(({ text }) => text)).toEqual(['Ask when speed matters most.', 'Agree a review point.']);
    expect(
      summary.unconfirmedPossibilities.find(
        ({ text }) => text === 'I might feel frustrated when avoidable delays make it hard to keep work moving.'
      )?.status
    ).toBe('unsure');
    expect(summary.unconfirmedPossibilities.map(({ text }) => text)).toContain(
      'A fast pace and precise work might complement each other when you can move quickly while allowing enough time to check important details.'
    );
    expect(
      summary.unconfirmedPossibilities.find(
        ({ text }) => text === 'I might move ahead before I have checked whether others have the context they need.'
      )
    ).toBeUndefined();
  });

  test('rejects malformed import envelope', async () => {
    const service = new ExerciseServiceImpl(new InMemorySessionRepository());
    const malformedEnvelope = makeImportEnvelope();
    malformedEnvelope.rounds = [];

    await expect(service.importSession(malformedEnvelope)).rejects.toThrow('Import payload is invalid');
  });
});
