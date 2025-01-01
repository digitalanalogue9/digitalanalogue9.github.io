import { useCallback, useEffect } from 'react';
import { CategoryName, Categories, Value, Command } from '@/lib/types';
import { MoveCommand } from '@/components/features/Exercise/commands/MoveCommand';
import { DropCommand } from '@/components/features/Exercise/commands/DropCommand';
import { saveRound, getRound } from '@/lib/db/indexedDB';
import { logEffect, logStateUpdate } from '@/lib/utils';
/**
 * Custom hook that provides handlers for managing round-related actions such as dropping a card into a category,
 * moving a card between categories, and moving a card within a category.
 *
 * @param {Categories} categories - The current state of categories with their respective cards.
 * @param {Function} setCategories - Function to update the state of categories.
 * @param {Value[]} remainingCards - The list of cards that are yet to be categorized.
 * @param {Function} setRemainingCards - Function to update the state of remaining cards.
 * @param {CategoryName[]} validCategories - List of valid category names.
 * @param {CategoryName[]} activeCategories - List of active category names.
 * @param {string | null} sessionId - The current session ID.
 * @param {number} roundNumber - The current round number.
 * @param {Command[]} currentRoundCommands - The list of commands executed in the current round.
 * @param {Function} addCommand - Function to add a new command.
 * @param {Function} clearCommands - Function to clear all commands.
 * @param {number} targetCoreValues - The target number of core values.
 * @param {Function} setRoundNumber - Function to update the round number.
 * @param {Function} setShowResults - Function to show or hide the results.
 * @param {Function} setShowStatusDetails - Function to show or hide the status details.
 *
 * @returns {Object} An object containing the handlers:
 * - `handleMoveCard`: Handler to move a card within a category.
 * - `handleDrop`: Handler to drop a card into a category.
 * - `handleMoveBetweenCategories`: Handler to move a card between categories.
 * - `saveRoundData`: Handler to save round data.
 */
export const useRoundHandlers = (
  categories: Categories,
  setCategories: (categories: Categories) => void,
  remainingCards: Value[],
  setRemainingCards: (cards: Value[]) => void,
  validCategories: CategoryName[],
  activeCategories: CategoryName[],
  sessionId: string | null,
  roundNumber: number,
  currentRoundCommands: Command[],
  addCommand: (command: Command) => Promise<void>,
  clearCommands: () => void,
  targetCoreValues: number,
  setRoundNumber: (round: number) => void,
  setShowResults: (show: boolean) => void,
  setShowStatusDetails: (isFirst: boolean) => void
) => {
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
  }, [sessionId, roundNumber, addCommand, clearCommands]);

  useEffect(() => {
    logEffect('categories effect in useRoundHandlers', [categories]);
  }, [categories]);

  useEffect(() => {
    console.log('Commands updated:', currentRoundCommands);
  }, [currentRoundCommands]);

  // in useRoundHandlers.ts
  const saveRoundData = useCallback(
    async (command: Command, updatedCategories: Categories) => {
      if (!sessionId) return;
      try {
        // Get current round from database to ensure we have all commands
        const currentRound = await getRound(sessionId, roundNumber);
        const existingCommands = currentRound?.commands || [];

        // Save with all commands plus the new one
        await saveRound(sessionId, roundNumber, [...existingCommands, command], updatedCategories);
      } catch (error) {
        console.error('Failed to save round data:', error);
      }
    },
    [sessionId, roundNumber]
  );

  const handleDrop = useCallback(
    async (value: Value, category: CategoryName): Promise<void> => {
      if (!validCategories.includes(category)) return;

      const card = remainingCards.find((c: Value) => c.title === value.title);
      if (!card) return;

      const command = new DropCommand(value, category);

      // Update categories
      const updatedCategories = {
        ...categories,
      };
      updatedCategories[category] = [...(categories[category] || []), card];

      // Update state
      setCategories(updatedCategories);
      setRemainingCards(remainingCards.filter((c: Value) => c.title !== value.title));

      // Save command and updated categories
      await addCommand(command);
      await saveRoundData(command, updatedCategories);
    },
    [remainingCards, categories, validCategories, setCategories, setRemainingCards, addCommand, saveRoundData]
  );

  const handleMoveBetweenCategories = useCallback(
    async (value: Value, fromCategory: CategoryName, toCategory: CategoryName): Promise<void> => {
      if (!activeCategories.includes(fromCategory)) return;
      if (!validCategories.includes(toCategory) && !activeCategories.includes(toCategory)) return;

      const fromCards = categories[fromCategory] || [];
      const toCards = categories[toCategory] || [];
      if (!fromCards.some((card) => card.title === value.title)) return;

      const command = new MoveCommand(value, fromCategory, toCategory);

      // Update categories
      const updatedCategories = {
        ...categories,
      };
      updatedCategories[fromCategory] = fromCards.filter((card) => card.title !== value.title);
      updatedCategories[toCategory] = [...toCards, value];

      // Update state
      setCategories(updatedCategories);

      // Save command and updated categories
      await addCommand(command);
      await saveRoundData(command, updatedCategories);
    },
    [categories, validCategories, activeCategories, setCategories, addCommand, saveRoundData]
  );

  const handleMoveCard = useCallback(
    async (category: CategoryName, fromIndex: number, toIndex: number): Promise<void> => {
      if (!validCategories.includes(category) || fromIndex === toIndex) return;

      const categoryCards = categories[category] || [];
      if (!categoryCards[fromIndex]) return;

      const cardToMove = categoryCards[fromIndex];

      // Update categories
      const updatedCategories = {
        ...categories,
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
    },
    [categories, validCategories, setCategories, addCommand, saveRoundData]
  );

  return {
    handleMoveCard,
    handleDrop,
    handleMoveBetweenCategories,
    saveRoundData,
  };
};
