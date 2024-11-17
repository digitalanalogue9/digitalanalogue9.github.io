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
    <div className="relative">
      <div className={`w-full flex flex-col gap-3 p-4 transition-all duration-200
        ${selectedCard ? 'relative z-30 opacity-100' : 'opacity-100'}`}
      > 
        {categoryNames.map(category => (
          <MobileCategoryRow
            key={category}
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
        ))}
      </div>

      <MobileSelectionOverlay isVisible={!!selectedCard} />
    </div>
  );
}
