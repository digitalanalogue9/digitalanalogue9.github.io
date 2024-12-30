// src/components/Round/hooks/useRoundStatus.ts
import { useCallback } from 'react';
import { useMobile } from '@/components/common/MobileProvider';
import { Status, StatusState } from '../types';

/**
 * Custom hook that determines the status of the current round based on the provided state.
 *
 * @param {StatusState} state - The current state of the round.
 * @returns {() => Status} A callback function that returns the current status of the round.
 *
 * The returned status object contains:
 * - `text` (string): A message describing the current status.
 * - `type` ('info' | 'warning' | 'success'): The type of status message.
 * - `isEndGame` (boolean): A flag indicating whether the game has ended.
 *
 * The status is determined based on the following conditions:
 * 1. If there are remaining cards:
 *    - On mobile: instructs the user to tap the yellow card and place it in a category.
 *    - On desktop: instructs the user to drag the remaining values to a category.
 * 2. If there are no remaining cards and the minimum number of values in "Not Important" is not met:
 *    - Warns the user to place at least one value in "Not Important".
 * 3. If the number of active cards outside "Not Important" is less than the target core values:
 *    - Warns the user to have at least the target number of values outside "Not Important".
 * 4. If the number of "Very Important" values equals the target core values:
 *    - Indicates that the user can end the game.
 * 5. Otherwise:
 *    - Informs the user that they can continue to the next round or refine their choices.
 */
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