// src/components/Round/hooks/useRoundStatus.ts
import { useCallback } from 'react';
import { Categories, Value } from '@/types';

type StatusType = 'info' | 'warning' | 'success';

interface Status {
  text: string;
  type: StatusType;
  isEndGame?: boolean;
}

export interface StatusState {
  remainingCards: Value[];
  targetCoreValues: number;
  categories: Categories;
  hasMinimumNotImportant: boolean;
  hasEnoughCards: boolean;
  isNearingCompletion: boolean;
  veryImportantCount: number;
  totalActiveCards: number;
}

export const useRoundStatus = (state: StatusState) => {
  return useCallback((): Status => {
    if (state.remainingCards.length > 0) {
      return {
        text: `Drag the remaining ${state.remainingCards.length === 1 ? "" : state.remainingCards.length} ${state.remainingCards.length === 1 ? "value" : "values"} to a category`,
        type: 'info',
        isEndGame: false
      };
    }

    if (!state.hasMinimumNotImportant) {
      return {
        text: 'You need to place at least one value in Not Important before you can continue',
        type: 'warning',
        isEndGame: false
      };
    }

    // Calculate active cards (not in Not Important)
    const activeCards = Object.entries(state.categories)
      .filter(([category]) => category !== 'Not Important')
      .reduce((sum, [_, cards]) => sum + (cards?.length || 0), 0);

    if (activeCards === state.targetCoreValues) {
      return {
        text: 'Perfect! Click End Game to complete the exercise.',
        type: 'success',
        isEndGame: true
      };
    }

    if (activeCards < state.targetCoreValues) {
      return {
        text: `You need at least ${state.targetCoreValues} values outside of Not Important to continue`,
        type: 'warning',
        isEndGame: false
      };
    }

    return {
      text: 'Continue refining your choices',
      type: 'info',
      isEndGame: false
    };
  }, [state]);
};
