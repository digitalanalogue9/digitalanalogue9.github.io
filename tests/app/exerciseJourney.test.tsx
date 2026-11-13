import 'fake-indexeddb/auto';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { deleteDB } from 'idb';
import { ExerciseRoute } from '../../src/app/ExerciseRoute';
import { CompletedRoute } from '../../src/app/CompletedRoute';
import { ReasoningRoute } from '../../src/app/ReasoningRoute';
import { closeSessionRepository, createSession } from '../../src/lib/db/canonicalSessionRepository';
import { getExerciseServiceSingleton } from '../../src/lib/services/ExerciseServiceContext';

afterEach(async () => {
  vi.restoreAllMocks();
  cleanup();
  await closeSessionRepository();
  await deleteDB('coreValuesData');
  localStorage.clear();
});

test('a normally sorted exercise opens optional reflection and completes with saved answers', async () => {
  localStorage.setItem('show-instructions', 'false');
  const record = await createSession({
    initialValues: ['a', 'b'].map((id) => ({ id, title: `Value ${id}`, description: `Description ${id}` })),
    targetCoreValues: 1,
    exerciseType: 'team',
  });
  const [kept, rejected] = record.currentRound.deck;
  render(
    <MemoryRouter initialEntries={[`/exercise?sessionId=${record.session.id}`]}>
      <Routes>
        <Route path="/exercise" element={<ExerciseRoute />} />
        <Route path="/reasoning" element={<ReasoningRoute />} />
        <Route path="/completed" element={<CompletedRoute />} />
      </Routes>
    </MemoryRouter>
  );
  await screen.findByLabelText(`Current card ${kept.title}`);
  expect(screen.queryByText(rejected.title)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Place current card in Very Important' }));
  await screen.findByLabelText(`Current card ${rejected.title}`);
  fireEvent.click(screen.getByRole('button', { name: 'Place current card in Not Important' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Proceed to reasoning' }));
  expect(await screen.findByRole('heading', { name: 'Reflect on your values' })).toBeInTheDocument();
  expect(
    await screen.findByText(new RegExp(`Where have we seen ${kept.title} shape the way we work together`))
  ).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Session goal (optional)' })).toHaveValue('');
  fireEvent.click(screen.getByRole('button', { name: 'Save reflection and complete' }));
  expect(await screen.findByRole('heading', { name: 'Reflect on your values' })).toBeInTheDocument();
});

test('a failed draft save keeps reflection entries visible and explains the storage error', async () => {
  localStorage.setItem('show-instructions', 'false');
  const service = getExerciseServiceSingleton();
  vi.spyOn(service, 'saveReflectionDraft').mockRejectedValue(new Error('Storage is unavailable.'));
  const record = await createSession({
    initialValues: ['a', 'b'].map((id) => ({ id, title: `Value ${id}`, description: `Description ${id}` })),
    targetCoreValues: 1,
    exerciseType: 'personal',
  });
  const [selected, rejected] = record.currentRound.deck;
  render(
    <MemoryRouter initialEntries={[`/exercise?sessionId=${record.session.id}`]}>
      <Routes>
        <Route path="/exercise" element={<ExerciseRoute />} />
        <Route path="/reasoning" element={<ReasoningRoute />} />
        <Route path="/completed" element={<CompletedRoute />} />
      </Routes>
    </MemoryRouter>
  );
  await screen.findByLabelText(`Current card ${selected.title}`);
  fireEvent.click(screen.getByRole('button', { name: 'Place current card in Very Important' }));
  await screen.findByLabelText(`Current card ${rejected.title}`);
  fireEvent.click(screen.getByRole('button', { name: 'Place current card in Not Important' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Proceed to reasoning' }));
  const goal = await screen.findByRole('textbox', { name: 'Session goal (optional)' });
  fireEvent.change(goal, { target: { value: 'Keep the important entries.' } });

  expect(await screen.findByRole('alert')).toHaveTextContent(/Draft could not be saved.*Storage is unavailable/);
  expect(goal).toHaveValue('Keep the important entries.');
});

test('a failed completion save keeps entries on the reflection page and can be retried', async () => {
  localStorage.setItem('show-instructions', 'false');
  const record = await createSession({
    initialValues: ['a', 'b'].map((id) => ({ id, title: `Value ${id}`, description: `Description ${id}` })),
    targetCoreValues: 1,
    exerciseType: 'personal',
  });
  const [selected, rejected] = record.currentRound.deck;
  const service = getExerciseServiceSingleton();
  vi.spyOn(service, 'completeSession').mockRejectedValueOnce(new Error('Storage is unavailable.'));
  render(
    <MemoryRouter initialEntries={[`/exercise?sessionId=${record.session.id}`]}>
      <Routes>
        <Route path="/exercise" element={<ExerciseRoute />} />
        <Route path="/reasoning" element={<ReasoningRoute />} />
        <Route path="/completed" element={<CompletedRoute />} />
      </Routes>
    </MemoryRouter>
  );
  await screen.findByLabelText(`Current card ${selected.title}`);
  fireEvent.click(screen.getByRole('button', { name: 'Place current card in Very Important' }));
  await screen.findByLabelText(`Current card ${rejected.title}`);
  fireEvent.click(screen.getByRole('button', { name: 'Place current card in Not Important' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Proceed to reasoning' }));
  const goal = await screen.findByRole('textbox', { name: 'Session goal (optional)' });
  fireEvent.change(goal, { target: { value: 'Retry this completed reflection.' } });
  await screen.findByText('Draft saved on this device.');

  fireEvent.click(screen.getByRole('button', { name: 'Save reflection and complete' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Storage is unavailable.');
  expect(screen.getByRole('heading', { name: 'Reflect on your values' })).toBeInTheDocument();
  expect(goal).toHaveValue('Retry this completed reflection.');

  fireEvent.click(screen.getByRole('button', { name: 'Save reflection and complete' }));
  expect(await screen.findByRole('heading', { name: 'Your Core Values' })).toBeInTheDocument();
  await waitFor(() => expect(service.completeSession).toHaveBeenCalledTimes(2));
});

test('a placed value is immediately visible and can be moved without reloading', async () => {
  localStorage.setItem('show-instructions', 'false');
  const record = await createSession({
    initialValues: ['a', 'b'].map((id) => ({ id, title: `Value ${id}`, description: `Description ${id}` })),
    targetCoreValues: 1,
    exerciseType: 'personal',
  });
  const kept = record.currentRound.deck[0];
  render(
    <MemoryRouter initialEntries={[`/exercise?sessionId=${record.session.id}`]}>
      <Routes>
        <Route path="/exercise" element={<ExerciseRoute />} />
      </Routes>
    </MemoryRouter>
  );
  fireEvent.click(await screen.findByRole('button', { name: 'Place current card in Very Important' }));
  const important = screen.getByRole('article', { name: 'Very Important category' });
  expect(await within(important).findByText(kept.title)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Accessibility/ }));
  fireEvent.click(await screen.findByRole('button', { name: `Move ${kept.title} to Not Important` }));
  const rejected = screen.getByRole('article', { name: 'Not Important category' });
  expect(await within(rejected).findByText(kept.title)).toBeInTheDocument();
});
