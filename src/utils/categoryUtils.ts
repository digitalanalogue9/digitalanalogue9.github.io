import { Categories, CategoryName, Value } from '@/types';

export const getCategoriesForRound = (roundNumber: number): Categories => {
  if (roundNumber >= 3) {
    return {
      'Very Important': [],
      'Important': [],
      'Not Important': [],
      'Quite Important': [],      // Include but empty for type safety
      'Of Some Importance': []    // Include but empty for type safety
    };
  }
  
  return {
    'Very Important': [],
    'Quite Important': [],
    'Important': [],
    'Of Some Importance': [],
    'Not Important': []
  };
};

export const getImportantCards = (categories: Categories): Value[] => {
  const importantCards: Value[] = [];

  // Explicitly check and add each category's values
  if (categories['Very Important']) {
    importantCards.push(...categories['Very Important']);
  }
  if (categories['Quite Important']) {
    importantCards.push(...categories['Quite Important']);
  }
  if (categories['Important']) {
    importantCards.push(...categories['Important']);
  }
  if (categories['Of Some Importance']) {
    importantCards.push(...categories['Of Some Importance']);
  }

  return importantCards;
};
