import { Categories, CategoryName, Value } from '@/lib/types';
import { getGameConfig } from '@/lib/utils/config/gameConfig';

export const getImportantCards = (categories: Categories): Value[] => {
  const importantCards: Value[] = [];

  // Always check Very Important as it exists in all rounds
  if ('Very Important' in categories) {
    importantCards.push(...categories['Very Important']);
  }

  // Check optional categories based on round type
  if ('Quite Important' in categories && categories['Quite Important']) {
    importantCards.push(...categories['Quite Important']);
  }
  if ('Important' in categories && categories['Important']) {
    importantCards.push(...categories['Important']);
  }
  if ('Of Some Importance' in categories && categories['Of Some Importance']) {
    importantCards.push(...categories['Of Some Importance']);
  }
  return importantCards;
};

export const getCategoriesForRound = (cardCount: number, targetValue: number): Categories => {
  const ratio = cardCount / targetValue;
  const { ratioThresholds } = getGameConfig();
  const categories = {} as Categories;
  if (ratio <= ratioThresholds.final) {
    categories['Very Important'] = [];
    categories['Not Important'] = [];
  } else if (ratio <= ratioThresholds.reduced) {
    categories['Very Important'] = [];
    categories['Quite Important'] = [];
    categories['Not Important'] = [];
  } else if (ratio <= ratioThresholds.standard) {
    categories['Very Important'] = [];
    categories['Quite Important'] = [];
    categories['Important'] = [];
    categories['Not Important'] = [];
  } else {
    categories['Very Important'] = [];
    categories['Quite Important'] = [];
    categories['Important'] = [];
    categories['Of Some Importance'] = [];
    categories['Not Important'] = [];
  }
  return categories;
};
export const getCategoryNames = (ratio: number): CategoryName[] => {
  if (ratio <= 1.5) {
    return ['Very Important', 'Not Important'];
  } else if (ratio <= 2) {
    return ['Very Important', 'Quite Important', 'Not Important'];
  } else if (ratio <= 3) {
    return ['Very Important', 'Quite Important', 'Important', 'Not Important'];
  }
  return ['Very Important', 'Quite Important', 'Important', 'Of Some Importance', 'Not Important'];
};

export const getCategories = (activeCardCount: number, targetValue: number): CategoryName[] => {
  const ratio = activeCardCount / targetValue;
  if (ratio <= 1.5) {
    return ['Very Important', 'Not Important'];
  } else if (ratio <= 2) {
    return ['Very Important', 'Quite Important', 'Not Important'];
  } else if (ratio <= 3) {
    return ['Very Important', 'Quite Important', 'Important', 'Not Important'];
  }
  return ['Very Important', 'Quite Important', 'Important', 'Of Some Importance', 'Not Important'];
};
