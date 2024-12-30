import { Value, Categories } from "../../../../lib/types";
/**
 * Represents the state of validation for a round.
 * 
 * @property {Value[]} remainingCards - The list of remaining cards to be validated.
 * @property {boolean} hasMinimumNotImportant - Indicates if the minimum number of not important cards is met.
 * @property {boolean} hasEnoughCards - Indicates if there are enough cards to proceed.
 * @property {boolean} isNearingCompletion - Indicates if the validation process is nearing completion.
 * @property {number} veryImportantCount - The count of very important cards.
 * @property {number} targetCoreValues - The target number of core values to be achieved.
 * @property {number} totalActiveCards - The total number of active cards in the round.
 * @property {Categories} categories - The categories associated with the validation state.
 */
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
    const activeCardsCount = Object.entries(state.categories).filter(([category]) => category !== 'Not Important').reduce((sum, [_, cards]) => sum + (cards?.length || 0), 0);

    // Allow next round if we have enough active cards for the target
    return activeCardsCount >= state.targetCoreValues;
  };
};