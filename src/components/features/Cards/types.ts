import { Value, CategoryName } from "@/lib/types";

export interface DroppedValue extends Value {
  sourceCategory?: CategoryName;
  isInternalDrag?: boolean;
  sourceIndex?: number;
}

export interface ExtendedCardControlsProps extends CardControlsProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  value: Value;
}

export interface CardProps {
  value: Value;
  columnIndex?: number;
  currentCategory?: CategoryName;
  onDrop?: (value: Value & { sourceCategory?: CategoryName }) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onMoveBetweenCategories?: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => void;
  onActiveDropZoneChange?: (category: CategoryName | null) => void;
  onClick?: (value: Value) => void;
  selectedMobileCard?: boolean;
}

export interface CardContentProps {
  title: string;
  description: string;
  isExpanded: boolean;
  controls?: React.ReactNode;
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

export interface MobileCardActionsProps {
  card: Value;
  category?: CategoryName;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onMoveBetweenCategories: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}
