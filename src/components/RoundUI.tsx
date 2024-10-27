'use client'

import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import Card from './Card';
import CategoryColumn from './CategoryColumn';
import { DropCommand } from '../commands/DropCommand';
import { MoveCommand } from '../commands/MoveCommand';
import { saveRound } from '../db/indexedDB';
import Results from './Results';
import { CategoryName } from "@/types/CategoryName";
import { Categories } from "@/types/Categories";
import { Value } from "@/types/Value";
import { getRandomValues } from '@/utils/valuesUtils';
import { getEnvNumber } from '@/utils/envUtils';

const RoundUI: React.FC = () => {
  const maxCards = getEnvNumber('maxCards', 35);
  const {
    currentRound,
    remainingCards,
    categories,
    sessionId,
    targetCoreValues,
    setCategories,
    setCurrentRound,
    setRemainingCards
  } = useGameStore();

  const [showResults, setShowResults] = useState<boolean>(false);

  const canProceedToNextRound = remainingCards.length === 0 && categories['Not Important'].length > 0;

  const handleDrop = async (value: Value, category: CategoryName): Promise<void> => {
    const command = new DropCommand(value.title, category);
    const card = remainingCards.find((c: Value) => c.title === value.title);
    if (!card) return;

    const updatedCategories: Categories = { ...categories };
    updatedCategories[category] = [...updatedCategories[category], card];
    setCategories(updatedCategories);
    setRemainingCards(remainingCards.filter((c: Value) => c.title !== value.title));

    await saveRound(sessionId, currentRound, [command]);
  };

  const handleMoveCard = async (
    category: CategoryName,
    fromIndex: number,
    toIndex: number
  ): Promise<void> => {
    const command = new MoveCommand(
      categories[category][fromIndex].title,
      category,
      category
    );

    const updatedCategories: Categories = { ...categories };
    const categoryCards = [...updatedCategories[category]];
    const [movedCard] = categoryCards.splice(fromIndex, 1);
    categoryCards.splice(toIndex, 0, movedCard);
    updatedCategories[category] = categoryCards;
    setCategories(updatedCategories);

    await saveRound(sessionId, currentRound, [command]);
  };

  const handleMoveBetweenCategories = async (
    value: Value,
    fromCategory: CategoryName,
    toCategory: CategoryName
  ): Promise<void> => {
    const command = new MoveCommand(value.title, fromCategory, toCategory);

    const updatedCategories: Categories = { ...categories };
    // Remove from old category
    updatedCategories[fromCategory] = updatedCategories[fromCategory].filter(
      card => card.title !== value.title
    );
    // Add to new category
    updatedCategories[toCategory] = [...updatedCategories[toCategory], value];

    setCategories(updatedCategories);
    await saveRound(sessionId, currentRound, [command]);
  };

  const handleNextRound = (): void => {
    const importantCards: Value[] = [
      ...categories['Very Important'],
      ...categories['Quite Important'],
      ...categories['Important'],
      ...categories['Of Some Importance']
    ];

    if (importantCards.length <= targetCoreValues) {
      setShowResults(true);
    } else {
      setCurrentRound(currentRound + 1);
      setRemainingCards(getRandomValues(importantCards));
      setCategories({
        'Very Important': [],
        'Quite Important': [],
        'Important': [],
        'Of Some Importance': [],
        'Not Important': []
      });
    }
  };

  if (showResults) {
    return <Results />;
  }

  const getRoundStatus = () => {
    if (remainingCards.length > 0) {
      return `Remaining cards ${remainingCards.length}`;
    }
    if (!canProceedToNextRound) {
      return "Move at least one value to 'Not Important' to continue";
    }
    return "All cards sorted! Click 'Next Round' to continue.";
  };

  return (
    <div className="p-4">
      {/* Header section split into thirds */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Target Values</h2>
          <p className="text-3xl font-bold text-gray-900">{targetCoreValues}</p>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Round</h2>
          <p className="text-3xl font-bold text-gray-900">{currentRound}</p>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Remaining Cards</h2>
          <p className="text-3xl font-bold text-gray-900">{remainingCards.length}</p>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-8">
        {/* Fixed height container for card/button/message */}
        <div className="h-[280px] flex flex-col items-center justify-center">
          {remainingCards.length > 0 ? (
            <div className="flex flex-col items-center">
              <p className="text-gray-600 mb-4">Drag this value to a category:</p>
              <div className="transform hover:scale-105 transition-transform">
                <Card
                  value={remainingCards[0]}
                  columnIndex={undefined}
                  onDrop={() => { }}
                  currentCategory={undefined}
                />
              </div>
            </div>
          ) : canProceedToNextRound ? (
            <div className="text-center">
              <button
                onClick={handleNextRound}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Next Round
              </button>
            </div>
          ) : (
            <div className="text-center text-red-600">
              Move at least one value to "Not Important" before continuing
            </div>
          )}
        </div>

        {/* Fixed height container for status message */}
        <div className="h-[40px] flex items-center justify-center text-gray-600">
          {getRoundStatus()}
        </div>

        {/* Categories grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-4">
          {(Object.entries(categories) as [CategoryName, Value[]][]).map(([title, cards]) => (
            <CategoryColumn
              key={title}
              title={title}
              cards={cards}
              onDrop={handleDrop}
              onMoveWithinCategory={(fromIndex, toIndex) => handleMoveCard(title, fromIndex, toIndex)}
              onMoveBetweenCategories={handleMoveBetweenCategories}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoundUI;
