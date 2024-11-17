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
  return () => {
    // Can't proceed if there are remaining cards
    if (state.remainingCards.length > 0) {
      return false;
    }

    // Must have at least one card in Not Important
    if (!state.hasMinimumNotImportant) {
      return false;
    }

    // Calculate total cards in non-Not Important categories
    const activeCardsCount = Object.entries(state.categories)
      .filter(([category]) => category !== 'Not Important')
      .reduce((sum, [_, cards]) => sum + (cards?.length || 0), 0);

    // Allow next round if we have enough active cards for the target
    return activeCardsCount >= state.targetCoreValues;
  };
};
