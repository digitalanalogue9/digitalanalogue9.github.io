'use client'

import { useState, useEffect } from 'react';
import { saveRound, updateSession } from '@/db/indexedDB';
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
import { Categories, CategoryName } from '@/types';
import { StatusMessage } from '@/components/Round/components/StatusMessage';
import { getCategoriesForRound } from '@/utils/categoryUtils';
import { MobileCategoryList } from './components/MobileCategoryList';

export default function RoundUI() {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<CategoryName | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<CategoryName | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [shouldEndGame, setShouldEndGame] = useState<boolean>(false);

  const { sessionId, roundNumber, targetCoreValues, setRoundNumber } = useSession();
  const { remainingCards, categories, setCategories, setRemainingCards } = useGameState();
  console.log('remainingCards:', remainingCards);
  const { currentRoundCommands, addCommand, clearCommands } = useCommands();

  // Calculate active cards (not in Not Important)
  const activeCards = Object.entries(categories)
    .filter(([category]) => category !== 'Not Important')
    .reduce((sum, [_, cards]) => sum + (cards?.length || 0), 0);

  // Get round state calculations
  const roundState = useRoundState(categories, remainingCards, targetCoreValues);

  // Update shouldEndGame when activeCards equals targetCoreValues
  useEffect(() => {
    setShouldEndGame(activeCards === targetCoreValues);
  }, [activeCards, targetCoreValues]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get validation function
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

  // Get status message
  const getStatusFn = useRoundStatus({
    remainingCards,
    targetCoreValues,
    hasMinimumNotImportant: roundState.hasMinimumNotImportant,
    hasEnoughCards: roundState.hasEnoughCards,
    isNearingCompletion: roundState.isNearingCompletion,
    veryImportantCount: roundState.veryImportantCount,
    totalActiveCards: roundState.totalActiveCards,
    categories
  });

  const status = getStatusFn();

  // Get handlers
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

  const handleNextRound = async () => {
    try {
      if (!validateRound()) {
        console.error('Cannot proceed: round validation failed');
        return;
      }

      if (sessionId) {
        await saveRound(sessionId, roundNumber, currentRoundCommands);
      }

      // If we're ending the game
      if (shouldEndGame) {
        if (sessionId) {
          // Update session to mark it as completed
          const session = {
            timestamp: Date.now(),
            targetCoreValues,
            currentRound: roundNumber,
            completed: true
          };
          await updateSession(sessionId, session);
        }

        // Filter out Not Important cards before showing results
        const finalCategories = Object.entries(categories)
          .filter(([category]) => category !== 'Not Important')
          .reduce((acc, [category, cards]) => {
            acc[category] = cards;
            return acc;
          }, {} as Categories);

        setCategories(finalCategories);
        setShowResults(true);
        return;
      }

      // Normal next round flow
      clearCommands();
      const nextRound = roundNumber + 1;
      const cardsForNextRound = getImportantCards(categories);

      if (cardsForNextRound.length < targetCoreValues) {
        console.error('Not enough cards to proceed');
        return;
      }

      const ratio = cardsForNextRound.length / targetCoreValues;
      const nextCategories = getCategoriesForRound(cardsForNextRound.length, targetCoreValues);

      setRoundNumber(nextRound);
      setCategories(nextCategories);
      setRemainingCards(getRandomValues(cardsForNextRound));
    } catch (error) {
      console.error('Failed to handle next round:', error);
    }
  };

  if (showResults) {
    return <Results />;
  }
  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4">
      <RoundHeader
        targetCoreValues={targetCoreValues}
        roundNumber={roundNumber}
        remainingCardsCount={remainingCards.length}
      />

      <div className="flex flex-col items-center space-y-4 sm:space-y-8">
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 items-center gap-2 sm:gap-4">
          <div className="hidden sm:block" />

          <div className="flex justify-center">
            <RoundActions
              remainingCards={remainingCards}
              canProceedToNextRound={validateRound() && roundState.hasMinimumNotImportant}
              onNextRound={handleNextRound}
              onDrop={handleDrop}
              isEndGame={shouldEndGame}
            />
          </div>

          <StatusMessage
            status={status}
            isNearingCompletion={roundState.isNearingCompletion}
            hasTooManyImportantCards={roundState.hasTooManyImportantCards}
            hasNotEnoughImportantCards={roundState.hasNotEnoughImportantCards}
            hasEnoughCards={roundState.hasEnoughCards}
            targetCoreValues={targetCoreValues}
            canProceedToNextRound={validateRound()}
            remainingCards={remainingCards}
          />
        </div>
        {isMobile ? (
          <MobileCategoryList
            categories={categories}
            onDrop={(card, category) => {
              setActiveDropZone(category);
              handleDrop(card, category);  // Changed order here
            }}
            onExpand={setExpandedCategory}
            activeDropZone={activeDropZone}
          />
        ) : (
          <CategoryGrid
            categories={roundState.visibleCategories}
            onDrop={handleDrop}
            onMoveCard={handleMoveCard}
            onMoveBetweenCategories={handleMoveBetweenCategories}
          />
        )}
      </div>
    </div>
  );
}
