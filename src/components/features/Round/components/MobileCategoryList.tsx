import { useState } from 'react';
import { Categories, CategoryName, Value } from "@/lib/types";
import { MobileCategoryRow } from './Mobile/MobileCategoryRow';
import { MobileCategoryListProps} from '@/components/features/Round/types';

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
  const handleCategorySelect = (category: CategoryName) => {
    if (selectedCard) {
      setLastDroppedCategory(category);
      onDrop(selectedCard, category);
      onCardSelect(null);
      // Reset the highlight after animation
      setTimeout(() => {
        setLastDroppedCategory(null);
      }, 1000); // 1 second total for the animation
    }
  };
  const handleCategoryTap = (category: CategoryName) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };
  return <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-1 py-1" role="region" aria-label="Categories list">
        <div className="space-y-2"> {/* Removed px-2 since padding is now on parent */}
          {categoryNames.map(category => <div key={category}>
              <MobileCategoryRow category={category} cards={categories[category] ?? []} availableCategories={categoryNames} isActive={activeDropZone === category} isExpanded={expandedCategory === category} onCategoryTap={handleCategoryTap} onCategorySelect={handleCategorySelect} showingCardSelection={!!selectedCard} onMoveWithinCategory={(fromIndex, toIndex) => onMoveWithinCategory(category, fromIndex, toIndex)} onMoveBetweenCategories={onMoveBetweenCategories} lastDroppedCategory={lastDroppedCategory} />
            </div>)}
        </div>
      </div>
    </div>;
}