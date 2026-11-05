import 'fake-indexeddb/auto';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { deleteDB } from 'idb';
import { ExerciseRoute } from '../../src/app/ExerciseRoute';
import { ReasoningRoute } from '../../src/app/ReasoningRoute';
import { closeSessionRepository, createSession } from '../../src/lib/db/canonicalSessionRepository';

afterEach(async () => {
  cleanup();
  await closeSessionRepository();
  await deleteDB('coreValuesData');
  localStorage.clear();
});

test('a normally sorted exercise offers optional reasons and can complete without entering one', async () => {
  localStorage.setItem('show-instructions', 'false');
  const record = await createSession({
    initialValues: ['a', 'b'].map((id) => ({ id, title: `Value ${id}`, description: `Description ${id}` })),
    targetCoreValues: 1,
    exerciseType: 'team',
  });
  render(
    <MemoryRouter initialEntries={[`/exercise?sessionId=${record.session.id}`]}>
      <Routes>
        <Route path="/exercise" element={<ExerciseRoute />} />
        <Route path="/reasoning" element={<ReasoningRoute />} />
      </Routes>
    </MemoryRouter>
  );
  fireEvent.click(await screen.findByRole('button', { name: 'Place Value a' }));
  await screen.findByRole('button', { name: 'Move Value a' });
  fireEvent.change(screen.getByLabelText('Category for Value b'), { target: { value: 'Not Important' } });
  fireEvent.click(screen.getByRole('button', { name: 'Place Value b' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Complete exercise' }));
  expect(await screen.findByRole('heading', { name: 'Reflect on your choices' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Value a', exact: true })).toHaveValue('');
  fireEvent.click(screen.getByRole('button', { name: 'Complete exercise' }));
  expect(await screen.findByRole('heading', { name: 'Exercise complete' })).toBeInTheDocument();
});

test('a placed value is immediately visible and can be moved without reloading', async () => {
  localStorage.setItem('show-instructions', 'false');
  const record = await createSession({
    initialValues: ['a', 'b'].map((id) => ({ id, title: `Value ${id}`, description: `Description ${id}` })),
    targetCoreValues: 1,
    exerciseType: 'personal',
  });
  render(
    <MemoryRouter initialEntries={[`/exercise?sessionId=${record.session.id}`]}>
      <Routes>
        <Route path="/exercise" element={<ExerciseRoute />} />
      </Routes>
    </MemoryRouter>
  );
  fireEvent.click(await screen.findByRole('button', { name: 'Place Value a' }));
  const important = screen.getByRole('region', { name: 'Very Important' });
  expect(await within(important).findByText('Value a')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Move Value a to'), { target: { value: 'Not Important' } });
  fireEvent.click(screen.getByRole('button', { name: 'Move Value a' }));
  const rejected = screen.getByRole('region', { name: 'Not Important' });
  expect(await within(rejected).findByText('Value a')).toBeInTheDocument();
});
