import { useState } from 'react';
import { CategoryName, Value } from "../../../../../lib/types";
import { MobileCategoryRow } from '../MobileCategoryRow';
import { MobileCategoryListProps} from './types';
import { useMobileInteractions } from '../hooks/useMobileInteractions';

/**
 * Component for rendering a list of categories in a mobile-friendly view.
 */
export function MobileCategoryList({
  categories,
  activeDropZone,
  onDrop,
  onMoveWithinCategory,
  onMoveBetweenCategories,
  selectedCard,
  onCardSelect
}: MobileCategoryListProps) {
  const [expandedCategory, setExpandedCategory] = useState<CategoryName | null>(null);
  const categoryNames = Object.keys(categories) as CategoryName[];
  const [lastDroppedCategory, setLastDroppedCategory] = useState<CategoryName | null>(null);
  const { handleExpand } = useMobileInteractions();
  const handleCategorySelect = (category: CategoryName) => {
    if (selectedCard) {
      setLastDroppedCategory(category);
      onDrop(selectedCard, category);
      onCardSelect(null);
      setExpandedCategory(category)
      // Reset the highlight after animation
      setTimeout(() => {
        setLastDroppedCategory(null);
      }, 1000); // 1 second total for the animation
    }
  };
  const handleCategoryTap = (category: CategoryName) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleMoveBetweenCategories = async (card: Value, fromCategory: CategoryName, toCategory: CategoryName): Promise<void> => {
    if (onMoveBetweenCategories) {
      onMoveBetweenCategories(card, fromCategory, toCategory);
    }
    setExpandedCategory(toCategory)
    handleExpand(toCategory);
  };

  return <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-1 py-1" role="region" aria-label="Categories list">
        <div className="space-y-2"> {/* Removed px-2 since padding is now on parent */}
          {categoryNames.map(category => <div key={category}>
              <MobileCategoryRow category={category} cards={categories[category] ?? []} availableCategories={categoryNames} isActive={activeDropZone === category} isExpanded={expandedCategory === category} onCategoryTap={handleCategoryTap} onCategorySelect={handleCategorySelect} showingCardSelection={!!selectedCard} onMoveWithinCategory={(fromIndex, toIndex) => onMoveWithinCategory(category, fromIndex, toIndex)} onMoveBetweenCategories={handleMoveBetweenCategories} lastDroppedCategory={lastDroppedCategory} />
            </div>)}
        </div>
      </div>
    </div>;
}