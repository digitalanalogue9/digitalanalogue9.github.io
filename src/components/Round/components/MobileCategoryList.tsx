import { useState } from 'react';
import { Categories, CategoryName, Value } from '@/types';
import { MobileCategoryRow } from './Mobile/MobileCategoryRow';
import { MobileSelectionOverlay } from './Mobile/MobileSelectionOverlay';

interface MobileCategoryListProps {
  categories: Categories;
  activeDropZone: CategoryName | null;
  onDrop: (card: Value, category: CategoryName) => void;
  onMoveWithinCategory: (category: CategoryName, fromIndex: number, toIndex: number) => Promise<void>;
  onMoveBetweenCategories: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => Promise<void>;
  selectedCard: Value | null;
  onCardSelect: (card: Value | null) => void;
}

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

  const handleCategorySelect = (category: CategoryName) => {
    if (selectedCard) {
      onDrop(selectedCard, category);
      onCardSelect(null);
    }
  };

  const handleCategoryTap = (category: CategoryName) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="h-full flex flex-col">
      <div
        className="flex-1 overflow-y-auto px-1" // Changed from -mx-2 to px-3
        role="region"
        aria-label="Categories list"
      >
        <div className="space-y-2"> {/* Removed px-2 since padding is now on parent */}
          {categoryNames.map(category => (
            <div
              key={category}
              className={`
                transition-all duration-200
                ${selectedCard ? 'transform scale-105 shadow-lg' : ''}
              `}
            >
              <MobileCategoryRow
                category={category}
                cards={categories[category] ?? []}
                availableCategories={categoryNames}
                isActive={activeDropZone === category}
                isExpanded={expandedCategory === category}
                onCategoryTap={handleCategoryTap}
                onCategorySelect={handleCategorySelect}
                showingCardSelection={!!selectedCard}
                onMoveWithinCategory={(fromIndex, toIndex) =>
                  onMoveWithinCategory(category, fromIndex, toIndex)
                }
                onMoveBetweenCategories={onMoveBetweenCategories}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}

