import valuesData from '@/data/values.json';
import type { SessionReflection, ValueWithReason } from '@/lib/contracts/types';
import { InMemorySessionRepository } from '@/lib/repository/inMemorySessionRepository';
import { ExerciseServiceImpl } from '@/lib/services/exerciseService';

function originalValue(id: string) {
  const value = valuesData.values.find((candidate) => candidate.id === id);
  if (!value) throw new Error(`Original value ${id} is missing from the personal catalog.`);
  return value;
}

describe('catalog-backed prompt examples', () => {
  test('uses original ranked values and separates optional context in both prompt previews', () => {
    const service = new ExerciseServiceImpl(new InMemorySessionRepository());
    const selectedValues: ValueWithReason[] = [
      { ...originalValue('2'), reason: 'A timely decision can help work move forward.' },
      originalValue('7'),
    ];
    const reflection: SessionReflection = {
      version: 1,
      goal: 'Protect time for a final accuracy check.',
      values: {
        '2': {
          observation: 'I moved ahead before others had all the context.',
          suggestions: { 'personal-fast-pace-overplayed': 'recognised' },
        },
      },
    };

    const coachingOptions = service.getOneOffCoachingContextOptions('personal', selectedValues, reflection);
    const recognisedPossibility = coachingOptions.find(
      (option) => option.id === 'possibility:2:personal-fast-pace-overplayed'
    );
    expect(recognisedPossibility).toEqual({
      id: 'possibility:2:personal-fast-pace-overplayed',
      label: 'self-reported recognition · overplayed possibility for FAST PACE',
      text: 'I might move ahead before I have checked whether others have the context they need.',
    });

    const oneOff = service.composeOneOffCoachingPrompt({
      exerciseType: 'personal',
      selectedValues,
      reflection,
      includedContextIds: [
        'goal',
        'reason:2',
        'observation:2',
        'possibility:2:personal-fast-pace-overplayed',
        'relationship:personal-fast-pace-precise-work',
      ],
    });
    expect(oneOff).toContain('1. FAST PACE — You enjoy working rapidly at a high pace.');
    expect(oneOff).toContain(
      '2. PRECISE WORK — You like working on things which involve great care and concentration.'
    );
    expect(oneOff).toContain('self-reported recognition · overplayed possibility for FAST PACE');
    expect(oneOff).toContain('Relationship possibility · FAST PACE / PRECISE WORK');
    expect(oneOff).toContain('Reason for FAST PACE: “A timely decision can help work move forward.”');
    expect(oneOff).toContain('Session goal: “Protect time for a final accuracy check.”');
    expect(oneOff).toContain('Observation for FAST PACE: “I moved ahead before others had all the context.”');

    const recurring = service.composeRecurringReflectionPrompt({
      exerciseType: 'personal',
      selectedValues,
      reflection,
    });
    expect(recurring).not.toContain('Chosen reminder schedule');
    expect(recurring).toContain('1. FAST PACE — You enjoy working rapidly at a high pace.');
    expect(recurring).toContain(
      '2. PRECISE WORK — You like working on things which involve great care and concentration.'
    );
    expect(recurring).toContain('No saved reflection context has been included.');
    expect(recurring).not.toContain('self-reported recognition');
    expect(recurring).not.toContain('A timely decision can help work move forward.');
    expect(recurring).not.toContain('Protect time for a final accuracy check.');
    expect(recurring).not.toContain('I moved ahead before others had all the context.');
  });
});
