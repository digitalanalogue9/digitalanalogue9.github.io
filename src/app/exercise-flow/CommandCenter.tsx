import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { CategoryName, ValueCard } from '@/lib/contracts/types';
import CurrentCardPanel from './CurrentCardPanel';
import EmptyCurrentCard from './EmptyCurrentCard';

interface CommandCenterProps {
  roundNumber: number;
  targetCoreValues: number;
  remainingCards: number;
  totalCards: number;
  message: string;
  error: string | null;
  card?: ValueCard;
  activeCategories: CategoryName[];
  onDrop: (toCategory: CategoryName) => void;
  onAdvance: (earlyFinish: boolean) => void;
  onReplayPrevious: () => void;
  working: boolean;
  canAdvance: boolean;
  canComplete: boolean;
  canEarlyFinish: boolean;
  canReplayPrevious: boolean;
}

export default function CommandCenter({
  roundNumber,
  targetCoreValues,
  remainingCards,
  totalCards,
  message,
  error,
  card,
  activeCategories,
  onDrop,
  onAdvance,
  onReplayPrevious,
  working,
  canAdvance,
  canComplete,
  canEarlyFinish,
  canReplayPrevious,
}: CommandCenterProps) {
  const currentCardAreaRef = useRef<HTMLDivElement>(null);
  const primaryActionRef = useRef<HTMLButtonElement>(null);
  const placementFocusRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (working || !placementFocusRef.current) return;
    const previousButton = placementFocusRef.current;
    placementFocusRef.current = null;
    // Saving disables the native button; restore its focus or move to the round action.
    const target = previousButton.isConnected
      ? previousButton
      : primaryActionRef.current && !primaryActionRef.current.disabled
        ? primaryActionRef.current
        : currentCardAreaRef.current;
    target?.focus();
  }, [card, working]);

  const handlePlace = (category: CategoryName) => {
    if (working) return;
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLButtonElement && currentCardAreaRef.current?.contains(activeElement)) {
      placementFocusRef.current = activeElement;
    }
    onDrop(category);
  };
  const placedCards = Math.max(0, totalCards - remainingCards);
  const progressPercent = totalCards > 0 ? Math.round((placedCards / totalCards) * 100) : 100;
  const canUsePrimaryAction = canAdvance || canComplete;
  const primaryActionLabel = canComplete ? 'Proceed to reasoning' : 'Next Round';

  return (
    <section
      className="border-sys-color-border-default rounded-sys-radius-card-sm bg-sys-color-surface-default border p-4 shadow-sm sm:p-5"
      aria-labelledby="round-heading"
    >
      <h2 id="round-heading" className="sr-only">
        Round {roundNumber} command center
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-stretch md:gap-6">
        <div
          ref={currentCardAreaRef}
          tabIndex={-1}
          role="group"
          aria-label="Card sorting controls"
          className="focus-visible:ring-sys-color-focus-ring rounded-sys-radius-card-sm flex min-w-0 justify-center focus-visible:ring-2 focus-visible:outline-none md:col-span-2"
        >
          {card ? (
            <CurrentCardPanel card={card} activeCategories={activeCategories} onDrop={handlePlace} disabled={working} />
          ) : (
            <EmptyCurrentCard />
          )}
        </div>

        <div className="flex min-w-0 flex-col md:py-5">
          <div className="text-interface-base-small grid grid-cols-3 items-stretch gap-2 text-center">
            <span className="bg-ref-color-brand-primary text-sys-color-text-inverse rounded-ref-radius-999 flex min-w-0 items-center justify-center px-2 py-1 font-medium wrap-break-word">
              Round {roundNumber}
            </span>
            <span className="bg-ref-color-brand-primary text-sys-color-text-inverse rounded-ref-radius-999 flex min-w-0 items-center justify-center px-2 py-1 font-medium wrap-break-word">
              Target: {targetCoreValues}
            </span>
            <span
              role="group"
              aria-label="Cards remaining"
              className="bg-ref-color-brand-primary text-sys-color-text-inverse rounded-ref-radius-999 flex min-w-0 items-center justify-center px-2 py-1 font-medium wrap-break-word"
            >
              {remainingCards} / {totalCards}
            </span>
          </div>

          <div
            role="progressbar"
            aria-valuenow={placedCards}
            aria-valuemin={0}
            aria-valuemax={totalCards}
            aria-label={`${placedCards} of ${totalCards} cards placed`}
            className="mt-4"
          >
            <div className="bg-sys-color-surface-subtle rounded-ref-radius-999 h-2 overflow-hidden">
              <motion.div
                className="bg-ref-color-brand-accent rounded-ref-radius-999 h-full origin-left"
                initial={false}
                animate={{ scaleX: progressPercent / 100 }}
                transition={{ type: 'spring', stiffness: 180, damping: 26 }}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1">
            <button
              ref={primaryActionRef}
              type="button"
              className="apc-button active:scale-[0.98] motion-reduce:active:scale-100"
              onClick={() => onAdvance(false)}
              disabled={working || !canUsePrimaryAction}
              aria-disabled={working || !canUsePrimaryAction}
            >
              {working ? 'Working...' : primaryActionLabel}
            </button>
            <button
              type="button"
              className="border-sys-color-border-strong text-sys-color-text-primary hover:bg-sys-color-surface-subtle focus-visible:ring-sys-color-focus-ring rounded-sys-radius-button-sm bg-sys-color-surface-default border px-4 py-2 font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:active:scale-100"
              onClick={() => onAdvance(true)}
              disabled={working || !canEarlyFinish || canComplete}
            >
              Early Finish
            </button>
            {canReplayPrevious && (
              <button
                type="button"
                className="border-sys-color-border-strong text-sys-color-text-primary hover:bg-sys-color-surface-subtle focus-visible:ring-sys-color-focus-ring rounded-sys-radius-button-sm bg-sys-color-surface-default border px-4 py-2 font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:active:scale-100"
                onClick={onReplayPrevious}
                disabled={working}
              >
                Replay Previous Round
              </button>
            )}
          </div>

          {remainingCards === 0 && (
            <p
              className="text-sys-color-text-secondary text-interface-base-small mt-4 leading-relaxed"
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          )}

          {card && (
            <p className="text-sys-color-text-secondary text-interface-base-small mt-4 leading-relaxed">
              Select a category to place this card, or drag it into a bucket. Drag onto a card in a bucket to place it
              above or below.
            </p>
          )}

          {error && (
            <p
              className="border-accent-error/20 bg-accent-error/5 text-accent-error rounded-sys-radius-button-sm text-interface-base-small mt-3 border px-3 py-2"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
