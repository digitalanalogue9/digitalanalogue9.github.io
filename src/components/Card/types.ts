import { Value, CategoryName } from "@/types";

export interface CardProps {
  value: Value;
  columnIndex?: number;
  currentCategory?: CategoryName;
  onDrop?: (value: Value & { sourceCategory?: CategoryName }) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onMoveBetweenCategories?: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => void;
  onActiveDropZoneChange?: (category: CategoryName | null) => void;
  onClick?: (value: Value) => void; // Added for mobile interaction
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
  onMoveBetweenCategories: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => void;
  onClose: () => void;
}

export interface CardContentProps {
  title: string;
  description: string;
  isExpanded: boolean;
  controls?: React.ReactNode;
}
