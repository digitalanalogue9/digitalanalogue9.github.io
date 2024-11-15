import { Categories, CategoryName, Value } from '@/types';

interface MobileCategoryListProps {
    categories: Categories;
    onDrop: (card: Value, category: CategoryName) => void;
    onExpand: (category: CategoryName) => void;
    activeDropZone: CategoryName | null;
}

interface CategoryRowProps {
    category: CategoryName;
    cards: Value[];
    onDrop: (card: Value, category: CategoryName) => void;
    isActive: boolean;
    onExpand: (category: CategoryName) => void;
}

function CategoryRow({
  category,
  cards,
  onDrop,
  isActive,
  onExpand
}: CategoryRowProps) {
  return (
      <div 
        data-category={category}
        className={`p-4 rounded-lg border transition-all duration-200 min-h-[60px] ${
          isActive 
            ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200 ring-opacity-50' 
            : 'bg-white border-gray-200'
        }`}
        onTouchEnd={(e) => {
          if (isActive) {
            e.preventDefault();
            // The actual drop will be handled by the drag-and-drop system
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isActive && (
              <span className="text-blue-500 animate-pulse">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 4v16m8-8H4" />
                </svg>
              </span>
            )}
            <span className="font-medium text-sm truncate">
              {category}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">
              {cards.length}
            </span>
            <button
              onClick={() => onExpand(category)}
              className="p-1.5 rounded-full hover:bg-gray-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
  );
}

export function MobileCategoryList({
  categories,
  onDrop,
  onExpand,
  activeDropZone
}: MobileCategoryListProps) {
  return (
      <div className="w-full flex flex-col gap-3 p-4 pb-8"> 
        <CategoryRow
          category="Very Important"
          cards={categories['Very Important'] ?? []}
          onDrop={onDrop}
          isActive={activeDropZone === 'Very Important'}
          onExpand={onExpand}
        />
        
        <CategoryRow
          category="Quite Important"
          cards={categories['Quite Important'] ?? []}
          onDrop={onDrop}
          isActive={activeDropZone === 'Quite Important'}
          onExpand={onExpand}
        />
        
        <CategoryRow
          category="Important"
          cards={categories['Important'] ?? []}
          onDrop={onDrop}
          isActive={activeDropZone === 'Important'}
          onExpand={onExpand}
        />
        
        <CategoryRow
          category="Of Some Importance"
          cards={categories['Of Some Importance'] ?? []}
          onDrop={onDrop}
          isActive={activeDropZone === 'Of Some Importance'}
          onExpand={onExpand}
        />
        
        <CategoryRow
          category="Not Important"
          cards={categories['Not Important'] ?? []}
          onDrop={onDrop}
          isActive={activeDropZone === 'Not Important'}
          onExpand={onExpand}
        />
      </div>
  );
}
