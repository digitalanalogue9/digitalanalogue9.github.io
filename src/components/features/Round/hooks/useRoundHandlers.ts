import { useCallback, useEffect } from 'react';
import { CategoryName, Categories, Value, Command } from "@/lib/types";
import { MoveCommand } from "@/components/features/Exercise/commands/MoveCommand";
import { DropCommand } from "@/components/features/Exercise/commands/DropCommand";
import { saveRound, getRound } from "@/lib/db/indexedDB";
import { logEffect, logStateUpdate } from "@/lib/utils";
export const useRoundHandlers = (categories: Categories, setCategories: (categories: Categories) => void, remainingCards: Value[], setRemainingCards: (cards: Value[]) => void, validCategories: CategoryName[], activeCategories: CategoryName[], sessionId: string | null, roundNumber: number, currentRoundCommands: Command[], addCommand: (command: Command) => Promise<void>, clearCommands: () => void, targetCoreValues: number, setRoundNumber: (round: number) => void, setShowResults: (show: boolean) => void, setShowStatusDetails: (isFirst: boolean) => void) => {
  useEffect(() => {
    const loadRoundCommands = async () => {
      if (sessionId && roundNumber) {
        try {
          const round = await getRound(sessionId, roundNumber);
          if (round?.commands) {
            // Update store with existing commands
            clearCommands(); // Clear any existing commands first
            for (const command of round.commands) {
              await addCommand(command);
            }
          }
        } catch (error) {
          console.error('Error loading round commands:', error);
        }
      }
    };

    loadRoundCommands();
  }, [sessionId, roundNumber, addCommand, clearCommands]); useEffect(() => {
    logEffect('categories effect in useRoundHandlers', [categories]);
  }, [categories]);
  useEffect(() => {
    console.log('Commands updated:', currentRoundCommands);
  }, [currentRoundCommands]);

  // in useRoundHandlers.ts
  const saveRoundData = useCallback(async (command: Command, updatedCategories: Categories) => {
    if (!sessionId) return;
    try {
      // Get current round from database to ensure we have all commands
      const currentRound = await getRound(sessionId, roundNumber);
      const existingCommands = currentRound?.commands || [];

      // Save with all commands plus the new one
      await saveRound(
        sessionId,
        roundNumber,
        [...existingCommands, command],
        updatedCategories
      );
    } catch (error) {
      console.error('Failed to save round data:', error);
    }
  }, [sessionId, roundNumber]);

  const handleDrop = useCallback(async (value: Value, category: CategoryName): Promise<void> => {
    if (!validCategories.includes(category)) return;

    const card = remainingCards.find((c: Value) => c.title === value.title);
    if (!card) return;

    const command = new DropCommand(value, category);

    // Update categories
    const updatedCategories = {
      ...categories
    };
    updatedCategories[category] = [...(categories[category] || []), card];

    // Update state
    setCategories(updatedCategories);
    setRemainingCards(remainingCards.filter((c: Value) => c.title !== value.title));

    // Save command and updated categories
    await addCommand(command);
    await saveRoundData(command, updatedCategories);
  }, [remainingCards, categories, validCategories, setCategories, setRemainingCards, addCommand, saveRoundData]);

  const handleMoveBetweenCategories = useCallback(async (value: Value, fromCategory: CategoryName, toCategory: CategoryName): Promise<void> => {
    if (!activeCategories.includes(fromCategory)) return;
    if (!validCategories.includes(toCategory) && !activeCategories.includes(toCategory)) return;

    const fromCards = categories[fromCategory] || [];
    const toCards = categories[toCategory] || [];
    if (!fromCards.some(card => card.title === value.title)) return;

    const command = new MoveCommand(value, fromCategory, toCategory);

    // Update categories
    const updatedCategories = {
      ...categories
    };
    updatedCategories[fromCategory] = fromCards.filter(card => card.title !== value.title);
    updatedCategories[toCategory] = [...toCards, value];

    // Update state
    setCategories(updatedCategories);

    // Save command and updated categories
    await addCommand(command);
    await saveRoundData(command, updatedCategories);
  }, [categories, validCategories, activeCategories, setCategories, addCommand, saveRoundData]);

  const handleMoveCard = useCallback(async (category: CategoryName, fromIndex: number, toIndex: number): Promise<void> => {
    if (!validCategories.includes(category) || fromIndex === toIndex) return;

    const categoryCards = categories[category] || [];
    if (!categoryCards[fromIndex]) return;

    const cardToMove = categoryCards[fromIndex];

    // Update categories
    const updatedCategories = {
      ...categories
    };
    const newCards = [...categoryCards];
    newCards.splice(fromIndex, 1);
    newCards.splice(toIndex, 0, cardToMove);
    updatedCategories[category] = newCards;

    const command = new MoveCommand(cardToMove, category, category, fromIndex, toIndex);

    try {
      // Update state
      setCategories(updatedCategories);

      // Save command and updated categories
      await addCommand(command);
      await saveRoundData(command, updatedCategories);
    } catch (error) {
      console.error('Error in handleMoveCard:', error);
    }
  }, [categories, validCategories, setCategories, addCommand, saveRoundData]);

  return {
    handleMoveCard,
    handleDrop,
    handleMoveBetweenCategories,
    saveRoundData
  };
};