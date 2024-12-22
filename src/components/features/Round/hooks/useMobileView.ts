import { useState } from 'react';
import { CategoryName, Value } from "@/lib/types";
/**
 * Custom hook to manage the state of mobile view interactions.
 *
 * @returns {Object} An object containing the state and handlers for mobile view interactions.
 * @returns {CategoryName | null} expandedCategory - The currently expanded category, or null if none is expanded.
 * @returns {boolean} showCategorySelection - A flag indicating whether the category selection is shown.
 * @returns {Value | null} selectedCard - The currently selected card, or null if none is selected.
 * @returns {Function} handleExpandCategory - Handler to expand or collapse a category.
 * @returns {Function} handleCloseExpanded - Handler to close the expanded category.
 * @returns {Function} handleShowCategorySelection - Handler to show the category selection for a specific card.
 * @returns {Function} handleCloseCategorySelection - Handler to close the category selection.
 */
export function useMobileView() {
  const [expandedCategory, setExpandedCategory] = useState<CategoryName | null>(null);
  const [showCategorySelection, setShowCategorySelection] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Value | null>(null);
  const handleExpandCategory = (category: CategoryName) => {
    setExpandedCategory(category === expandedCategory ? null : category);
  };
  const handleCloseExpanded = () => {
    setExpandedCategory(null);
  };
  const handleShowCategorySelection = (card: Value) => {
    setSelectedCard(card);
    setShowCategorySelection(true);
  };
  const handleCloseCategorySelection = () => {
    setShowCategorySelection(false);
    setSelectedCard(null);
  };
  return {
    expandedCategory,
    showCategorySelection,
    selectedCard,
    handleExpandCategory,
    handleCloseExpanded,
    handleShowCategorySelection,
    handleCloseCategorySelection
  };
}