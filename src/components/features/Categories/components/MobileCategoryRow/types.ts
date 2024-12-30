import { CategoryName, Value } from "../../../../../lib/types";

/** Props for mobile category row */
export interface MobileCategoryRowProps {
  /** Name of the category */
  category: CategoryName;
  /** List of cards in the category */
  cards: Value[];
  /** List of available categories */
  availableCategories: CategoryName[];
  /** Flag indicating if the category is active */
  isActive: boolean;
  /** Flag indicating if the category is expanded */
  isExpanded: boolean;
  /** Callback when the category is tapped */
  onCategoryTap: (category: CategoryName) => void;
  /** Callback when the category is selected */
  onCategorySelect: (category: CategoryName) => void;
  /** Flag indicating if card selection is being shown */
  showingCardSelection: boolean;
  /** Callback to move a card within the category */
  onMoveWithinCategory?: (fromIndex: number, toIndex: number) => void;
  /** Callback to move a card between categories */
  onMoveBetweenCategories?: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => Promise<void>;
  /** Last dropped category */
  lastDroppedCategory: CategoryName | null;
}