import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MobileProvider, useMobile } from '../../lib/contexts/MobileContext';
import { evaluateRoundTransition } from '../../lib/domain/roundEngine';
import type { CategoryName, RoundCommand, RoundSnapshot } from '../../lib/contracts/types';
import BucketColumn from './BucketColumn';
import CommandCenter from './CommandCenter';
import MobileSortingReview from './MobileSortingReview';

type Props = {
  round: RoundSnapshot;
  busy: boolean;
  onCommand: (command: RoundCommand) => Promise<boolean>;
  onAdvance?: (earlyFinish: boolean) => void;
  onReplayPrevious?: () => void;
  error?: string;
};

export function ExerciseBoard(props: Props) {
  return (
    <MobileProvider>
      <DndProvider backend={HTML5Backend}>
        <SortingBoard {...props} />
      </DndProvider>
    </MobileProvider>
  );
}

function SortingBoard({ round, busy, onCommand, onAdvance = () => {}, onReplayPrevious = () => {}, error }: Props) {
  const { isMobile } = useMobile();
  const [isAccessibilityMode, setAccessibilityMode] = useState(false);
  const transition = evaluateRoundTransition(round);
  const totalCards =
    round.deck.length + round.activeCategories.reduce((sum, category) => sum + round.categories[category].length, 0);
  const onDrop = (category: CategoryName, valueId = round.deck[0]?.id, toIndex?: number) => {
    if (valueId)
      return onCommand({ kind: 'drop', valueId, toCategory: category, ...(toIndex === undefined ? {} : { toIndex }) });
    return Promise.resolve(false);
  };
  const onMove = (valueId: string, fromCategory: CategoryName, toCategory: CategoryName) =>
    onCommand({ kind: 'move', valueId, fromCategory, toCategory });
  const onReorder = (valueId: string, category: CategoryName, toIndex: number) =>
    onCommand({ kind: 'move', valueId, fromCategory: category, toCategory: category, toIndex });
  const controls = {
    roundNumber: round.roundNumber,
    targetCoreValues: round.targetCoreValues,
    remainingCards: round.deck.length,
    totalCards,
    message: transition.message,
    error: error || null,
    activeCategories: round.activeCategories,
    working: busy,
    canAdvance: transition.canAdvance,
    canComplete: transition.canComplete,
    canEarlyFinish: transition.canEarlyFinish,
    canReplayPrevious: round.roundNumber > 1 && round.deck.length > 0,
    onAdvance,
    onReplayPrevious,
  };
  const columns: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-3 lg:grid-cols-5',
  };
  return (
    <section aria-label={`Round ${round.roundNumber}`} aria-busy={busy} className="space-y-6">
      {isMobile ? (
        <MobileSortingReview
          {...controls}
          valueCard={round.deck[0]}
          categories={round.categories}
          onDrop={onDrop}
          onMove={onMove}
          onReorder={onReorder}
        />
      ) : (
        <>
          <button
            type="button"
            aria-pressed={isAccessibilityMode}
            onClick={() => setAccessibilityMode((value) => !value)}
          >
            Accessibility {isAccessibilityMode ? 'On' : 'Off'}
          </button>
          <CommandCenter {...controls} card={round.deck[0]} onDrop={onDrop} />
          <section className="pb-2" aria-label="Sorting buckets">
            <div
              className={`exercise-bucket-grid grid gap-4 ${columns[round.activeCategories.length]}`}
            >
              {round.activeCategories.map((category) => (
                <BucketColumn
                  key={category}
                  category={category}
                  cards={round.categories[category]}
                  activeCategories={round.activeCategories}
                  onDrop={onDrop}
                  onDropFromDeck={onDrop}
                  onMove={onMove}
                  onReorder={onReorder}
                  disabled={busy}
                  isAccessibilityMode={isAccessibilityMode}
                  hasRemainingCards={round.deck.length > 0}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </section>
  );
}
