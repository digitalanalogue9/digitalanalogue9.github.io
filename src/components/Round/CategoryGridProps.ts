// src/components/Round/CategoryGridProps.ts
import { CategoryName, Categories, Value } from '@/types';

export interface CategoryGridProps {
  categories: Categories;
  onDrop: (value: Value, category: CategoryName) => Promise<void>;
  onMoveWithinCategory: (category: CategoryName, fromIndex: number, toIndex: number) => Promise<void>;
  onMoveBetweenCategories: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => Promise<void>;
}
