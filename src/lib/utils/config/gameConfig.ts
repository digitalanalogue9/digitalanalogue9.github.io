'use client';

export const getGameConfig = () => ({
  maxCards: Number(process.env.NEXT_PUBLIC_CARDS_IN_GAME || 35),
  defaultCoreValues: Number(process.env.NEXT_PUBLIC_DEFAULT_CORE_VALUES_TO_CHOOSE || 10),
  minNotImportant: 1, // Minimum cards that must be in Not Important
  ratioThresholds: {
    final: 1.5, // Ratio for final round (2 categories)
    reduced: 2, // Ratio for reduced categories (3 categories)
    standard: 3, // Ratio for standard categories (4 categories)
    // Above standard ratio shows all categories
  },
});

export const validateGameConstraints = (activeCards: number, targetCoreValues: number, notImportantCount: number) => {
  const config = getGameConfig();

  return {
    hasMinimumNotImportant: notImportantCount >= config.minNotImportant,
    hasEnoughCards: activeCards >= targetCoreValues,
    isTooManyCards: activeCards > config.maxCards,
  };
};
