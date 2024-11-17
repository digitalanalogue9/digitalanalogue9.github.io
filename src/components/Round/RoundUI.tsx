'use client'

import { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { saveRound, updateSession, saveCompletedSession } from '@/db/indexedDB';
import Results from '../Results';
import { useSession } from '@/hooks/useSession';
import { useGameState } from '@/hooks/useGameState';
import { useCommands } from '@/hooks/useCommands';
import { RoundHeader } from './RoundHeader';
import { RoundActions } from './RoundActions';
import { CategoryGrid } from './CategoryGrid';
import { getImportantCards } from '@/utils/categoryUtils';
import { useRoundState } from './hooks/useRoundState';
import { useRoundHandlers } from './hooks/useRoundHandlers';
import { useRoundValidation } from './hooks/useRoundValidation';
import { useRoundStatus } from './hooks/useRoundStatus';
import { getRandomValues } from '@/utils';
import { Categories, CategoryName, Value, ValueWithReason } from '@/types';
import { StatusMessage } from '@/components/Round/components/StatusMessage';
import { getCategoriesForRound } from '@/utils/categoryUtils';
import { MobileCategoryList } from './components/MobileCategoryList';
import { CoreValueReasoning } from '../CoreValueReasoning';
import { logRender, logStateUpdate, logEffect } from '@/utils/debug/renderLogger';
import { useMobile } from '@/contexts/MobileContext';
import { Card } from '@/components/Card';
import { motion } from 'framer-motion';

const RoundUI = memo(function RoundUI() {
  logRender('RoundUI');

  // State
  const [activeDropZone, setActiveDropZone] = useState<CategoryName | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [shouldEndGame, setShouldEndGame] = useState<boolean>(false);
  const [showReasoning, setShowReasoning] = useState<boolean>(false);
  const [finalValuesWithoutReasons, setFinalValuesWithoutReasons] = useState<Value[]>([]);
  const [selectedMobileCard, setSelectedMobileCard] = useState<Value | null>(null);

  // Hooks
  const { sessionId, roundNumber, targetCoreValues, setRoundNumber } = useSession();
  const { remainingCards, categories, setCategories, setRemainingCards } = useGameState();
  const { currentRoundCommands, addCommand, clearCommands } = useCommands();
  const { isMobile } = useMobile();

  // Memoized calculations
  const activeCards = useMemo(() => {
    logEffect('Calculate activeCards', [categories]);
    return Object.entries(categories)
      .filter(([category]) => category !== 'Not Important')
      .reduce((sum, [_, cards]) => sum + (cards?.length || 0), 0);
  }, [categories]);

  const roundState = useRoundState(categories, remainingCards, targetCoreValues);

  const validateRound = useRoundValidation({
    remainingCards,
    targetCoreValues,
    hasMinimumNotImportant: roundState.hasMinimumNotImportant,
    hasEnoughCards: roundState.hasEnoughCards,
    isNearingCompletion: roundState.isNearingCompletion,
    veryImportantCount: roundState.veryImportantCount,
    totalActiveCards: roundState.totalActiveCards,
    categories
  });

  const status = useRoundStatus({
    remainingCards,
    targetCoreValues,
    hasMinimumNotImportant: roundState.hasMinimumNotImportant,
    hasEnoughCards: roundState.hasEnoughCards,
    isNearingCompletion: roundState.isNearingCompletion,
    veryImportantCount: roundState.veryImportantCount,
    totalActiveCards: roundState.totalActiveCards,
    categories
  });

  // Handlers
  const {
    handleMoveCard,
    handleDrop,
    handleMoveBetweenCategories
  } = useRoundHandlers(
    categories,
    setCategories,
    remainingCards,
    setRemainingCards,
    roundState.validCategories,
    roundState.activeCategories,
    sessionId,
    roundNumber,
    currentRoundCommands,
    addCommand,
    clearCommands,
    targetCoreValues,
    setRoundNumber,
    setShowResults
  );

  const handleMobileDropWithZone = useCallback((card: Value, category: CategoryName) => {
    logStateUpdate('handleMobileDropWithZone', { card, category }, 'RoundUI');
    setActiveDropZone(category);
    handleDrop(card, category);
    setSelectedMobileCard(null);
    setTimeout(() => setActiveDropZone(null), 500);
  }, [handleDrop]);

  const handleNextRound = useCallback(async () => {
    try {
      logStateUpdate('handleNextRound', { roundNumber }, 'RoundUI');
      if (!validateRound()) {
        console.error('Cannot proceed: round validation failed');
        return;
      }

      if (sessionId) {
        await saveRound(sessionId, roundNumber, currentRoundCommands, categories);
      }

      const hasExactTargetInVeryImportant = categories['Very Important']?.length === targetCoreValues;

      if (shouldEndGame) {
        if (sessionId) {
          const finalValues = hasExactTargetInVeryImportant
            ? categories['Very Important'] || []
            : Object.entries(categories)
              .filter(([category]) => category !== 'Not Important')
              .flatMap(([_, cards]) => (cards || []).filter((card): card is Value => card !== undefined));

          setFinalValuesWithoutReasons(finalValues);
          setShowReasoning(true);
          return;
        }
      }

      clearCommands();
      const nextRound = roundNumber + 1;
      const cardsForNextRound = getImportantCards(categories);

      if (cardsForNextRound.length < targetCoreValues) {
        console.error('Not enough cards to proceed');
        return;
      }

      const nextCategories = getCategoriesForRound(cardsForNextRound.length, targetCoreValues);
      if (sessionId) {
        await saveRound(sessionId, nextRound, [], nextCategories);
      }
      setRoundNumber(nextRound);
      setCategories(nextCategories);
      setRemainingCards(getRandomValues(cardsForNextRound));
    } catch (error) {
      console.error('Failed to handle next round:', error);
    }
  }, [
    validateRound,
    sessionId,
    roundNumber,
    currentRoundCommands,
    categories,
    shouldEndGame,
    targetCoreValues,
    clearCommands,
    setRoundNumber,
    setCategories,
    setRemainingCards
  ]);

  const handleReasoningComplete = useCallback(async (valuesWithReasons: ValueWithReason[]) => {
    logStateUpdate('handleReasoningComplete', { valuesWithReasons }, 'RoundUI');
    if (sessionId) {
      const session = {
        timestamp: Date.now(),
        targetCoreValues,
        currentRound: roundNumber,
        completed: true
      };
      await updateSession(sessionId, session);
      await saveCompletedSession(sessionId, valuesWithReasons);
    }

    const finalCategories = Object.entries(categories)
      .filter(([category]) => category !== 'Not Important')
      .reduce((acc, [category, cards]) => {
        acc[category] = cards;
        return acc;
      }, {} as Categories);

    setCategories(finalCategories);
    setShowReasoning(false);
    setShowResults(true);
  }, [sessionId, targetCoreValues, roundNumber, categories, setCategories]);

  // Effects
  useEffect(() => {
    const hasExactTargetInVeryImportant = categories['Very Important']?.length === targetCoreValues;
    setShouldEndGame(hasExactTargetInVeryImportant || activeCards === targetCoreValues);
  }, [activeCards, targetCoreValues, categories]);

  // Conditional rendering
  if (showReasoning) {
    return <CoreValueReasoning values={finalValuesWithoutReasons} onComplete={handleReasoningComplete} />;
  }

  if (showResults) {
    return <Results />;
  }

  return (
    <div
      className={`
        flex flex-col h-full overflow-hidden
        ${isMobile && selectedMobileCard ? 'bg-gray-100' : ''}
        transition-colors duration-200
      `}
      role="application"
      aria-label="Core Values Sorting Exercise"
    >
      {/* Game Header - Stays visible but faded when card selected */}
      <div
        className="flex-shrink-0 relative" // Added relative positioning
        role="banner"
      >
        {/* Selection instruction overlay */}
        {isMobile && selectedMobileCard && (
          <div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-10 text-center"
            aria-live="polite"
          >
            <p className="text-sm text-blue-700 font-medium bg-white/90 py-1 px-2 rounded-full inline-block">
              Tap a category to place this card
            </p>
          </div>
        )}

        <div className={`
        transition-opacity duration-200
        ${isMobile && selectedMobileCard ? 'opacity-30' : 'opacity-100'}
      `}>
          <RoundHeader
            targetCoreValues={targetCoreValues}
            roundNumber={roundNumber}
            remainingCardsCount={remainingCards.length}
          />
        </div>
      </div>

      {/* Game Actions - Card remains visible when selected */}
      <div
        className={`
          flex-shrink-0
          ${isMobile && selectedMobileCard ? 'relative z-20' : ''}
        `}
        role="region"
        aria-label="Game controls"
      >
        {isMobile ? (
          <div className="px-2 py-1 mb-4">
            <div className="flex items-center justify-center gap-4"> {/* Changed to horizontal layout with center alignment */}
              <div className="flex-1" /> {/* Spacer */}
              <RoundActions
                remainingCards={remainingCards}
                canProceedToNextRound={validateRound() && roundState.hasMinimumNotImportant}
                onNextRound={handleNextRound}
                onDrop={handleDrop}
                isEndGame={shouldEndGame}
                selectedMobileCard={selectedMobileCard}
                onMobileCardSelect={setSelectedMobileCard}
              />
              <div
                role="status"
                aria-live="polite"
                className={`
          transition-opacity duration-200 flex-1 flex justify-end
          ${selectedMobileCard ? 'opacity-30' : 'opacity-100'}
        `}
              >
                <StatusMessage
                  status={status()}
                  isNearingCompletion={roundState.isNearingCompletion}
                  hasTooManyImportantCards={roundState.hasTooManyImportantCards}
                  hasNotEnoughImportantCards={roundState.hasNotEnoughImportantCards}
                  hasEnoughCards={roundState.hasEnoughCards}
                  targetCoreValues={targetCoreValues}
                  canProceedToNextRound={validateRound()}
                  remainingCards={remainingCards}
                  showInitialMessage={true}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto">
            <div
              className="grid grid-cols-3 gap-2 sm:gap-4 p-2 sm:p-4"
              role="region"
              aria-label="Game controls and status"
            >
              <div /> {/* Empty first column */}
              <div> {/* Middle column */}
                <RoundActions
                  remainingCards={remainingCards}
                  canProceedToNextRound={validateRound() && roundState.hasMinimumNotImportant}
                  onNextRound={handleNextRound}
                  onDrop={handleDrop}
                  isEndGame={shouldEndGame}
                />
              </div>
              <div> {/* Third column */}
                <StatusMessage
                  status={status()}
                  isNearingCompletion={roundState.isNearingCompletion}
                  hasTooManyImportantCards={roundState.hasTooManyImportantCards}
                  hasNotEnoughImportantCards={roundState.hasNotEnoughImportantCards}
                  hasEnoughCards={roundState.hasEnoughCards}
                  targetCoreValues={targetCoreValues}
                  canProceedToNextRound={validateRound()}
                  remainingCards={remainingCards}
                  showInitialMessage={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Game Content */}
      <div
        className="flex-1 overflow-auto"
        role="region"
        aria-label="Value categories"
      >
        {isMobile ? (
          <div className="h-full flex flex-col pb-16 pt-4"> {/* Added pt-2 for top padding */}
            <MobileCategoryList
              categories={roundState.visibleCategories}
              activeDropZone={activeDropZone}
              onDrop={handleMobileDropWithZone}
              onMoveWithinCategory={handleMoveCard}
              onMoveBetweenCategories={handleMoveBetweenCategories}
              selectedCard={selectedMobileCard}
              onCardSelect={setSelectedMobileCard}
            />
          </div>
        ) : (
          <div className="w-full">
            <CategoryGrid
              categories={roundState.visibleCategories}
              onDrop={handleDrop}
              onMoveWithinCategory={handleMoveCard}
              onMoveBetweenCategories={handleMoveBetweenCategories}
            />
          </div>
        )}
      </div>
    </div>
  );
});

export default RoundUI;