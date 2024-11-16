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

const RoundUI = memo(function RoundUI() {
  logRender('RoundUI');

  // State
  const [expandedCategory, setExpandedCategory] = useState<CategoryName | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<CategoryName | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [shouldEndGame, setShouldEndGame] = useState<boolean>(false);
  const [showReasoning, setShowReasoning] = useState<boolean>(false);
  const [finalValuesWithoutReasons, setFinalValuesWithoutReasons] = useState<Value[]>([]);

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
    setTimeout(() => setActiveDropZone(null), 500); // Clear after animation
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
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white">
        <RoundHeader
          targetCoreValues={targetCoreValues}
          roundNumber={roundNumber}
          remainingCardsCount={remainingCards.length}
        />
      </header>
      <main className="flex-1 flex flex-col pt-4">
        {isMobile ? (
          <div className="flex flex-col px-2 space-y-4">
            <div className="flex flex-col space-y-2">
              <RoundActions
                remainingCards={remainingCards}
                canProceedToNextRound={validateRound() && roundState.hasMinimumNotImportant}
                onNextRound={handleNextRound}
                onDrop={handleDrop}
                isEndGame={shouldEndGame}
              />
              <StatusMessage
                status={status()}
                isNearingCompletion={roundState.isNearingCompletion}
                hasTooManyImportantCards={roundState.hasTooManyImportantCards}
                hasNotEnoughImportantCards={roundState.hasNotEnoughImportantCards}
                hasEnoughCards={roundState.hasEnoughCards}
                targetCoreValues={targetCoreValues}
                canProceedToNextRound={validateRound()}
                remainingCards={remainingCards}
              />
            </div>
            <div className="relative z-20">
              <MobileCategoryList
                categories={categories}
                unassignedCards={remainingCards}
                activeDropZone={activeDropZone}
                onDrop={handleMobileDropWithZone}
                onMoveWithinCategory={handleMoveCard}
                onMoveBetweenCategories={handleMoveBetweenCategories}
              />
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 space-y-6">
            <div className="grid grid-cols-3 gap-8">
              <div />
              <RoundActions
                remainingCards={remainingCards}
                canProceedToNextRound={validateRound() && roundState.hasMinimumNotImportant}
                onNextRound={handleNextRound}
                onDrop={handleDrop}
                isEndGame={shouldEndGame}
              />
              <StatusMessage
                status={status()}
                isNearingCompletion={roundState.isNearingCompletion}
                hasTooManyImportantCards={roundState.hasTooManyImportantCards}
                hasNotEnoughImportantCards={roundState.hasNotEnoughImportantCards}
                hasEnoughCards={roundState.hasEnoughCards}
                targetCoreValues={targetCoreValues}
                canProceedToNextRound={validateRound()}
                remainingCards={remainingCards}
              />
            </div>
            <CategoryGrid
              categories={roundState.visibleCategories}
              onDrop={handleDrop}
              onMoveWithinCategory={handleMoveCard}
              onMoveBetweenCategories={handleMoveBetweenCategories}
            />
          </div>
        )}
      </main>
    </div>
  );
});

export default RoundUI;
