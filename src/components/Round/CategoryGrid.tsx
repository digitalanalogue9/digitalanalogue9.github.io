import CategoryColumn from '../CategoryColumn';
import { CategoryGridProps } from './types';
import { CategoryName, Value } from '@/types';

export function CategoryGrid({
  categories,
  onDrop,
  onMoveCard,
  onMoveBetweenCategories
}: CategoryGridProps) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-4">
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
  );
}
