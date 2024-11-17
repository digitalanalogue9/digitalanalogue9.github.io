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
      className="w-full flex justify-center"
    >
      <div 
        className="grid gap-10 w-full max-w-[1600px] mx-auto px-4"
        style={{ 
          gridTemplateColumns: `repeat(${categoryNames.length}, minmax(320px, 1fr))`,
          gridAutoFlow: 'dense'
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
