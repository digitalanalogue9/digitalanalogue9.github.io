import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import FinishConfirmationDialog from '../../src/app/exercise-flow/FinishConfirmationDialog';
import { createInitialRoundSnapshot } from '../../src/lib/domain/roundEngine';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test('explains that only the top values are used when Very Important exceeds the target', () => {
  const round = createInitialRoundSnapshot('test', [], 10, 0);
  round.activeCategories = ['Very Important', 'Quite Important', 'Not Important'];
  round.categories['Very Important'] = Array.from({ length: 11 }, (_, index) => ({
    id: String(index),
    title: `Value ${index}`,
    description: '',
  }));
  render(
    <FinishConfirmationDialog open={false} round={round} working={false} onContinue={() => {}} onCancel={() => {}} />
  );
  expect(screen.getByText(/Your target is/)).toHaveTextContent(
    'If you finish now, only the top 10 values in Very Important will be used.'
  );
  expect(screen.getByText(/Your target is/)).toHaveTextContent(
    'The remaining values will move to the top of Quite Important.'
  );
});
