import { Categories, CategoryName } from '@/types';

export const allCategories: CategoryName[] = [
  'Very Important',
  'Quite Important',
  'Important',
  'Of Some Importance',
  'Not Important'
] as const;

export const emptyCategories: Categories = allCategories.reduce((acc, category) => {
  acc[category] = [];
  return acc;
}, {} as Categories);

// Create a constant for initial categories
export const initialCategories: Categories = {
  'Very Important': [],
  'Quite Important': [],
  'Important': [],
  'Of Some Importance': [],
  'Not Important': []
};