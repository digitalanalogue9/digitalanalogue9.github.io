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
import { getCategoriesForRound, getImportantCards } from '@/utils/categoryUtils';

export default function RoundUI() {
  const maxCards = getEnvNumber('maxCards', 35);
  const [showResults, setShowResults] = useState<boolean>(false);

  const { sessionId, roundNumber, targetCoreValues, setRoundNumber } = useSession();
  const { remainingCards, categories, setCategories, setRemainingCards } = useGameState();
  const { currentRoundCommands, addCommand, clearCommands } = useCommands();

  const canProceedToNextRound = remainingCards.length === 0;

  const importantCards = getImportantCards(categories);
  const hasNotImportantCards = (categories['Not Important']?.length || 0) > 0;
  const hasTooManyImportantCards = importantCards.length > targetCoreValues;
  const isEndGameReady = importantCards.length <= targetCoreValues && !hasNotImportantCards;

  const getStatusMessage = useCallback(() => {
    if (remainingCards.length > 0) {
      return {
        text: `Sort the remaining ${remainingCards.length} cards`,
        type: 'info' as const
      };
    }

    if (hasNotImportantCards) {
      return {
        text: 'You need to reconsider values in "Not Important" before completing',
        type: 'warning' as const
      };
    }

    if (hasTooManyImportantCards) {
      return {
        text: `You have ${importantCards.length - targetCoreValues} too many important values`,
        type: 'warning' as const
      };
    }

    if (isEndGameReady) {
      return {
        text: 'You can now complete the exercise!',
        type: 'success' as const
      };
    }

    return {
      text: 'Continue sorting your values',
      type: 'info' as const
    };
  }, [remainingCards.length, hasNotImportantCards, hasTooManyImportantCards, isEndGameReady, importantCards.length, targetCoreValues]);

  const saveRoundData = useCallback(async (command: Command) => {
    if (!sessionId) return;

    const roundData = {
      sessionId,
      roundNumber,
      commands: [...currentRoundCommands, command],
      timestamp: Date.now()
    };

    try {
      await saveRound(
        sessionId,
        roundNumber,
        roundData.commands
      );
    } catch (error) {
      console.error('Failed to save round data:', error);
    }
  }, [sessionId, roundNumber, currentRoundCommands]);

  const handleDrop = useCallback(async (value: Value, category: CategoryName): Promise<void> => {
    const command = new DropCommand(value, category);
    const card = remainingCards.find((c: Value) => c.title === value.title);
    if (!card) return;

    const updatedCategories: Categories = { ...categories };
    updatedCategories[category] = [...(updatedCategories[category] || []), card];
    setCategories(updatedCategories);
    setRemainingCards(remainingCards.filter((c: Value) => c.title !== value.title));

    await addCommand(command);
    await saveRoundData(command);
  }, [remainingCards, categories, setCategories, setRemainingCards, addCommand, saveRoundData]);

  const handleMoveCard = useCallback(async (
    category: CategoryName,
    fromIndex: number,
    toIndex: number
  ): Promise<void> => {
    const categoryCards = categories[category];
    if (!categoryCards?.[fromIndex]) return;

    const command = new MoveCommand(
      categoryCards[fromIndex],
      category,
      category
    );

    const updatedCategories: Categories = { ...categories };
    const cards = [...categoryCards];
    const [movedCard] = cards.splice(fromIndex, 1);
    cards.splice(toIndex, 0, movedCard);
    updatedCategories[category] = cards;
    setCategories(updatedCategories);

    await addCommand(command);
    await saveRoundData(command);
  }, [categories, setCategories, addCommand, saveRoundData]);

  const handleMoveBetweenCategories = useCallback(async (
    value: Value,
    fromCategory: CategoryName,
    toCategory: CategoryName
  ): Promise<void> => {
    const command = new MoveCommand(value, fromCategory, toCategory);

    const updatedCategories: Categories = { ...categories };
    updatedCategories[fromCategory] = (updatedCategories[fromCategory] || [])
      .filter(card => card.title !== value.title);
    updatedCategories[toCategory] = [...(updatedCategories[toCategory] || []), value];
    setCategories(updatedCategories);

    await addCommand(command);
    await saveRoundData(command);
  }, [categories, setCategories, addCommand, saveRoundData]);

  const handleNextRound = useCallback(async (): Promise<void> => {
    try {
      if (sessionId) {
        await saveRound(
          sessionId,
          roundNumber,
          currentRoundCommands
        );
      }
      clearCommands();

      if (isEndGameReady) {
        setShowResults(true);
      } else {
        const nextRound = roundNumber + 1;
        setRoundNumber(nextRound);
        setCategories(getCategoriesForRound(nextRound));
        setRemainingCards(getRandomValues(importantCards));
      }
    } catch (error) {
      console.error('Failed to handle next round:', error);
    }
  }, [
    sessionId,
    roundNumber,
    currentRoundCommands,
    clearCommands,
    isEndGameReady,
    setRoundNumber,
    setCategories,
    setRemainingCards,
    importantCards
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

          <div className={`p-2 sm:p-4 min-h-[4rem] sm:h-24 flex flex-col justify-center rounded-lg ${status.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              status.type === 'success' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
            }`}>
            <p className="text-base sm:text-lg font-medium">{status.text}</p>
            {hasNotImportantCards && (
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm">
                Move important values from "Not Important" to other categories
              </p>
            )}
            {hasTooManyImportantCards && (
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm">
                You need to reduce your important values by {importantCards.length - targetCoreValues}
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
