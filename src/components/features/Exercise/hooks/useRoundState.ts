import { useMemo } from 'react';
import { Categories, CategoryName, Value, } from "../../../../lib/types";
import { RoundState } from "../types";
/**
 * Custom hook to manage the state of a round in the Core Values game.
 *
 * @param {Categories} categories - The current categories and their associated cards.
 * @param {Value[]} remainingCards - The cards that are yet to be categorized.
 * @param {number} targetCoreValues - The target number of core values to be achieved.
 * @returns {object} The state of the round including various calculated properties.
 * @returns {number} return.activeCards - The number of active cards (excluding 'Not Important').
 * @returns {number} return.totalActiveCards - The total number of active cards including remaining cards.
 * @returns {CategoryName[]} return.validCategories - The list of valid categories.
 * @returns {CategoryName[]} return.activeCategories - The list of active categories with cards.
 * @returns {Categories} return.visibleCategories - The categories that are visible.
 * @returns {number} return.veryImportantCount - The count of cards in the 'Very Important' category.
 * @returns {number} return.notImportantCount - The count of cards in the 'Not Important' category.
 * @returns {boolean} return.isNearingCompletion - Whether the game is nearing completion (only two valid categories left).
 * @returns {boolean} return.hasEnoughCards - Whether there are enough cards to meet the target core values.
 * @returns {boolean} return.hasMinimumNotImportant - Whether the minimum 'Not Important' condition is met.
 * @returns {boolean} return.hasTooManyImportantCards - Whether there are too many important cards when nearing completion.
 * @returns {boolean} return.hasNotEnoughImportantCards - Whether there are not enough important cards when nearing completion.
 * @returns {boolean} return.isEndGameReady - Whether the game is ready to end based on various conditions.
 * @returns {boolean} return.hasFoundCoreValues - Whether the target core values have been found in any category.
 * @returns {boolean} return.hasTargetCoreValuesInVeryImportant - Whether the 'Very Important' category has the target core values.
 * @returns {Categories} return.categories - The current state of categories.
 */
export const useRoundState = (categories: Categories, remainingCards: Value[], targetCoreValues: number): RoundState => {
  const hasTargetCoreValuesInVeryImportant = categories['Very Important']?.length === targetCoreValues;

  // Calculate active cards (excluding Not Important)
  const activeCards = Object.entries(categories).filter(([category]) => category !== 'Not Important').reduce((sum, [_, cards]) => sum + (cards?.length || 0), 0);

  // Calculate total active including remaining cards
  const totalActiveCards = activeCards + remainingCards.length;
  const validCategories = useMemo(() => {
    return Object.keys(categories).filter(category => categories[category] !== undefined) as CategoryName[];
  }, [categories]);
  const activeCategories = useMemo(() => {
    return Object.entries(categories).filter(([_, cards]) => cards && cards.length > 0).map(([category]) => category as CategoryName);
  }, [categories]);
  const visibleCategories = useMemo(() => {
    const allCategories = [...validCategories, ...activeCategories].filter((category, index, self) => self.indexOf(category) === index);
    return allCategories.reduce((acc, category) => {
      acc[category] = categories[category] || [];
      return acc;
    }, {} as Categories);
  }, [validCategories, activeCategories, categories]);
  const veryImportantCount = categories['Very Important']?.length || 0;
  const notImportantCount = categories['Not Important']?.length || 0;
  const isNearingCompletion = validCategories.length === 2;
  const hasEnoughCards = totalActiveCards >= targetCoreValues;
  const hasMinimumNotImportant = (totalActiveCards === targetCoreValues && hasTargetCoreValuesInVeryImportant) || (notImportantCount >= 1);
  const hasTooManyImportantCards = isNearingCompletion && veryImportantCount > targetCoreValues;
  const hasNotEnoughImportantCards = isNearingCompletion && veryImportantCount < targetCoreValues;

  // New calculation for found core values
  const hasFoundCoreValues = Object.entries(categories).some(([category, cards]) => category !== 'Not Important' && cards?.length === targetCoreValues);
  const isEndGameReady = isNearingCompletion && veryImportantCount === targetCoreValues && totalActiveCards === targetCoreValues && hasMinimumNotImportant
    || hasFoundCoreValues || hasTargetCoreValuesInVeryImportant;
  return {
    activeCards,
    totalActiveCards,
    validCategories,
    activeCategories,
    visibleCategories,
    veryImportantCount,
    notImportantCount,
    isNearingCompletion,
    hasEnoughCards,
    hasMinimumNotImportant,
    hasTooManyImportantCards,
    hasNotEnoughImportantCards,
    isEndGameReady,
    hasFoundCoreValues,
    hasTargetCoreValuesInVeryImportant,
    categories
  };
};