import 'fake-indexeddb/auto';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { deleteDB } from 'idb';
import { ExerciseRoute } from '../../src/app/ExerciseRoute';
import { CompletedRoute } from '../../src/app/CompletedRoute';
import { ReasoningRoute } from '../../src/app/ReasoningRoute';
import { closeSessionRepository, createSession } from '../../src/lib/db/canonicalSessionRepository';

afterEach(async () => {
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
