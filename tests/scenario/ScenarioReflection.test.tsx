// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';
import ScenarioReflection from '../../src/components/features/ScenarioReflection';

afterEach(() => {
  cleanup();
  localStorage.clear();
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
