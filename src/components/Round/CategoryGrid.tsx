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
    <div className="w-full flex justify-center">
      <div className={`grid gap-10 w-full max-w-[1400px] mx-auto px-4`} 
           style={{ 
             gridTemplateColumns: `repeat(${categoryNames.length}, minmax(280px, 1fr))`,
             gridAutoFlow: 'dense'
           }}>
        {(Object.entries(categories) as [CategoryName, Value[]][]).map(([title, cards]) => (
          <CategoryColumn
            key={title}
            title={title}
            cards={cards}
            onDrop={onDrop}
            onMoveWithinCategory={(fromIndex, toIndex) => onMoveWithinCategory(title, fromIndex, toIndex)}
            onMoveBetweenCategories={onMoveBetweenCategories}
          />
        ))}
      </div>
    </div>
  );
}
