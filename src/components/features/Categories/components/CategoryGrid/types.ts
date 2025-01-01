import { Categories, CategoryName, Value } from '@/lib/types';

/** Props for category grid */
export interface CategoryGridProps {
  /** List of categories */
  categories: Categories;
  /** Callback when a card is dropped */
  onDrop: (value: Value, category: CategoryName) => Promise<void>;
  /** Callback to move a card within a category */
  onMoveWithinCategory: (category: CategoryName, fromIndex: number, toIndex: number) => Promise<void>;
  /** Callback to move a card between categories */
  onMoveBetweenCategories: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => Promise<void>;
}
