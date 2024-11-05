import { useState, useCallback } from 'react';
import { Value, Categories, CategoryName, Command, DropCommandPayload, MoveCommandPayload } from '@/types';
import { initialCategories } from '@/constants/categories';

interface AnimatingCard {
  value: Value;
  sourcePos: { x: number; y: number };
  targetPos: { x: number; y: number };
}

export function useReplayState() {
  const [categories, setCategories] = useState<Categories>(initialCategories);
  const [animatingCard, setAnimatingCard] = useState<AnimatingCard | null>(null);
  const [allCards, setAllCards] = useState<Value[]>([]);

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

  const executeCommand = useCallback((
    command: Command,
    availableCards?: Value[]
  ) => {
    if (availableCards && allCards.length === 0) {
      setAllCards(availableCards);
    }

    if (command.type === 'DROP') {
      const { cardId, category } = command.payload as DropCommandPayload;
      const card = findCardById(cardId);
      
      if (!card) {
        console.warn(`Card with id ${cardId} not found`);
        return;
      }

      // Get source and target elements for animation
      const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
      const targetCategory = document.querySelector(`[data-category="${category}"]`);
      
      if (cardElement && targetCategory) {
        const sourceRect = cardElement.getBoundingClientRect();
        const targetRect = targetCategory.getBoundingClientRect();
        
        setAnimatingCard({
          value: card,
          sourcePos: { x: sourceRect.left + sourceRect.width / 2, y: sourceRect.top + sourceRect.height / 2 },
          targetPos: { x: targetRect.left + targetRect.width / 2, y: targetRect.top + targetRect.height / 2 }
        });
      }

      setCategories(prev => ({
        ...prev,
        [category]: [...(prev[category] || []), card]
      }));
    }

    if (command.type === 'MOVE') {
      const { cardId, fromCategory, toCategory } = command.payload as MoveCommandPayload;
      const card = findCardById(cardId);
      
      if (!card) {
        console.warn(`Card with id ${cardId} not found`);
        return;
      }

      // Get source and target elements for animation
      const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
      const targetCategory = document.querySelector(`[data-category="${toCategory}"]`);
      
      if (cardElement && targetCategory) {
        const sourceRect = cardElement.getBoundingClientRect();
        const targetRect = targetCategory.getBoundingClientRect();
        
        setAnimatingCard({
          value: card,
          sourcePos: { x: sourceRect.left + sourceRect.width / 2, y: sourceRect.top + sourceRect.height / 2 },
          targetPos: { x: targetRect.left + targetRect.width / 2, y: targetRect.top + targetRect.height / 2 }
        });
      }

      setCategories(prev => ({
        ...prev,
        [fromCategory]: prev[fromCategory]?.filter(c => c.id !== cardId) || [],
        [toCategory]: [...(prev[toCategory] || []), card]
      }));
    }
  }, [categories, findCardById, allCards]);

  return {
    categories,
    animatingCard,
    executeCommand,
    resetCategories,
    setAnimatingCard,
    setAllCards
  };
}
