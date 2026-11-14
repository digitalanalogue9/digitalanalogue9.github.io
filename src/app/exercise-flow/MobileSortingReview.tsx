import { useEffect, useRef, useState } from 'react';
import type { CategoryName, CategoriesState, RoundSnapshot, ValueCard } from '@/lib/contracts/types';
import CardEntry from './CardEntry';
import CurrentCardPanel from './CurrentCardPanel';
import EmptyCurrentCard from './EmptyCurrentCard';
import FinishConfirmationDialog from './FinishConfirmationDialog';

type Props = {
  round: RoundSnapshot;
  roundNumber: number;
  targetCoreValues: number;
  remainingCards: number;
  totalCards: number;
  message: string;
  error: string | null;
  valueCard?: ValueCard;
  activeCategories: CategoryName[];
  categories: CategoriesState;
  onDrop: (category: CategoryName) => Promise<boolean>;
  onMove: (valueId: string, fromCategory: CategoryName, toCategory: CategoryName) => Promise<boolean>;
  onReorder: (valueId: string, category: CategoryName, toIndex: number) => Promise<boolean>;
  onAdvance: (earlyFinish: boolean) => void;
  onReplayPrevious: () => void;
  working: boolean;
  canAdvance: boolean;
  canComplete: boolean;
  canEarlyFinish: boolean;
  canReplayPrevious: boolean;
};

