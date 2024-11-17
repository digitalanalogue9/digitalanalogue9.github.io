// src/components/Round/CategoryGrid.tsx
import CategoryColumn from '../CategoryColumn';
import { CategoryGridProps } from './CategoryGridProps';
import { CategoryName, Value } from '@/types';

export function CategoryGrid({
  categories,
  onDrop,
  onMoveWithinCategory,
  onMoveBetweenCategories
}: CategoryGridProps) {
  const categoryNames = Object.keys(categories) as CategoryName[];
  
  return (
    <section 
      aria-label="Value Categories Grid"
      className="w-full flex justify-center px-4"
    >
      <div 
        className="grid w-full max-w-[1600px]"
        style={{ 
          gridTemplateColumns: `repeat(${categoryNames.length}, minmax(300px, 1fr))`,
          gap: '1.5rem', // Reduced gap to allow more space
        }}
        role="grid"
        aria-label="Categories grid layout"
      >
        {(Object.entries(categories) as [CategoryName, Value[]][]).map(([title, cards], index) => (
          <CategoryColumn
            key={title}
            title={title}
            cards={cards}
            onDrop={onDrop}
            onMoveWithinCategory={(fromIndex, toIndex) => 
              onMoveWithinCategory(title, fromIndex, toIndex)
            }
            onMoveBetweenCategories={onMoveBetweenCategories}
            columnIndex={index}
          />
        ))}
      </div>
    </section>
  );
}