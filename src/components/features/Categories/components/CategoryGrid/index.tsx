// src/components/Round/CategoryGrid.tsx
import CategoryColumn from "@/components/features/Categories/components/CategoryColumn";
import { CategoryGridProps } from './types';
import { CategoryName, Value } from "@/lib/types";

/**
 * Renders a grid of categories, each containing a list of values.
 */
export function CategoryGrid({
  categories,
  onDrop,
  onMoveWithinCategory,
  onMoveBetweenCategories
}: CategoryGridProps) {
  const categoryNames = Object.keys(categories) as CategoryName[];
  return <section className="w-full flex justify-center px-4">
      <div className="grid w-full max-w-[1600px]" style={{
      gridTemplateColumns: `repeat(${categoryNames.length}, minmax(300px, 1fr))`,
      gap: '1.5rem' // Reduced gap to allow more space
    }} aria-label="Value Categories Grid" >
        {(Object.entries(categories) as [CategoryName, Value[]][]).map(([title, cards], index) => <CategoryColumn key={title} title={title} cards={cards} onDrop={onDrop} onMoveWithinCategory={(fromIndex, toIndex) => onMoveWithinCategory(title, fromIndex, toIndex)} onMoveBetweenCategories={onMoveBetweenCategories} columnIndex={index} />)}
      </div>
    </section>;
}