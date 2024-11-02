'use client'

import { useState, useCallback } from 'react';
import { DropCommand } from '@/commands/DropCommand';
import { MoveCommand } from '@/commands/MoveCommand';
import { saveRound } from '@/db/indexedDB';
import Results from '../Results';
import { CategoryName, Categories, Value, Command } from '@/types';
import { getRandomValues } from '@/utils';
import { getEnvNumber } from '@/utils/config/envUtils';
import { useSession } from '@/hooks/useSession';
import { useGameState } from '@/hooks/useGameState';
import { useCommands } from '@/hooks/useCommands';
import { RoundHeader } from './RoundHeader';
import { RoundActions } from './RoundActions';
import { CategoryGrid } from './CategoryGrid';
import { getCategoriesForRound, getImportantCards, getCategoryNames } from '@/utils/categoryUtils';

export default function RoundUI() {
  const maxCards = getEnvNumber('maxCards', 35);
  const [showResults, setShowResults] = useState<boolean>(false);

  const { sessionId, roundNumber, targetCoreValues, setRoundNumber } = useSession();
  const { remainingCards, categories, setCategories, setRemainingCards } = useGameState();
  const { currentRoundCommands, addCommand, clearCommands } = useCommands();

  // Get valid categories for current round
  const validCategories = getCategoryNames(roundNumber);

  // Calculate active cards (excluding Not Important)
  const activeCards = Object.entries(categories)
    .filter(([category]) => 
      category !== 'Not Important' && validCategories.includes(category as CategoryName)
    )
    .reduce((sum, [_, cards]) => sum + (cards?.length || 0), 0);

  // Calculate remaining active cards including those yet to be sorted
  const totalActiveCards = activeCards + remainingCards.length;

  // Round specific calculations
  const veryImportantCount = categories['Very Important']?.length || 0;
  const isLastRound = roundNumber >= 3;
  const hasEnoughCards = totalActiveCards >= targetCoreValues;
  const hasTooManyImportantCards = isLastRound && veryImportantCount > targetCoreValues;
  const hasNotEnoughImportantCards = isLastRound && veryImportantCount < targetCoreValues;
  const isEndGameReady = isLastRound &&
    veryImportantCount === targetCoreValues &&
    totalActiveCards === targetCoreValues;

  const validateRound = useCallback(() => {
    // Can't proceed if cards still need to be sorted
    if (remainingCards.length > 0) {
      return false;
    }

    // Must have enough active cards to continue
    if (!hasEnoughCards) {
      return false;
    }

    // In the last round, must have exact number of cards in Very Important
    if (isLastRound && veryImportantCount !== targetCoreValues) {
      return false;
    }

    // In the last round, total active cards must equal target
    if (isLastRound && totalActiveCards !== targetCoreValues) {
      return false;
    }

    return true;
  }, [remainingCards.length, hasEnoughCards, isLastRound, veryImportantCount, targetCoreValues, totalActiveCards]);

  const canProceedToNextRound = validateRound();

  const getStatusMessage = useCallback(() => {
    if (remainingCards.length > 0) {
      return {
        text: `Drag the remaining ${remainingCards.length} ${remainingCards.length === 1 ? "value" : "values"} to a category`,
        type: 'info' as const
      };
    }

    if (!hasEnoughCards) {
      return {
        text: `You need at least ${targetCoreValues} values outside of Not Important to continue`,
        type: 'warning' as const
      };
    }

    if (isLastRound) {
      if (hasTooManyImportantCards) {
        return {
          text: `Move ${veryImportantCount - targetCoreValues} values from Very Important to other categories`,
          type: 'warning' as const
        };
      }

      if (hasNotEnoughImportantCards) {
        return {
          text: `Move ${targetCoreValues - veryImportantCount} more values to Very Important`,
          type: 'warning' as const
        };
      }

      if (totalActiveCards > targetCoreValues) {
        return {
          text: `Move ${totalActiveCards - targetCoreValues} more values to Not Important`,
          type: 'warning' as const
        };
      }

      if (isEndGameReady) {
        return {
          text: 'Perfect! You can now complete the exercise.',
          type: 'success' as const
        };
      }
    }

    return {
      text: 'Start the next round to continue sorting your values',
      type: 'info' as const
    };
  }, [
    remainingCards.length,
    hasEnoughCards,
    targetCoreValues,
    isLastRound,
    hasTooManyImportantCards,
    hasNotEnoughImportantCards,
    veryImportantCount,
    totalActiveCards,
    isEndGameReady
  ]);

  const saveRoundData = useCallback(async (command: Command) => {
    if (!sessionId) return;

    try {
      await saveRound(sessionId, roundNumber, [...currentRoundCommands, command]);
    } catch (error) {
      console.error('Failed to save round data:', error);
    }
  }, [sessionId, roundNumber, currentRoundCommands]);

// Modify the categories access to handle optional properties
const handleMoveCard = useCallback(async (
  category: CategoryName,
  fromIndex: number,
  toIndex: number
): Promise<void> => {
  if (!validCategories.includes(category)) return;

  const categoryCards = categories[category] || [];
  if (!categoryCards[fromIndex]) return;

  const command = new MoveCommand(categoryCards[fromIndex], category, category);
  const updatedCategories = { ...categories };
  const cards = [...categoryCards];
  const [movedCard] = cards.splice(fromIndex, 1);
  cards.splice(toIndex, 0, movedCard);
  updatedCategories[category] = cards;

  setCategories(updatedCategories);
  await addCommand(command);
  await saveRoundData(command);
}, [categories, validCategories, setCategories, addCommand, saveRoundData]);

const handleDrop = useCallback(async (value: Value, category: CategoryName): Promise<void> => {
  if (!validCategories.includes(category)) return;

  const card = remainingCards.find((c: Value) => c.title === value.title);
  if (!card) return;

  const command = new DropCommand(value, category);
  const updatedCategories = { ...categories };
  updatedCategories[category] = [...(categories[category] || []), card];

  setCategories(updatedCategories);
  setRemainingCards(remainingCards.filter((c: Value) => c.title !== value.title));

  await addCommand(command);
  await saveRoundData(command);
}, [remainingCards, categories, validCategories, setCategories, setRemainingCards, addCommand, saveRoundData]);

const handleMoveBetweenCategories = useCallback(async (
  value: Value,
  fromCategory: CategoryName,
  toCategory: CategoryName
): Promise<void> => {
  if (!validCategories.includes(fromCategory) || !validCategories.includes(toCategory)) {
    return;
  }

  const command = new MoveCommand(value, fromCategory, toCategory);
  const updatedCategories = { ...categories };

  const fromCards = categories[fromCategory] || [];
  const toCards = categories[toCategory] || [];

  updatedCategories[fromCategory] = fromCards.filter(card => card.title !== value.title);
  updatedCategories[toCategory] = [...toCards, value];

  setCategories(updatedCategories);
  await addCommand(command);
  await saveRoundData(command);
}, [categories, validCategories, setCategories, addCommand, saveRoundData]);

  const handleNextRound = useCallback(async (): Promise<void> => {
    try {
      if (!validateRound()) {
        console.error('Cannot proceed: round validation failed');
        return;
      }

      if (sessionId) {
        await saveRound(sessionId, roundNumber, currentRoundCommands);
      }
      clearCommands();

      if (isEndGameReady) {
        setShowResults(true);
        return;
      }

      const nextRound = roundNumber + 1;

      // Get all cards except those in Not Important
      const cardsForNextRound = Object.entries(categories)
        .filter(([category]) => 
          category !== 'Not Important' && validCategories.includes(category as CategoryName)
        )
        .flatMap(([_, cards]) => cards || []);

      if (cardsForNextRound.length < targetCoreValues) {
        console.error('Not enough cards to proceed');
        return;
      }

      const nextCategories = getCategoriesForRound(nextRound);

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
    clearCommands,
    isEndGameReady,
    setShowResults,
    categories,
    validCategories,
    targetCoreValues,
    setRoundNumber,
    setCategories,
    setRemainingCards
  ]);

  if (showResults) {
    return <Results />;
  }

  const status = getStatusMessage();

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
      <RoundHeader
        targetCoreValues={targetCoreValues}
        roundNumber={roundNumber}
        remainingCardsCount={remainingCards.length}
      />

      <div className="flex flex-col items-center space-y-4 sm:space-y-8">
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 items-center gap-2 sm:gap-4">
          <div className="hidden sm:block"></div>

          <div className="flex justify-center">
            <RoundActions
              remainingCards={remainingCards}
              canProceedToNextRound={canProceedToNextRound}
              onNextRound={handleNextRound}
              onDrop={handleDrop}
            />
          </div>

          <div className={`
            p-4 sm:p-6
            min-h-[5rem] sm:h-28
            flex flex-col justify-center 
            rounded-lg 
            ${!canProceedToNextRound && remainingCards.length === 0
              ? 'bg-red-50 text-red-800'
              : status.type === 'warning'
                ? 'bg-yellow-100 text-yellow-800'
                : status.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
            }
          `}>
            <p className="text-base sm:text-lg font-medium">{status.text}</p>
            {isLastRound && (hasTooManyImportantCards || hasNotEnoughImportantCards) && (
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm">
                You need exactly {targetCoreValues} values in Very Important
              </p>
            )}
            {!hasEnoughCards && (
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm">
                You must keep at least {targetCoreValues} values outside of Not Important
              </p>
            )}
          </div>
        </div>

        <CategoryGrid
          categories={categories}
          onDrop={handleDrop}
          onMoveCard={handleMoveCard}
          onMoveBetweenCategories={handleMoveBetweenCategories}
        />
      </div>
    </div>
  );
}
