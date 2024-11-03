import { Categories, CategoryName } from '@/types';

export const ALL_CATEGORIES: CategoryName[] = [
  'Very Important',
  'Quite Important',
  'Important',
  'Of Some Importance',
  'Not Important'
] as const;

export const emptyCategories: Categories = ALL_CATEGORIES.reduce((acc, category) => {
  acc[category] = [];
  return acc;
}, {} as Categories);

// Create a constant for initial categories
export const INITIAL_CATEGORIES: Categories = {
  'Very Important': [],
  'Quite Important': [],
  'Important': [],
  'Of Some Importance': [],
  'Not Important': []
};