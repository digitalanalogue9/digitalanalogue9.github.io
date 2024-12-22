import { useState } from 'react';
import { Categories, CategoryName, Value } from "@/lib/types";
import { MobileCategoryRow } from './Mobile/MobileCategoryRow';
import { MobileCategoryListProps} from '@/components/features/Round/types';

/**
 * Component for rendering a list of categories in a mobile-friendly view.
 * 
 * @param {Object} props - The properties object.
 * @param {Record<CategoryName, Card[]>} props.categories - An object containing the categories and their associated cards.
 * @param {CategoryName | null} props.activeDropZone - The currently active drop zone category.
 * @param {Function} props.onDrop - Callback function to handle dropping a card into a category.
 * @param {Function} props.onMoveWithinCategory - Callback function to handle moving a card within the same category.
 * @param {Function} props.onMoveBetweenCategories - Callback function to handle moving a card between different categories.
 * @param {Card | null} props.selectedCard - The currently selected card.
 * @param {Function} props.onCardSelect - Callback function to handle selecting a card.
 * 
 * @returns {JSX.Element} The rendered component.
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