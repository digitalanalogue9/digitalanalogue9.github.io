import { Categories, CategoryName, Value } from "@/lib/types";

/** Props for mobile category list */
export interface MobileCategoryListProps {
    /** List of categories */
    categories: Categories;
    /** Active drop zone */
    activeDropZone: CategoryName | null;
    /** Callback when a card is dropped */
    onDrop: (card: Value, category: CategoryName) => void;
    /** Callback to move a card within a category */
    onMoveWithinCategory: (category: CategoryName, fromIndex: number, toIndex: number) => Promise<void>;
    /** Callback to move a card between categories */
    onMoveBetweenCategories: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => Promise<void>;
    /** Selected card */
    selectedCard: Value | null;
    /** Callback when a card is selected */
    onCardSelect: (card: Value | null) => void;
  }