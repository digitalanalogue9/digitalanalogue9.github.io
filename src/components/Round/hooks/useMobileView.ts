import { useState } from 'react';
import { CategoryName, Value } from '@/types';

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
    handleCloseCategorySelection,
  };
}
