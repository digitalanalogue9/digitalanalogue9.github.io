import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useEffect } from 'react';
import useGameStore from '../store/useGameStore';
import Card from './Card';
import CategoryColumn from './CategoryColumn';
import { DropCommand } from '../commands/DropCommand';
import { MoveCommand } from '../commands/MoveCommand';
import { saveRound } from '../db/indexedDB';

export default function RoundUI() {
  const {
    currentRound,
    remainingCards,
    categories,
    sessionId,
    setCategories,
  } = useGameStore();

  const handleDrop = async (cardId, category) => {
    const command = new DropCommand(cardId, category);
    // Update state and save to IndexedDB
    const updatedCategories = { ...categories };
    // Find the card and move it to the new category
    // Save command to IndexedDB
    await saveRound(sessionId, currentRound, command);
  };

  const handleMoveCard = async (category, fromIndex, toIndex) => {
    const command = new MoveCommand(category, fromIndex, toIndex);
    // Update state and save to IndexedDB
    const updatedCategories = { ...categories };
    const categoryCards = [...updatedCategories[category]];
    const [movedCard] = categoryCards.splice(fromIndex, 1);
    categoryCards.splice(toIndex, 0, movedCard);
    updatedCategories[category] = categoryCards;
    setCategories(updatedCategories);
    await saveRound(sessionId, currentRound, command);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Round {currentRound}</h1>
        <div className="mb-4">
          <Card value={remainingCards[0]} />
        </div>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(categories).map(([title, cards]) => (
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
    </DndProvider>
  );
}
yes