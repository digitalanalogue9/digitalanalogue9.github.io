import { Value, CategoryName } from '@/lib/types';

/** Extends Value type with additional properties needed during drag and drop operations */
export interface DroppedValue extends Value {
  /** Category the value was dragged from */
  sourceCategory?: CategoryName;
  /** Indicates if the drag occurred within the same category */
  isInternalDrag?: boolean;
  /** Original index position in the source category */
  sourceIndex?: number;
}

/** Props for enhanced card controls with expansion capability */
export interface ExtendedCardControlsProps extends CardControlsProps {
  /** Flag indicating if the card is expanded */
  isExpanded?: boolean;
  /** Callback to toggle card expansion */
  onToggleExpand?: () => void;
  /** The value represented by this card */
  value: Value;
}

/** Props for the main Card component */
export interface CardProps {
  /** The value data to display in the card */
  value: Value;
  /** Position index in the column */
  columnIndex?: number;
  /** Current category the card belongs to */
  currentCategory?: CategoryName;
  /** Callback when a value is dropped on this card */
  onDrop?: (value: Value & { sourceCategory?: CategoryName }) => void;
  /** Callback to move card up in its category */
  onMoveUp?: () => void;
  /** Callback to move card down in its category */
  onMoveDown?: () => void;
  /** Callback to move card between categories */
  onMoveBetweenCategories?: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => void;
  /** Callback to update the active drop zone */
  onActiveDropZoneChange?: (category: CategoryName | null) => void;
  /** Callback when card is clicked */
  onClick?: (value: Value) => void;
  /** Flag indicating if card is selected in mobile view */
  selectedMobileCard?: boolean;
}

/** Props for basic card movement controls */
export interface CardControlsProps {
  /** Callback to move card up */
  onMoveUp?: () => void;
  /** Callback to move card down */
  onMoveDown?: () => void;
  /** Callback to show category movement options */
  onShowMoveOptions: () => void;
  /** Current category the card belongs to */
  currentCategory?: CategoryName;
}

/** Props for the card movement options interface */
export interface CardMoveOptionsProps {
  /** The value to be moved */
  value: Value;
  /** Current category of the value */
  currentCategory: CategoryName;
  /** Callback to handle moving between categories */
  onMoveBetweenCategories: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => void;
  /** Callback to close the options interface */
  onClose: () => void;
}

/** Props for mobile-specific card action controls */
export interface MobileCardActionsProps {
  /** The card being acted upon */
  card: Value;
  /** Current category of the card */
  category?: CategoryName;
  /** Callback to move card up */
  onMoveUp?: () => void;
  /** Callback to move card down */
  onMoveDown?: () => void;
  /** Callback to show category movement options */
  onMoveBetweenCategories: () => void;
  /** Flag indicating if upward movement is possible */
  canMoveUp: boolean;
  /** Flag indicating if downward movement is possible */
  canMoveDown: boolean;
}
