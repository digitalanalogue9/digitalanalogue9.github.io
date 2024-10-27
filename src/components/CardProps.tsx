import { Value } from "@/types/Value";
import { CategoryName } from "@/types/CategoryName";

export interface CardProps {
  value: Value;
  columnIndex?: number;
  currentCategory?: CategoryName;
  onDrop?: (value: Value) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onMoveToCategory?: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => void;
}
