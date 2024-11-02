import { Categories, Round1And2Categories, Round3Categories, Round4Categories } from '@/types';
import { CategoryName, Value } from '@/types';

export function getCategoriesForRound(roundNumber: number): Categories {
  if (roundNumber <= 2) {
    return {
      'Very Important': [],
      'Quite Important': [],
      'Important': [],
      'Of Some Importance': [],
      'Not Important': []
    };
  } else if (roundNumber === 3) {
    return {
      'Very Important': [],
      'Quite Important': [],
      'Important': [],
      'Not Important': []
    };
  } else {
    return {
      'Very Important': [],
      'Not Important': []
    };
  }
}

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

export const getCategoryNames = (roundNumber: number): CategoryName[] => {
  if (roundNumber <= 2) {
    return ['Very Important', 'Quite Important', 'Important', 'Of Some Importance', 'Not Important'];
  } else if (roundNumber === 3) {
    return ['Very Important', 'Quite Important', 'Important', 'Not Important'];
  } else {
    return ['Very Important', 'Not Important'];
  }
};
