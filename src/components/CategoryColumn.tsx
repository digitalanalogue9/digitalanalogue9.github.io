// src/components/CategoryColumn.tsx
import { Value, CategoryName } from '@/types';
import { AnimatedCard } from './Card';

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
  // Add drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-gray-50');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-50');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-50');
    
    try {
      const data = e.dataTransfer.getData('text/plain');
      let droppedValue: Value;

      try {
        // First try to parse as JSON
        droppedValue = JSON.parse(data);
      } catch {
        // If JSON parsing fails, try to use the data directly
        if (typeof data === 'string') {
          droppedValue = {
            id: data,
            title: data,
            description: ''
          };
        } else {
          throw new Error('Invalid drop data format');
        }
      }

      if (droppedValue) {
        onDrop(droppedValue, title);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-4 transition-colors duration-200 min-w-[320px]"
      data-category={title}
      role="region"
      aria-label={`${title} category column`}
    >
      <h2 
        className="text-lg font-semibold mb-4 text-gray-900"
        id={`category-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {title}
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({cards.length})
        </span>
      </h2>
      
      <div 
        className="border-2 border-dashed border-gray-200 rounded-lg p-2 min-h-[400px]"
        role="list"
        aria-labelledby={`category-${title.toLowerCase().replace(/\s+/g, '-')}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-2">
          {cards.map((card, index) => (
            <div 
              key={card.id}
              role="listitem"
              className="transition-all duration-200"
            >
              <AnimatedCard
                value={card}
                columnIndex={index}
                currentCategory={title}
                onDrop={(value) => onDrop(value, title)}
                onMoveUp={index > 0 ? () => onMoveWithinCategory(index, index - 1) : undefined}
                onMoveDown={index < cards.length - 1 ? () => onMoveWithinCategory(index, index + 1) : undefined}
                onMoveBetweenCategories={(value, fromCategory, toCategory) => 
                  onMoveBetweenCategories(value, fromCategory, toCategory)
                }
              />
            </div>
          ))}
        </div>
        
        <div 
          className={`text-gray-400 text-sm text-center py-4 mt-2 ${cards.length === 0 ? '' : 'border-t-2 border-dashed border-gray-200'}`}
          role="status"
        >
          Drop values here
        </div>
      </div>
    </div>
  );
}
