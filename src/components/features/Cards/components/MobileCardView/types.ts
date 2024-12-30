import { Categories, CategoryName, Value } from "../../../../../lib/types";

/** Props for mobile card view */
export interface MobileCardViewProps {
    /** List of cards */
    cards: Value[];
    /** Categorized cards */
    categorizedCards: Categories;
    /** Callback when a card is placed */
    onCardPlace: (card: Value, category: CategoryName) => void;
  }
  