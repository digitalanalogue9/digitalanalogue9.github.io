import { useCallback } from 'react';
import { CategoryName, Categories, Value, Command } from '@/types';
import { MoveCommand } from '@/commands/MoveCommand';
import { DropCommand } from '@/commands/DropCommand';
import { saveRound } from '@/db/indexedDB';

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
  setShowResults: (show: boolean) => void
) => {
  const saveRoundData = useCallback(async (command: Command) => {
    if (!sessionId) return;
    try {
      await saveRound(sessionId, roundNumber, [...currentRoundCommands, command]);
    } catch (error) {
      console.error('Failed to save round data:', error);
    }
  }, [sessionId, roundNumber, currentRoundCommands]);

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
    if (!activeCategories.includes(fromCategory)) return;
    if (!validCategories.includes(toCategory) && !activeCategories.includes(toCategory)) return;

    const fromCards = categories[fromCategory] || [];
    const toCards = categories[toCategory] || [];

    if (!fromCards.some(card => card.title === value.title)) return;

    const command = new MoveCommand(value, fromCategory, toCategory);
    const updatedCategories = { ...categories };

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
