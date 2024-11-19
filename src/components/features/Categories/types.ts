// Generated types file

import { CategoryName,Value } from "@/lib/types";

export interface CategoryColumnProps {
  title: CategoryName;
  cards: Value[];
  onDrop: (value: Value, category: CategoryName) => void;
  onMoveWithinCategory: (fromIndex: number, toIndex: number) => void;
  onMoveBetweenCategories: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => void;
  columnIndex?: number;
}
export interface CategorySelectionOverlayProps {
  onCategorySelect: (category: CategoryName) => void;
  isVisible: boolean;
  instruction?: string;
}