export default function MobileSortingReview({
  round,
  roundNumber,
  targetCoreValues,
  remainingCards,
  totalCards,
  message,
  error,
  valueCard,
  activeCategories,
  categories,
  onDrop,
  onMove,
  onReorder,
  onAdvance,
  onReplayPrevious,
  working,
  canAdvance,
  canComplete,
  canEarlyFinish,
  canReplayPrevious,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryName>(activeCategories[0] ?? 'Very Important');
  const [isReviewing, setIsReviewing] = useState(false);
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);
  const [isNextRoundChoice, setIsNextRoundChoice] = useState(false);
  const [editMessage, setEditMessage] = useState('');
  const [placementFeedback, setPlacementFeedback] = useState<{ category: CategoryName; sequence: number } | null>(null);
  const placementActionsRef = useRef<HTMLDivElement>(null);
  const categoryPickerRef = useRef<HTMLElement>(null);
  const placementFocusRef = useRef<HTMLButtonElement | null>(null);
  const restorePlacementFocusRef = useRef(false);
  const pendingEditFocusRef = useRef<{ title: string; category: CategoryName } | null>(null);
  const placedValueCards = Math.max(0, totalCards - remainingCards);
  const primaryActionLabel = canComplete ? 'Proceed to reasoning' : 'Next Round';

  useEffect(() => {
    if (!activeCategories.includes(selectedCategory)) {
      setSelectedCategory(activeCategories[0]);
    }
  }, [activeCategories, selectedCategory]);

  useEffect(() => {
    if (working || !placementFocusRef.current) return;
    const previousButton = placementFocusRef.current;
    placementFocusRef.current = null;
    if (previousButton.isConnected) previousButton.focus();
  }, [valueCard, working]);

  useEffect(() => {
    if (!isReviewing && restorePlacementFocusRef.current) {
      restorePlacementFocusRef.current = false;
      const placementButton = placementActionsRef.current?.querySelector<HTMLButtonElement>(
        'button[aria-label^="Place current card in "]'
      );
      if (placementButton) {
        placementButton.focus();
      } else {
        Array.from(categoryPickerRef.current?.querySelectorAll<HTMLButtonElement>('button[aria-label]') ?? [])
          .find((button) => button.getAttribute('aria-label')?.startsWith(`Review ${selectedCategory},`))
          ?.focus();
      }
    }
  }, [isReviewing, selectedCategory]);

  useEffect(() => {
    const pendingFocus = pendingEditFocusRef.current;
    if (!pendingFocus || working) return;
    const cardIsPresent = categories[pendingFocus.category].some((value) => value.title === pendingFocus.title);
    if (!cardIsPresent) return;
    const valueRow = Array.from(document.querySelectorAll<HTMLLIElement>('li[aria-label]')).find(
      (element) => element.getAttribute('aria-label') === `${pendingFocus.title} in ${pendingFocus.category}`
    );
    if (valueRow) {
      valueRow.focus();
      pendingEditFocusRef.current = null;
    }
  }, [categories, editMessage, selectedCategory, working]);

  const handlePlace = (category: CategoryName) => {
    const activeElement = document.activeElement;
    if (
      activeElement instanceof HTMLButtonElement &&
      activeElement.matches(':focus-visible') &&
      activeElement.closest('[aria-label="Mobile placement actions"]')
    ) {
      placementFocusRef.current = activeElement;
    }
    void onDrop(category).then((success) => {
      if (success) setPlacementFeedback((previous) => ({ category, sequence: (previous?.sequence ?? 0) + 1 }));
    });
  };

  const handleMove = async (valueId: string, fromCategory: CategoryName, toCategory: CategoryName) => {
    const value = categories[fromCategory].find((card) => card.id === valueId);
    if (!value) return;
    pendingEditFocusRef.current = { title: value.title, category: toCategory };
    if (!(await onMove(valueId, fromCategory, toCategory))) {
      pendingEditFocusRef.current = null;
      return;
    }
    setSelectedCategory(toCategory);
    setEditMessage(`Moved ${value.title} to ${toCategory}.`);
  };

  const handleReorder = async (valueId: string, category: CategoryName, toIndex: number) => {
    const cards = categories[category];
    const value = cards.find((card) => card.id === valueId);
    const fromIndex = cards.findIndex((card) => card.id === valueId);
    if (!value || fromIndex === toIndex) return;
    pendingEditFocusRef.current = { title: value.title, category };
    if (!(await onReorder(valueId, category, toIndex))) {
      pendingEditFocusRef.current = null;
      return;
    }
    setEditMessage(`Moved ${value.title} ${toIndex < fromIndex ? 'up' : 'down'} in ${category}.`);
  };

  const handleCardMove = (valueId: string, from: CategoryName, to: CategoryName) => {
    void handleMove(valueId, from, to);
  };

  const handleCardReorder = (valueId: string, category: CategoryName, toIndex: number) => {
    void handleReorder(valueId, category, toIndex);
  };

  const placedCount = (category: CategoryName) => categories[category].length;
  const errorAlert = error ? (
    <p
      className="rounded-sys-radius-button-sm bg-ref-color-rag-red-light text-interface-base-small text-ref-color-rag-red-text px-3 py-2"
      role="alert"
    >
      {error}
    </p>
  ) : null;
  const categoryPicker = (
    <section ref={categoryPickerRef} aria-label="Category review" className="space-y-2">
      <h2 className="text-sys-color-text-primary text-interface-base-default text-center font-semibold">
        Tap a category to review or rearrange its values
      </h2>
      <div className="mobile-category-grid grid grid-cols-3 gap-2">
        {activeCategories.map((category) => (
          <button
            key={category}
            type="button"
            className="border-sys-color-border-strong bg-sys-color-surface-subtle text-sys-color-text-primary hover:bg-sys-color-surface-subtle-hover focus-visible:ring-sys-color-focus-ring rounded-sys-radius-button-sm text-interface-base-small flex min-h-11 items-center justify-between gap-3 border px-3 py-2 text-left font-medium focus-visible:ring-2 focus-visible:outline-none"
            onClick={() => {
              setSelectedCategory(category);
              setIsReviewing(true);
            }}
            aria-label={`Review ${category}, ${placedCount(category)} ${placedCount(category) === 1 ? 'value' : 'values'}`}
            aria-pressed={selectedCategory === category && isReviewing}
          >
            <span className="wrap-break-word">{category}</span>
            <span
              key={placementFeedback?.category === category ? placementFeedback.sequence : 0}
              className={`rounded-ref-radius-999 bg-sys-color-surface-subtle shrink-0 px-2.5 py-1 ${placementFeedback?.category === category ? 'category-count-feedback' : ''}`}
              aria-hidden="true"
            >
              {placedCount(category)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );

  return (
    <section className="mobile-sorting space-y-3 lg:hidden" aria-label="Mobile exercise">
      <div className="border-sys-color-border-default rounded-sys-radius-card-sm bg-sys-color-surface-default space-y-3 border p-4 shadow-sm">
        <h2 className="sr-only">Round {roundNumber} command center</h2>
        <div className="text-interface-base-small flex flex-wrap items-center justify-between gap-2">
          <span className="bg-ref-color-brand-primary text-sys-color-text-inverse rounded-ref-radius-999 px-3 py-1 font-medium">
            Round {roundNumber}
          </span>
          <span className="text-sys-color-text-primary font-medium">Target core values: {targetCoreValues}</span>
          <span role="group" aria-label="Cards remaining" className="text-sys-color-text-primary font-medium">
            {remainingCards} / {totalCards}
          </span>
        </div>
        <progress
          className="accent-ref-color-brand-accent h-2 w-full"
          value={placedValueCards}
          max={totalCards}
          aria-label={`${placedValueCards} of ${totalCards} value cards placed`}
        />
      </div>

      {isReviewing ? (
        <>
          {categoryPicker}
          <section
            className="border-sys-color-border-default rounded-sys-radius-card-sm bg-sys-color-surface-default space-y-3 border p-4 shadow-sm"
            aria-label={`${selectedCategory} review`}
          >
            <h2 className="text-sys-color-text-primary text-interface-title-1 font-semibold">{selectedCategory}</h2>
            {categories[selectedCategory].length === 0 ? (
              <p className="text-sys-color-text-secondary rounded-sys-radius-button-sm bg-sys-color-surface-subtle text-interface-base-small px-3 py-4">
                No values in this category yet.
              </p>
            ) : (
              <ul aria-label={`${selectedCategory} values`} className="space-y-2 pb-16">
                {categories[selectedCategory].map((value, index, values) => (
                  <CardEntry
                    key={value.id}
                    card={value}
                    category={selectedCategory}
                    activeCategories={activeCategories}
                    onMove={handleCardMove}
                    onReorder={handleCardReorder}
                    index={index}
                    total={values.length}
                    disabled={working}
                    isAccessibilityMode={false}
                    showEditingControls
                  />
                ))}
              </ul>
            )}
            {editMessage && (
              <p className="sr-only" role="status" aria-live="polite">
                {editMessage}
              </p>
            )}
            {errorAlert}
            <div className="rounded-b-sys-radius-card-sm bg-sys-color-surface-default sticky bottom-0 -mx-4 -mb-4 px-4 pt-2 pb-4">
              <button
                type="button"
                className="cv-button min-h-11 w-full"
                onClick={() => {
                  restorePlacementFocusRef.current = true;
                  setIsReviewing(false);
                }}
              >
                Return to sorting
              </button>
            </div>
          </section>
        </>
      ) : (
        <>
          <section aria-label="Current sorting decision" className="space-y-3">
            {valueCard ? (
              <div ref={placementActionsRef} aria-label="Mobile placement actions">
                <CurrentCardPanel
                  card={valueCard}
                  activeCategories={activeCategories}
                  onDrop={handlePlace}
                  disabled={working}
                />
              </div>
            ) : (
              <EmptyCurrentCard />
            )}
          </section>

          {categoryPicker}

          {(canAdvance || canComplete || canEarlyFinish || canReplayPrevious || remainingCards === 0) && (
            <section aria-label="Round actions" className="space-y-2">
              {(canAdvance || canComplete) && (
                <button
                  type="button"
                  className="cv-button min-h-11 w-full"
                  onClick={() => {
                    if (
                      !canComplete &&
                      canEarlyFinish &&
                      round.categories['Very Important'].length >= targetCoreValues
                    ) {
                      setIsNextRoundChoice(true);
                      setIsFinishDialogOpen(true);
                    } else {
                      onAdvance(false);
                    }
                  }}
                  disabled={working}
                >
                  {working ? 'Working...' : primaryActionLabel}
                </button>
              )}
              {canEarlyFinish && !canComplete && (
                <button
                  type="button"
                  className="border-sys-color-border-strong text-sys-color-text-primary hover:bg-sys-color-surface-subtle focus-visible:ring-sys-color-focus-ring rounded-sys-radius-button-sm bg-sys-color-surface-default min-h-11 w-full border px-4 py-2 font-medium focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45"
                  onClick={() => {
                    setIsNextRoundChoice(false);
                    setIsFinishDialogOpen(true);
                  }}
                  disabled={working}
                >
                  Finish
                </button>
              )}
              {canReplayPrevious && (
                <button
                  type="button"
                  className="cv-button min-h-11 w-full"
                  onClick={onReplayPrevious}
                  disabled={working}
                >
                  Replay Previous Round
                </button>
              )}
              {remainingCards === 0 && (
                <p
                  className="text-sys-color-text-secondary text-interface-base-small leading-relaxed"
                  role="status"
                  aria-live="polite"
                >
                  {message}
                </p>
              )}
            </section>
          )}

          {errorAlert}
        </>
      )}

      <FinishConfirmationDialog
        open={isFinishDialogOpen}
        round={round}
        working={working}
        onCancel={() => setIsFinishDialogOpen(false)}
        onNextRound={
          isNextRoundChoice
            ? () => {
                setIsFinishDialogOpen(false);
                onAdvance(false);
              }
            : undefined
        }
        onContinue={() => {
          setIsFinishDialogOpen(false);
          onAdvance(true);
        }}
      />
    </section>
  );
}
