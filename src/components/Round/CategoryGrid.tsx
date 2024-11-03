import CategoryColumn from '../CategoryColumn';
import { CategoryGridProps } from './CategoryGridProps';
import { CategoryName, Value } from '@/types';

export function CategoryGrid({
  categories,
  onDrop,
  onMoveCard,
  onMoveBetweenCategories
}: CategoryGridProps) {
  
  const categoryNames = Object.keys(categories) as CategoryName[];
  
  // Dynamic grid columns based on number of categories
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  }[categoryNames.length] || 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5';


  return (
    <div className="w-full flex justify-center">
      <div className={`grid gap-4 auto-cols-fr ${gridColsClass} max-w-7xl mx-auto px-4`}>
      {(Object.entries(categories) as [CategoryName, Value[]][]).map(([title, cards]) => (
          <CategoryColumn
            key={title}
            title={title}
            cards={cards}
            onDrop={onDrop}
            onMoveWithinCategory={(fromIndex, toIndex) => onMoveCard(title, fromIndex, toIndex)}
            onMoveBetweenCategories={onMoveBetweenCategories}
          />
        ))}
      </div>
    </div>
  );
}
