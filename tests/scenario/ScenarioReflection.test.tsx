// @vitest-environment jsdom
import 'fake-indexeddb/auto';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { deleteDB } from 'idb';
import { afterEach, expect, test } from 'vitest';
import ScenarioReflection from '../../src/components/features/ScenarioReflection';
import { closeSessionRepository, completeSession, createSession } from '../../src/lib/db/canonicalSessionRepository';

afterEach(async () => {
  cleanup();
  localStorage.clear();
  await closeSessionRepository();
  await deleteDB('coreValuesData');
});

test('a participant can complete the scenarios and see the saved hypothetical reflection after returning', async () => {
  localStorage.setItem('coreValuesData', JSON.stringify({ sessions: ['existing-card-sort-session'] }));
  const firstVisit = render(<ScenarioReflection />);

  fireEvent.click(screen.getByRole('button', { name: 'Begin scenarios' }));
  fireEvent.click(screen.getByRole('radio', { name: 'Share a range and explain what could move it.' }));

  for (let index = 1; index < 6; index += 1) {
    fireEvent.click(screen.getByRole('button', { name: 'Next situation' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Skip this situation' }));
  }

  fireEvent.click(screen.getByRole('button', { name: 'Finish and see reflections' }));

  expect(screen.getByRole('heading', { name: 'Your scenario reflections' })).toBeTruthy();
  expect(screen.getByText(/These are possibilities to consider/)).toBeTruthy();
  expect(screen.getByText(/Possible intention:/)).toBeTruthy();
  expect(screen.getByText(/Possible perception:/)).toBeTruthy();
  expect(screen.getAllByText(/It depends or skipped/)).toHaveLength(5);

  firstVisit.unmount();
  render(<ScenarioReflection />);

  expect(screen.getByRole('heading', { name: 'Your scenario reflections' })).toBeTruthy();
  expect(screen.getByText(/Possible intention:/)).toBeTruthy();
  expect(JSON.parse(localStorage.getItem('coreValuesData') ?? '{}')).toEqual({
    sessions: ['existing-card-sort-session'],
  });
});

test('an in-progress scenario reflection resumes at its saved situation', () => {
  const firstVisit = render(<ScenarioReflection />);
  fireEvent.click(screen.getByRole('button', { name: 'Begin scenarios' }));
  fireEvent.click(screen.getByRole('radio', { name: 'Share a range and explain what could move it.' }));
  fireEvent.click(screen.getByRole('button', { name: 'Next situation' }));
  firstVisit.unmount();

  render(<ScenarioReflection />);

  expect(screen.getByText('Situation 2 of 6')).toBeTruthy();
  expect(screen.getByRole('heading', { name: /In a meeting/ })).toBeTruthy();
});

test('a participant can save reflection notes and preferences for a recurring prompt', () => {
  const firstVisit = render(<ScenarioReflection />);
  fireEvent.click(screen.getByRole('button', { name: 'Begin scenarios' }));
  fireEvent.click(screen.getByRole('radio', { name: 'Share a range and explain what could move it.' }));
  for (let index = 1; index < 6; index += 1) {
    fireEvent.click(screen.getByRole('button', { name: 'Next situation' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Skip this situation' }));
  }
  fireEvent.click(screen.getByRole('button', { name: 'Finish and see reflections' }));
  fireEvent.change(screen.getByLabelText('Your reflection for share-range-open'), {
    target: { value: 'worth-considering' },
  });
  fireEvent.change(screen.getByLabelText('Optional note'), {
    target: { value: 'I want to explore this possibility.' },
  });
  fireEvent.click(screen.getByLabelText('Include in a prompt'));
  fireEvent.click(screen.getByRole('button', { name: 'Create one-off prompt' }));
  expect((screen.getByLabelText('Prompt preview') as HTMLTextAreaElement).value).toContain('Possible intention:');
  expect((screen.getByLabelText('Prompt preview') as HTMLTextAreaElement).value).toContain(
    'I want to explore this possibility.'
  );
  fireEvent.change(screen.getByLabelText('Cadence'), { target: { value: 'weekly' } });
  fireEvent.change(screen.getByLabelText('Time zone'), { target: { value: 'Europe/London' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save reminder preferences' }));
  fireEvent.click(screen.getByRole('button', { name: 'Create recurring prompt' }));
  expect((screen.getByLabelText('Prompt preview') as HTMLTextAreaElement).value).toContain('Suggested cadence: weekly');
  expect((screen.getByLabelText('Prompt preview') as HTMLTextAreaElement).value).toContain('not a diagnosis');
  firstVisit.unmount();
  render(<ScenarioReflection />);
  expect((screen.getByLabelText('Your reflection for share-range-open') as HTMLSelectElement).value).toBe(
    'worth-considering'
  );
  expect((screen.getByLabelText('Optional note') as HTMLTextAreaElement).value).toBe(
    'I want to explore this possibility.'
  );
  expect((screen.getByLabelText('Cadence') as HTMLSelectElement).value).toBe('weekly');
});

test('a participant can connect a reflection to a value from a saved completed exercise', async () => {
  const session = await createSession({
    initialValues: [{ id: 'courage', title: 'Courage', description: 'Act with care despite uncertainty.' }],
    targetCoreValues: 1,
    exerciseType: 'personal',
  });
  await completeSession(session.session.id, [
    { id: 'courage', title: 'Courage', description: 'Act with care despite uncertainty.' },
  ]);
  render(<ScenarioReflection />);
  fireEvent.click(screen.getByRole('button', { name: 'Begin scenarios' }));
  fireEvent.click(screen.getByRole('radio', { name: 'Share a range and explain what could move it.' }));
  for (let index = 1; index < 6; index += 1) {
    fireEvent.click(screen.getByRole('button', { name: 'Next situation' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Skip this situation' }));
  }
  fireEvent.click(screen.getByRole('button', { name: 'Finish and see reflections' }));
  const valueSelector = await screen.findByLabelText('Saved completed values for uncertain-estimate');
  await screen.findByRole('option', { name: 'Courage · Personal' });
  fireEvent.change(valueSelector, { target: { value: 'Courage (personal)' } });
  await waitFor(() => expect((valueSelector as HTMLSelectElement).value).toBe('Courage (personal)'));
  fireEvent.change(screen.getByLabelText('Optional note about this connection'), {
    target: { value: 'I connect this value to speaking honestly about uncertainty.' },
  });
  fireEvent.click(screen.getByLabelText('Include in a prompt'));
  fireEvent.click(screen.getByRole('button', { name: 'Create one-off prompt' }));
  expect((screen.getByLabelText('Prompt preview') as HTMLTextAreaElement).value).toContain(
    'A value I chose to connect: Courage'
  );
  expect((screen.getByLabelText('Prompt preview') as HTMLTextAreaElement).value).toContain(
    'I connect this value to speaking honestly about uncertainty.'
  );
});
