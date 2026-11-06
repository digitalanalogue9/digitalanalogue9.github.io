import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { ExerciseBoard } from '../../src/app/exercise-flow/ExerciseBoard';
import { createInitialRoundSnapshot } from '../../src/lib/domain/roundEngine';

afterEach(cleanup);

test('sorting presents only the current card and places it directly with a category button', () => {
  const round = createInitialRoundSnapshot(
    'test',
    [
      { id: 'a', title: 'First value', description: 'First description' },
      { id: 'b', title: 'Second value', description: 'Second description' },
    ],
    1,
    0
  );
  const onCommand = vi.fn().mockResolvedValue(true);
  render(<ExerciseBoard round={round} busy={false} onCommand={onCommand} />);
  expect(screen.getByLabelText(`Current card ${round.deck[0].title}`)).toBeInTheDocument();
  expect(screen.queryByText(round.deck[1].title)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Place current card in Very Important' }));
  expect(onCommand).toHaveBeenCalledWith({ kind: 'drop', valueId: round.deck[0].id, toCategory: 'Very Important' });
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
});

test('placed cards support description, accessible moves and ordering within a bucket', () => {
  const round = createInitialRoundSnapshot('test', [], 1, 0);
  round.activeCategories = ['Very Important', 'Not Important'];
  round.categories['Very Important'] = [
    { id: 'a', title: 'First value', description: 'First description' },
    { id: 'b', title: 'Second value', description: 'Second description' },
  ];
  const onCommand = vi.fn().mockResolvedValue(true);
  render(<ExerciseBoard round={round} busy={false} onCommand={onCommand} />);
  fireEvent.click(screen.getByRole('button', { name: /Accessibility/ }));
  const bucket = screen.getByRole('article', { name: 'Very Important category' });
  fireEvent.click(within(bucket).getByRole('button', { name: 'Show description for First value' }));
  expect(within(bucket).getByText('First description')).toBeInTheDocument();
  fireEvent.click(within(bucket).getByRole('button', { name: 'Move First value down in Very Important' }));
  expect(onCommand).toHaveBeenLastCalledWith({
    kind: 'move',
    valueId: 'a',
    fromCategory: 'Very Important',
    toCategory: 'Very Important',
    toIndex: 1,
  });
  fireEvent.click(within(bucket).getByRole('button', { name: 'Move First value to Not Important' }));
  expect(onCommand).toHaveBeenLastCalledWith({
    kind: 'move',
    valueId: 'a',
    fromCategory: 'Very Important',
    toCategory: 'Not Important',
  });
});
