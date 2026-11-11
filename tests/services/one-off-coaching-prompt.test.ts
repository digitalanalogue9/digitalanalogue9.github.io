import { describe, expect, test } from 'vitest';
import teamValuesData from '@/data/team-values.json';
import { InMemorySessionRepository } from '@/lib/repository/inMemorySessionRepository';
import { ExerciseServiceImpl } from '@/lib/services/exerciseService';

describe('ExerciseService one-off coaching prompt', () => {
  test('composes a personal prompt with complete ranked value context and one-question guidance', () => {
    const service = new ExerciseServiceImpl(new InMemorySessionRepository());
    const prompt = service.composeOneOffCoachingPrompt({
      exerciseType: 'personal',
      selectedValues: [
        { id: 'custom-1', title: 'Care', description: 'Make space for people.' },
        { id: 'custom-2', title: 'Craft', description: 'Take care with the details.' },
      ],
    });

    expect(prompt).toContain('personal exercise');
    expect(prompt).toContain('1. Care — Make space for people.');
    expect(prompt).toContain('2. Craft — Take care with the details.');
    expect(prompt).toContain('Ask one question at a time');
    expect(prompt).toContain('positive expression');
    expect(prompt).toContain('overplaying');
    expect(prompt).toContain('when a value feels frustrated or blocked');
    expect(prompt).toContain('possible intention from another person’s possible perception');
    expect(prompt).toContain('Stoic');
    expect(prompt).toContain('impressions shape judgements');
    expect(prompt).toContain('uncertainty without self-blame');
    expect(prompt).toContain('Awareness is enough');
    expect(prompt).not.toContain('application/json');
  });

  test('composes a team prompt and includes only individually selected optional context', () => {
    const service = new ExerciseServiceImpl(new InMemorySessionRepository());
    const excellence = teamValuesData.values.find(({ id }) => id === '12')!;
    const selectedValues = [{ ...excellence, reason: 'Keep the private reason.' }];
    const reflection = {
      version: 1 as const,
      goal: 'Keep quality sustainable.',
      values: {
        '12': {
          observation: 'Private example.',
          action: 'Optional chosen action.',
          suggestions: {
            'team-excellence-constructive': 'recognised' as const,
            'team-excellence-overplayed': 'rejected' as const,
            'team-excellence-frustrated': 'unsure' as const,
          },
        },
      },
    };
    const options = service.getOneOffCoachingContextOptions('team', selectedValues, reflection);
    const prompt = service.composeOneOffCoachingPrompt({
      exerciseType: 'team',
      selectedValues,
      reflection,
      includedContextIds: [
        options.find((item) => item.label === 'Reason for EXCELLENCE')!.id,
        options.find((item) => item.label === 'Observation for EXCELLENCE')!.id,
        options.find((item) => item.label === 'Team discussion goal')!.id,
        options.find((item) => item.label.includes('constructive possibility'))!.id,
        options.find((item) => item.label.includes('unsure'))!.id,
      ],
    });

    expect(prompt).toContain('facilitated team discussion');
    expect(prompt).toContain('only if we choose to');
    expect(prompt).not.toContain('only if I choose to');
    expect(prompt).toContain(`1. EXCELLENCE — ${excellence.description}`);
    expect(prompt).toContain('Keep the private reason.');
    expect(prompt).toContain('Keep quality sustainable.');
    expect(prompt).toContain('Private example.');
    expect(prompt).toContain('Recorded in team discussion');
    expect(prompt).toContain('unsure');
    expect(prompt).not.toContain('Optional chosen action.');
    expect(prompt).not.toContain('not recognised');
    expect(prompt).not.toContain('Daniel');
  });

  test('preserves empty and large selected value sets and long optional text without truncation', () => {
    const service = new ExerciseServiceImpl(new InMemorySessionRepository());
    const longDescription = 'description '.repeat(1200);
    const longObservation = 'observation '.repeat(1200);
    const emptyPrompt = service.composeOneOffCoachingPrompt({ exerciseType: 'personal', selectedValues: [] });
    const values = Array.from({ length: 40 }, (_, index) => ({
      id: `value-${index}`,
      title: `Value ${index + 1}`,
      description: index === 39 ? longDescription : `Description ${index + 1}`,
    }));
    const options = service.getOneOffCoachingContextOptions('personal', values, {
      version: 1,
      values: { 'value-39': { observation: longObservation } },
    });
    const prompt = service.composeOneOffCoachingPrompt({
      exerciseType: 'personal',
      selectedValues: values,
      reflection: { version: 1, values: { 'value-39': { observation: longObservation } } },
      includedContextIds: [options[0].id],
    });

    expect(emptyPrompt).toContain('No values were selected');
    expect(prompt).toContain('40. Value 40');
    expect(prompt).toContain(longDescription);
    expect(prompt).toContain(longObservation);
  });
});
