import { useMemo } from 'react';
import { Categories, CategoryName, Value } from "@/lib/types";
export const useRoundState = (categories: Categories, remainingCards: Value[], targetCoreValues: number) => {
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