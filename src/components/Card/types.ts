import { Value, CategoryName } from "@/types";

export interface CardProps {
  value: Value;
  columnIndex?: number;
  currentCategory?: CategoryName;
  onDrop?: (value: Value & { sourceCategory?: CategoryName }) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onMoveToCategory?: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => void;
}

export interface CardControlsProps {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onShowMoveOptions: () => void;
  currentCategory?: CategoryName;
}

export interface CardMoveOptionsProps {
  value: Value;
  currentCategory: CategoryName;
  onMoveToCategory: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => void;
  onClose: () => void;
}

export interface CardContentProps {
  title: string;
  description: string;
  isExpanded: boolean;
  onToggle: () => void;
}
