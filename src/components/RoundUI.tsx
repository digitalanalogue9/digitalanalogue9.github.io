'use client'

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState } from 'react';
import useGameStore from '../store/useGameStore';
import Card from './Card';
import CategoryColumn from './CategoryColumn';
import { DropCommand } from '../commands/DropCommand';
import { MoveCommand } from '../commands/MoveCommand';
import { saveRound } from '../db/indexedDB';
import Results from './Results';
import { CategoryName } from '../types';

export default function RoundUI() {
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

  const [showResults, setShowResults] = useState(false);

  const handleDrop = async (cardId: string, category: CategoryName) => {
    const command = new DropCommand(cardId, category);
    const card = remainingCards.find(c => c.title === cardId);
    if (!card) return;

    const updatedCategories = { ...categories };
    updatedCategories[category] = [...updatedCategories[category], card];
    setCategories(updatedCategories);
    setRemainingCards(remainingCards.filter(c => c.title !== cardId));

    await saveRound(sessionId, currentRound, [command]);
  };

  const handleMoveCard = async (category: CategoryName, fromIndex: number, toIndex: number) => {
    const command = new MoveCommand(
      categories[category][fromIndex].title,
      category,
      category
    );
    
    const updatedCategories = { ...categories };
    const categoryCards = [...updatedCategories[category]];
    const [movedCard] = categoryCards.splice(fromIndex, 1);
    categoryCards.splice(toIndex, 0, movedCard);
    updatedCategories[category] = categoryCards;
    setCategories(updatedCategories);

    await saveRound(sessionId, currentRound, [command]);
  };

  const handleNextRound = () => {
    const importantCards = [
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
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {(Object.entries(categories) as [CategoryName, typeof categories[CategoryName]][]).map(([title, cards]) => (
            <CategoryColumn
              key={title}
              title={title}
              cards={cards}
              onDrop={handleDrop}
              onMoveCard={handleMoveCard}
            />
          ))}
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          {remainingCards.length > 0 ? (
            <p>Cards remaining: {remainingCards.length}</p>
          ) : (
            <p>All cards sorted! Click "Next Round" to continue.</p>
          )}
        </div>
      </div>
    </div>
  );
}
