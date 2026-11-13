import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import CommandCenter from '../../src/app/exercise-flow/CommandCenter';
import MobileSortingReview from '../../src/app/exercise-flow/MobileSortingReview';
import { createInitialRoundSnapshot } from '../../src/lib/domain/roundEngine';

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
});

test('offers the finish or next round choice on mobile', () => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value() {
      this.setAttribute('open', '');
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value() {
      this.removeAttribute('open');
    },
  });
  const round = createInitialRoundSnapshot('test', [], 1, 0);
  round.categories['Very Important'] = [{ id: 'a', title: 'Value A', description: '' }];
  const advance = vi.fn();
  const command = vi.fn().mockResolvedValue(true);
  render(
    <MobileSortingReview
      round={round}
      roundNumber={1}
      targetCoreValues={1}
      remainingCards={0}
      totalCards={2}
      message=""
      error={null}
      activeCategories={round.activeCategories}
      categories={round.categories}
      onDrop={command}
      onMove={command}
      onReorder={command}
      onAdvance={advance}
      onReplayPrevious={() => {}}
      working={false}
      canAdvance
      canComplete={false}
      canEarlyFinish
      canReplayPrevious={false}
    />
  );
  fireEvent.click(screen.getByRole('button', { name: 'Next Round' }));
  const dialog = screen.getByRole('dialog', { name: 'Finish now?' });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Finish now' }));
  expect(advance).toHaveBeenCalledWith(true);
});

test.each([2, 3])('offers finishing or another round when %i values meet a target of two', (count) => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value() {
      this.setAttribute('open', '');
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value() {
      this.removeAttribute('open');
    },
  });
  const round = createInitialRoundSnapshot('test', [], 2, 0);
  round.categories['Very Important'] = Array.from({ length: count }, (_, index) => ({
    id: String(index),
    title: `Value ${index}`,
    description: '',
  }));
  const advance = vi.fn();
  render(
    <CommandCenter
      round={round}
      roundNumber={1}
      targetCoreValues={2}
      remainingCards={0}
      totalCards={count + 1}
      message=""
      error={null}
      activeCategories={round.activeCategories}
      onDrop={() => {}}
      onAdvance={advance}
      onReplayPrevious={() => {}}
      working={false}
      canAdvance
      canComplete={false}
      canEarlyFinish
      canReplayPrevious={false}
    />
  );
  fireEvent.click(screen.getByRole('button', { name: 'Next Round' }));
  const dialog = screen.getByRole('dialog', { name: 'Finish now?' });
  expect(dialog).toHaveTextContent('Would you like to finish now or continue to the next round?');
  if (count > 2) expect(dialog).toHaveTextContent('only the top 2 values in Very Important will be used');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Next Round' }));
  expect(advance).toHaveBeenCalledWith(false);
  fireEvent.click(screen.getByRole('button', { name: 'Next Round' }));
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Finish now' }));
  expect(advance).toHaveBeenLastCalledWith(true);
});
