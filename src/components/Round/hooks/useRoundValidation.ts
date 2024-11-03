import { useCallback } from 'react';
import { Value, Categories } from '@/types';

export type ValidationState = {
  remainingCards: Value[];
  hasMinimumNotImportant: boolean;
  hasEnoughCards: boolean;
  isNearingCompletion: boolean;
  veryImportantCount: number;
  targetCoreValues: number;
  totalActiveCards: number;
  categories: Categories;
};

export const useRoundValidation = (state: ValidationState) => {
    const validateRound = useCallback(() => {
      const {
        remainingCards,
        hasMinimumNotImportant,
        hasEnoughCards,
        categories,
        targetCoreValues
      } = state;
  
      // Can't proceed if cards still need to be sorted
      if (remainingCards.length > 0) return false;
  
      // Must have at least one card in Not Important
      if (!hasMinimumNotImportant) return false;
  
      // Get total cards in non-Not Important categories
      const activeCards = Object.entries(categories)
        .filter(([category]) => category !== 'Not Important')
        .reduce((sum, [_, cards]) => sum + (cards?.length || 0), 0);
  
      // Valid if we either:
      // 1. Have more than targetCoreValues active cards (continue to next round)
      // 2. Have exactly targetCoreValues in one category (end game)
      return activeCards >= targetCoreValues;
    }, [state]);
  
    return validateRound;
  };
  
