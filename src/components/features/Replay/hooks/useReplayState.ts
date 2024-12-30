import { useState, useCallback } from 'react';
import { Value, Categories, Command, DropCommandPayload, MoveCommandPayload } from "../../../..//lib/types";
import { initialCategories } from "../../../../components/features/Categories/constants/categories";
import { AnimatingCard } from '../../../../components/features/Replay/types';

export function useReplayState() {
  const [categories, setCategories] = useState<Categories>(initialCategories);
  const [animatingCard, setAnimatingCard] = useState<AnimatingCard | null>(null);
  const [allCards, setAllCards] = useState<Value[]>([]);

  const calculatePositions = useCallback((sourceElement: Element, targetElement: Element) => {
    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    // Calculate source position
    const sourcePos = {
      x: sourceRect.left,
      y: sourceRect.top
    };

    // Calculate target position at the top of the target category
    const targetPos = {
      x: targetRect.left + (targetRect.width / 2) - (sourceRect.width / 2),
      y: targetRect.top + 20 // 20px offset from top
    };

    return { sourcePos, targetPos };
  }, []);

  const resetCategories = useCallback(() => {
    setCategories(initialCategories);
  }, []);

  const findCardById = useCallback((cardId: string): Value | undefined => {
    // Look in allCards first
    const card = allCards.find(c => c.id === cardId);
    if (card) return card;

    // If not found, look in categories
    for (const categoryCards of Object.values(categories)) {
      const found = categoryCards?.find(c => c.id === cardId);
      if (found) return found;
    }
    return undefined;
  }, [categories, allCards]);

  const executeCommand = useCallback((command: Command, availableCards?: Value[]) => {
    if (availableCards && allCards.length === 0) {
      setAllCards(availableCards);
    }

    const { cardId } = command.type === 'DROP'
      ? (command.payload as DropCommandPayload)
      : (command.payload as MoveCommandPayload);

    const card = findCardById(cardId);
    if (!card) {
      console.warn(`Card with id ${cardId} not found`);
      return;
    }

    // Animation setup
    let sourceElement: Element | null = null;
    let targetElement: Element | null = null;

    // Handle state updates based on command type
    if (command.type === 'DROP') {
      const dropPayload = command.payload as DropCommandPayload;
      sourceElement = document.querySelector('[data-card-wrapper]');
      targetElement = document.querySelector(`[data-category="${dropPayload.category}"]`);

      // For DROP, add to target category and ensure it's removed from all others
      setCategories(prev => {
        const newCategories = { ...prev };
        // Remove from all categories first
        Object.keys(newCategories).forEach(category => {
          newCategories[category] = newCategories[category]?.filter(c => c.id !== cardId) || [];
        });
        // Add to target category
        newCategories[dropPayload.category] = [...(newCategories[dropPayload.category] || []), card];
        return newCategories;
      });
    } else {
      // Handle MOVE command
      const movePayload = command.payload as MoveCommandPayload;
      const { fromCategory, toCategory, fromIndex, toIndex } = movePayload;

      sourceElement = document.querySelector(`[data-category="${fromCategory}"] [data-card-id="${cardId}"]`);
      targetElement = document.querySelector(`[data-category="${toCategory}"]`);

      setCategories(prev => {
        const newCategories = { ...prev };

        if (fromCategory === toCategory) {
          // Moving within the same category
          const categoryCards = [...(prev[fromCategory] || [])];
          categoryCards.splice(fromIndex!, 1); // Remove from old position
          categoryCards.splice(toIndex!, 0, card); // Insert at new position
          newCategories[fromCategory] = categoryCards;
        } else {
          // Moving between different categories
          // Remove from source category
          newCategories[fromCategory] = (prev[fromCategory] || [])
            .filter(c => c.id !== cardId);

          // Add to target category at specific position
          const targetCards = [...(prev[toCategory] || [])];
          targetCards.splice(toIndex!, 0, card);
          newCategories[toCategory] = targetCards;
        }
        return newCategories;
      });
    }

    // Handle animation if elements are found
    if (sourceElement && targetElement) {
      const { sourcePos, targetPos } = calculatePositions(sourceElement, targetElement);
      setAnimatingCard({
        value: card,
        sourcePos,
        targetPos
      });
    }
  }, [findCardById, allCards, calculatePositions, setAnimatingCard]);

  return {
    categories,
    animatingCard,
    executeCommand,
    resetCategories,
    setAnimatingCard,
    setAllCards
  };
}
