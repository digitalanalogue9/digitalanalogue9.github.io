import { useCallback, useEffect } from 'react';
import { CategoryName, Categories, Value, Command } from "@/lib/types";
import { MoveCommand } from "@/components/features/Game/commands/MoveCommand";
import { DropCommand } from "@/components/features/Game/commands/DropCommand";
import { saveRound } from "@/lib/db/indexedDB";
import { logEffect, logStateUpdate } from "@/lib/utils";
export const useRoundHandlers = (categories: Categories, setCategories: (categories: Categories) => void, remainingCards: Value[], setRemainingCards: (cards: Value[]) => void, validCategories: CategoryName[], activeCategories: CategoryName[], sessionId: string | null, roundNumber: number, currentRoundCommands: Command[], addCommand: (command: Command) => Promise<void>, clearCommands: () => void, targetCoreValues: number, setRoundNumber: (round: number) => void, setShowResults: (show: boolean) => void, setShowStatusDetails: (isFirst: boolean) => void) => {
  useEffect(() => {
    logEffect('categories effect in useRoundHandlers', [categories]);
  }, [categories]);
  useEffect(() => {
    console.log('Commands updated:', currentRoundCommands);
  }, [currentRoundCommands]);

  // in useRoundHandlers.ts
  const saveRoundData = useCallback(async (command: Command) => {
    if (!sessionId) return;
    try {
      // Only pass the visible categories
      const visibleCats = Object.fromEntries(Object.entries(categories).filter(([category]) => validCategories.includes(category as CategoryName))) as Categories;
      await saveRound(sessionId, roundNumber, [...currentRoundCommands, command], visibleCats);
    } catch (error) {
      console.error('Failed to save round data:', error);
    }
  }, [sessionId, roundNumber, currentRoundCommands, categories, validCategories]);
  const handleDrop = useCallback(async (value: Value, category: CategoryName): Promise<void> => {
    if (!validCategories.includes(category)) return;
    const card = remainingCards.find((c: Value) => c.title === value.title);
    if (!card) return;
    const command = new DropCommand(value, category);
    const updatedCategories = {
      ...categories
    };
    updatedCategories[category] = [...(categories[category] || []), card];
    setCategories(updatedCategories);
    setRemainingCards(remainingCards.filter((c: Value) => c.title !== value.title));
    await addCommand(command);
    await saveRoundData(command);
  }, [remainingCards, categories, validCategories, setCategories, setRemainingCards, addCommand, saveRoundData]);
  const handleMoveCard = useCallback(async (category: CategoryName, fromIndex: number, toIndex: number): Promise<void> => {
    // Debug logging
    console.log('handleMoveCard called:', {
      category,
      fromIndex,
      toIndex
    });

    // Early returns with logging
    if (!validCategories.includes(category)) {
      console.log('Invalid category, returning');
      return;
    }
    if (fromIndex === toIndex) {
      console.log('Same index, returning');
      return;
    }
    const categoryCards = categories[category] || [];
    if (!categoryCards[fromIndex]) {
      console.log('No card at fromIndex, returning');
      return;
    }

    // Get the card we're moving
    const cardToMove = categoryCards[fromIndex];

    // Create a new categories object with the updated order
    const updatedCategories = {
      ...categories
    };
    const newCards = [...categoryCards];
    newCards.splice(fromIndex, 1);
    newCards.splice(toIndex, 0, cardToMove);
    updatedCategories[category] = newCards;

    // Create single command for this move
    const command = new MoveCommand(cardToMove, category, category, fromIndex, toIndex);

    // Update state and save in a single operation
    try {
      setCategories(updatedCategories);
      await addCommand(command);
      await saveRoundData(command);
      console.log('Move completed successfully:', {
        card: cardToMove,
        from: fromIndex,
        to: toIndex,
        category
      });
    } catch (error) {
      console.error('Error in handleMoveCard:', error);
    }
  }, [categories, validCategories, setCategories, addCommand, saveRoundData]);
  const handleMoveBetweenCategories = useCallback(async (value: Value, fromCategory: CategoryName, toCategory: CategoryName): Promise<void> => {
    if (!activeCategories.includes(fromCategory)) return;
    if (!validCategories.includes(toCategory) && !activeCategories.includes(toCategory)) return;
    // Set first interaction to false when a card is dropped

    const fromCards = categories[fromCategory] || [];
    const toCards = categories[toCategory] || [];
    if (!fromCards.some(card => card.title === value.title)) return;
    const command = new MoveCommand(value, fromCategory, toCategory);
    const updatedCategories = {
      ...categories
    };
    updatedCategories[fromCategory] = fromCards.filter(card => card.title !== value.title);
    updatedCategories[toCategory] = [...toCards, value];
    setCategories(updatedCategories);
    await addCommand(command);
    await saveRoundData(command);
  }, [categories, validCategories, activeCategories, setCategories, addCommand, saveRoundData]);
  return {
    handleMoveCard,
    handleDrop,
    handleMoveBetweenCategories,
    saveRoundData
  };
};