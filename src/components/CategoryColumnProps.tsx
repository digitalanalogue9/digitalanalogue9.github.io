import { CategoryName } from "@/types/CategoryName";
import { Value } from "@/types/Value";

export interface CategoryColumnProps {
  title: CategoryName;
  cards: Value[];
  onDrop: (value: Value, category: CategoryName) => Promise<void>;
  onMoveWithinCategory: (fromIndex: number, toIndex: number) => Promise<void>;
  onMoveBetweenCategories: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => Promise<void>;
}
