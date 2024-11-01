'use client'

import { useState } from 'react';
import { DropCommand } from '@/commands/DropCommand';
import { MoveCommand } from '@/commands/MoveCommand';
import { saveRound } from '@/db/indexedDB';
import Results from '../Results';
import { CategoryName, Categories, Value } from '@/types';
import { getRandomValues } from '@/utils';
import { getEnvNumber } from '@/utils';
import { useSession } from '@/hooks/useSession';
import { useGameState } from '@/hooks/useGameState';
import { useCommands } from '@/hooks/useCommands';
import { RoundHeader } from './RoundHeader';
import { RoundActions } from './RoundActions';
import { CategoryGrid } from './CategoryGrid';
import { allCategories } from '@/constants/categories';

export default function RoundUI() {
  const maxCards = getEnvNumber('maxCards', 35);
  const [showResults, setShowResults] = useState<boolean>(false);

  const { sessionId, roundNumber, targetCoreValues, setRoundNumber } = useSession();
  const { remainingCards, categories, setCategories, setRemainingCards } = useGameState();
  const { currentRoundCommands, addCommand, clearCommands } = useCommands();

  const canProceedToNextRound = remainingCards.length === 0 && categories['Not Important'].length > 0;

  const handleDrop = async (value: Value, category: CategoryName): Promise<void> => {
    const command = new DropCommand(value, category);
    const card = remainingCards.find((c: Value) => c.title === value.title);
    if (!card) return;

    const updatedCategories: Categories = { ...categories };
    updatedCategories[category] = [...updatedCategories[category], card];
    setCategories(updatedCategories);
    setRemainingCards(remainingCards.filter((c: Value) => c.title !== value.title));

    addCommand(command);
  };

  const handleMoveCard = async (
    category: CategoryName,
    fromIndex: number,
    toIndex: number
  ): Promise<void> => {
    const command = new MoveCommand(
      categories[category][fromIndex],
      category,
      category
    );

    const updatedCategories: Categories = { ...categories };
    const categoryCards = [...updatedCategories[category]];
    const [movedCard] = categoryCards.splice(fromIndex, 1);
    categoryCards.splice(toIndex, 0, movedCard);
    updatedCategories[category] = categoryCards;
    setCategories(updatedCategories);

    addCommand(command);
  };

  const handleMoveBetweenCategories = async (
    value: Value,
    fromCategory: CategoryName,
    toCategory: CategoryName
  ): Promise<void> => {
    const command = new MoveCommand(value, fromCategory, toCategory);

    const updatedCategories: Categories = { ...categories };
    updatedCategories[fromCategory] = updatedCategories[fromCategory].filter(
      card => card.title !== value.title
    );
    updatedCategories[toCategory] = [...updatedCategories[toCategory], value];

    setCategories(updatedCategories);
    addCommand(command);
  };

  const handleNextRound = async (): Promise<void> => {
    if (sessionId) {
      await saveRound(
        sessionId,
        roundNumber,
        currentRoundCommands
      );
    }
    clearCommands();
    
    const importantCards: Value[] = [
      ...categories['Very Important'],
      ...categories['Quite Important'],
      ...categories['Important'],
      ...categories['Of Some Importance']
    ];
  
    if (importantCards.length <= targetCoreValues) {
      setShowResults(true);
    } else {
      setRoundNumber(roundNumber + 1);
      setRemainingCards(getRandomValues(importantCards));
      setCategories(allCategories);
    }
  };

  if (showResults) {
    return <Results />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RoundHeader
        targetCoreValues={targetCoreValues}
        roundNumber={roundNumber}
        remainingCardsCount={remainingCards.length}
      />

      <div className="flex flex-col items-center space-y-8">
        <RoundActions
          remainingCards={remainingCards}
          canProceedToNextRound={canProceedToNextRound}
          onNextRound={handleNextRound}
          onDrop={handleDrop}
        />

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
