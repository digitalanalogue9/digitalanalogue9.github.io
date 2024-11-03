import { Categories, CategoryName, Value } from '@/types';

interface MobileCategoryListProps {
  categories: Categories;
  onDrop: (card: Value, category: CategoryName) => void; // Changed order here to match handleDrop
  onExpand: (category: CategoryName) => void;
  activeDropZone: CategoryName | null;
}

export function MobileCategoryList({ 
  categories, 
  onDrop, 
  onExpand,
  activeDropZone 
}: MobileCategoryListProps) {
  return (
    <div className="space-y-2">
      {Object.entries(categories).map(([category, cards = []]) => (
        <div 
          key={category}
          className={`flex items-center justify-between p-3 rounded-lg border ${
            activeDropZone === category 
              ? 'bg-blue-100 border-blue-500' 
              : 'bg-white border-gray-200'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            try {
              const cardData: Value = JSON.parse(e.dataTransfer.getData('text/plain'));
              onDrop(cardData, category as CategoryName); // Changed order here to match interface
            } catch (error) {
              console.error('Failed to parse card data:', error);
            }
          }}
        >
          <span className="font-medium">{category}</span>
          <div className="flex items-center space-x-2">
            <span className="bg-gray-200 px-2 py-1 rounded-full text-sm text-gray-600">
              {cards.length}
            </span>
            <button
              onClick={() => onExpand(category as CategoryName)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
