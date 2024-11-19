import { CategoryName } from "@/lib/types";
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