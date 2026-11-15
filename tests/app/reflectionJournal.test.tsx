import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import valuesData from '../../src/data/values.json';
import { ReflectionJournal } from '../../src/app/reasoning/ReflectionJournal';
import { getReflectionRelationships, getReflectionSummary } from '../../src/lib/content/reflectionContent';
import type { SessionReflection } from '../../src/lib/contracts/types';

afterEach(cleanup);

test('shows relationship prompts without textareas and keeps saved notes in the summary', () => {
  const values = valuesData.values.filter((value) => ['2', '7'].includes(value.id));
  const reflection: SessionReflection = {
    version: 1,
    values: {},
    relationships: {
      'personal-fast-pace-precise-work': { observation: 'My earlier note', action: 'My earlier action' },
    },
  };
  render(
    <ReflectionJournal
      selectedValues={values}
      exerciseType="personal"
      reflection={reflection}
      relationships={getReflectionRelationships('personal', values)}
      summary={getReflectionSummary('personal', values, reflection)}
      working={false}
      onValueChange={vi.fn()}
      onSuggestionChange={vi.fn()}
    />
  );
  const section = screen.getByRole('region', { name: 'Balancing your values' });
  expect(within(section).getByRole('heading', { name: 'FAST PACE / PRECISE WORK' })).toBeVisible();
  expect(within(section).queryByRole('textbox')).not.toBeInTheDocument();
  expect(screen.getByText('My earlier note')).toBeVisible();
  expect(screen.getByText('My earlier action')).toBeVisible();
});
