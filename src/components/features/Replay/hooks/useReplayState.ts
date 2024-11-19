import { useState, useCallback } from 'react';
import { Value, Categories, CategoryName, Command, DropCommandPayload, MoveCommandPayload } from "@/lib/types";
import { initialCategories } from "@/components/features/Categories/constants/categories";
import { AnimatingCard } from '@/components/features/Replay/types';

export function useReplayState() {
  const [categories, setCategories] = useState<Categories>(initialCategories);
  const [animatingCard, setAnimatingCard] = useState<AnimatingCard | null>(null);
  const [allCards, setAllCards] = useState<Value[]>([]);

  const calculatePositions = (sourceElement: Element, targetElement: Element) => {
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
  };

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

    const { cardId, category: targetCategory } = 
      command.type === 'DROP' 
        ? (command.payload as DropCommandPayload)
        : { cardId: (command.payload as MoveCommandPayload).cardId, category: (command.payload as MoveCommandPayload).toCategory };

    const card = findCardById(cardId);
    if (!card) {
      console.warn(`Card with id ${cardId} not found`);
      return;
    }

    // Get source and target elements for animation
    let sourceElement: Element | null;
    if (command.type === 'DROP') {
      sourceElement = document.querySelector('[data-card-wrapper]');
    } else {
      const { fromCategory } = command.payload as MoveCommandPayload;
      sourceElement = document.querySelector(`[data-category="${fromCategory}"] [data-card-id="${cardId}"]`);
    }

    const targetElement = document.querySelector(`[data-category="${targetCategory}"]`);

    if (sourceElement && targetElement) {
      const { sourcePos, targetPos } = calculatePositions(sourceElement, targetElement);
      setAnimatingCard({
        value: card,
        sourcePos,
        targetPos
      });
    }

    if (command.type === 'DROP') {
      setCategories(prev => ({
        ...prev,
        [targetCategory]: [...(prev[targetCategory] || []), card]
      }));
    } else {
      const { fromCategory, toCategory } = command.payload as MoveCommandPayload;
      setCategories(prev => ({
        ...prev,
        [fromCategory]: prev[fromCategory]?.filter(c => c.id !== cardId) || [],
        [toCategory]: [...(prev[toCategory] || []), card]
      }));
    }
  }, [findCardById, allCards]);

  return {
    categories,
    animatingCard,
    executeCommand,
    resetCategories,
    setAnimatingCard,
    setAllCards
  };
}
