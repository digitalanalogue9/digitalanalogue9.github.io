// src/components/CategoryColumn.tsx
import { Value, CategoryName } from '@/types';
import { Card } from './Card';  // Change this import

interface CategoryColumnProps {
  title: CategoryName;
  cards: Value[];
  onDrop: (value: Value, category: CategoryName) => void;
  onMoveWithinCategory: (fromIndex: number, toIndex: number) => void;
  onMoveBetweenCategories: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => void;
  columnIndex?: number;
}

export default function CategoryColumn({
  title,
  cards,
  onDrop,
  onMoveWithinCategory,
  onMoveBetweenCategories,
  columnIndex
}: CategoryColumnProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('bg-gray-50');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-gray-50');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-gray-50');

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));

      // If dropping into the same category
      if (data.sourceCategory === title) {
        const fromIndex = data.sourceIndex;
        const toIndex = cards.length; // Drop at the end
        onMoveWithinCategory(fromIndex, toIndex);
      }
      // If dropping from another category
      else if (data.sourceCategory) {
        onMoveBetweenCategories(
          { id: data.id, title: data.title, description: data.description },
          data.sourceCategory,
          title
        );
      }
      // If dropping a new card
      else {
        onDrop({ id: data.id, title: data.title, description: data.description }, title);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm p-4 transition-colors duration-200 w-full"
      data-category={title}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center justify-between w-full">
          <span>{title}</span>
          <span className="bg-gray-100 rounded-full px-2.5 py-0.5 text-sm font-medium text-gray-600 ml-2">
            {cards.length}
          </span>
        </h2>
      </div>

      <div
        className="border-2 border-dashed border-gray-200 rounded-lg p-2 min-h-[400px] transition-colors duration-200"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="region"
        aria-label={`Drop zone for ${title} category`}
      >
        <div className="space-y-2">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="transition-all duration-200"
            >
              <Card
                value={card}
                columnIndex={index}
                currentCategory={title}
                onDrop={(value) => onDrop(value, title)}
                onMoveUp={index > 0 ? () => onMoveWithinCategory(index, index - 1) : undefined}
                onMoveDown={index < cards.length - 1 ? () => onMoveWithinCategory(index, index + 1) : undefined}
                onMoveBetweenCategories={onMoveBetweenCategories}
              />
            </div>
          ))}
        </div>

        <div className={`text-gray-400 text-sm text-center py-4 mt-2 ${cards.length === 0 ? '' : 'border-t-2 border-dashed border-gray-200'}`}>
          Drop values here
        </div>
      </div>
    </div>
  );
}