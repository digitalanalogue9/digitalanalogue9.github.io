import 'fake-indexeddb/auto';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HistoryRoute } from '../../src/app/HistoryRoute';
import { ReplayRoute } from '../../src/app/ReplayRoute';
import { closeSessionRepository, importSessionData } from '../../src/lib/db/canonicalSessionRepository';
import { deleteDB } from 'idb';

const DB_NAME = 'coreValuesData';
const value = (id: string) => ({ id, title: `Value ${id}`, description: `Description ${id}` });

afterEach(async () => {
  cleanup();
  await closeSessionRepository();
  await deleteDB(DB_NAME);
});

describe('Session history and replay', () => {
  test('opens a saved completed Session and replays choices from its earlier rounds', async () => {
    await importSessionData({
      session: {
        id: 'history-session',
        timestamp: 100,
        targetCoreValues: 1,
        currentRound: 2,
        completed: true,
        initialValues: [value('a'), value('b')],
        remainingValues: [value('a')],
        exerciseType: 'personal',
      },
      completedSession: { sessionId: 'history-session', timestamp: 220, finalValues: [value('a')] },
      rounds: [
        {
          sessionId: 'history-session',
          roundNumber: 1,
          timestamp: 110,
          commands: [{ type: 'DROP', payload: { cardId: 'b', cardTitle: 'Value b', category: 'Not Important' } }],
          availableCategories: { 'Very Important': [], 'Not Important': [value('b')] },
        },
        {
          sessionId: 'history-session',
          roundNumber: 2,
          timestamp: 210,
          commands: [{ type: 'DROP', payload: { cardId: 'a', cardTitle: 'Value a', category: 'Very Important' } }],
          availableCategories: { 'Very Important': [value('a')], 'Not Important': [] },
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={['/history']}>
        <Routes>
          <Route path="/history" element={<HistoryRoute />} />
          <Route path="/replay" element={<ReplayRoute />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole('link', { name: 'Resume' })).toHaveAttribute(
      'href',
      '/reasoning?sessionId=history-session'
    );
    fireEvent.click(screen.getByRole('link', { name: 'Replay' }));
    expect(await screen.findByRole('heading', { name: 'Replay', exact: true })).toBeInTheDocument();
    fireEvent.change(await screen.findByLabelText('Playback speed'), { target: { value: '2x' } });
    fireEvent.click(screen.getByRole('button', { name: 'Play', exact: true }));
    expect(await screen.findByText('Round 2 snapshot', {}, { timeout: 5000 })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Play Again' }, { timeout: 5000 })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('heading', { name: 'Round 1 snapshot' })).toBeInTheDocument();
  });
});
