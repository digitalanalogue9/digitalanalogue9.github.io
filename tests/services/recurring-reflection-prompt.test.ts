import { describe, expect, test } from 'vitest';
import { InMemorySessionRepository } from '@/lib/repository/inMemorySessionRepository';
import { ExerciseServiceImpl } from '@/lib/services/exerciseService';

describe('ExerciseService recurring reflection prompt', () => {
  test('composes self-contained personal context, freshness and honest limits', () => {
    const service = new ExerciseServiceImpl(new InMemorySessionRepository());
    const prompt = service.composeRecurringReflectionPrompt({
      exerciseType: 'personal',
      selectedValues: [
        { id: 'care', title: 'Care', description: 'Make space for people.' },
        { id: 'craft', title: 'Craft', description: 'Take care with the details.' },
      ],
    });

    expect(prompt).toContain('personal exercise');
    expect(prompt).toContain('1. Care — Make space for people.');
    expect(prompt).toContain('2. Craft — Take care with the details.');
    expect(prompt).not.toContain('Chosen reminder schedule');
    expect(prompt).toContain('one focused question');
    expect(prompt).toContain('Awareness is enough');
    expect(prompt).toContain('positive expression');
    expect(prompt).toContain('overplaying');
    expect(prompt).toContain('frustration');
    expect(prompt).toContain('Stoic');
    expect(prompt).toContain('fresh hypothetical situation, angle, and question');
    expect(prompt).toContain('strict non-repetition cannot be guaranteed');
    expect(prompt).not.toContain('application/json');
  });

  test('uses team check-in language, weekly day and only individually included optional context', () => {
    const service = new ExerciseServiceImpl(new InMemorySessionRepository());
    const selectedValues = [
      {
        id: 'quality',
        title: 'EXCELLENCE',
        description: 'We strive for the highest standards.',
        reason: 'Private reason.',
      },
    ];
    const reflection = {
      version: 1 as const,
      goal: 'Make quality sustainable.',
      values: { quality: { observation: 'Recorded observation.', action: 'Chosen action.' } },
    };
    const contextOptions = service.getRecurringReflectionContextOptions('team', selectedValues, reflection);
    const prompt = service.composeRecurringReflectionPrompt({
      exerciseType: 'team',
      selectedValues,
      reflection,
      includedContextIds: [contextOptions.find((option) => option.id === 'goal')!.id],
    });

    expect(prompt).toContain('team facilitator');
    expect(prompt).not.toContain('Chosen reminder schedule');
    expect(prompt).toContain('Make quality sustainable.');
    expect(prompt).not.toContain('Private reason.');
    expect(prompt).not.toContain('Recorded observation.');
    expect(prompt).not.toContain('Chosen action.');
    expect(prompt).not.toContain('automatically deliver');
  });
});
