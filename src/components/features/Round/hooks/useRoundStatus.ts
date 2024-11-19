// src/components/Round/hooks/useRoundStatus.ts
import { useCallback } from 'react';
import { useMobile } from '@/lib/contexts/MobileContext';
import {StatusState, Status, StatusType} from '@/components/features/Round/types';

export const useRoundStatus = (state: StatusState) => {
  const {
    isMobile
  } = useMobile();
  return useCallback((): Status => {
    if (state.remainingCards.length > 0) {
      if (isMobile) {
        return {
          text: `Tap the yellow card to select it, then tap a category to place it`,
          type: 'info',
          isEndGame: false
        };
      }
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
    const activeCardsCount = Object.entries(state.categories).filter(([category]) => category !== 'Not Important').reduce((sum, [_, cards]) => sum + (cards?.length || 0), 0);
    if (activeCardsCount < state.targetCoreValues) {
      return {
        text: `You need at least ${state.targetCoreValues} values outside of Not Important to continue`,
        type: 'warning',
        isEndGame: false
      };
    }
    if (state.veryImportantCount === state.targetCoreValues) {
      return {
        text: 'Perfect! Click End Game to complete the exercise.',
        type: 'success',
        isEndGame: true
      };
    }
    return {
      text: 'You can continue to the next round or keep refining your choices',
      type: 'info',
      isEndGame: false
    };
  }, [state, isMobile]);
};