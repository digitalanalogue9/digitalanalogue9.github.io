'use client'

import { useState } from 'react';
import useGameStore from '../store/useGameStore';
import Card from './Card';
import CategoryColumn from './CategoryColumn';
import { DropCommand } from '../commands/DropCommand';
import { MoveCommand } from '../commands/MoveCommand';
import { saveRound } from '../db/indexedDB';
import Results from './Results';
import { CategoryName } from "@/types/CategoryName";
import { Categories } from "@/types/Categories";
import { Value } from "@/types/Value";

const RoundUI: React.FC = () => {
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
      setRemainingCards(importantCards);
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Round {currentRound}</h1>
      <div className="flex flex-col space-y-4">
        {remainingCards.length > 0 ? (
          <div className="mb-4">
            <Card value={remainingCards[0]} />
          </div>
        ) : (
          <div className="mb-4 text-center">
            <button
              onClick={handleNextRound}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Next Round
            </button>
          </div>
        )}
        
        <div className="mt-4 text-center text-sm text-gray-600">
          {remainingCards.length > 0 ? (
            <p>Cards remaining: {remainingCards.length}</p>
          ) : (
            <p>All cards sorted! Click "Next Round" to continue.</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {(Object.entries(categories) as [CategoryName, Value[]][]).map(([title, cards]) => (
            <CategoryColumn
              key={title}
              title={title}
              cards={cards}
              onDrop={handleDrop}
              onMoveCard={handleMoveCard}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default RoundUI;
