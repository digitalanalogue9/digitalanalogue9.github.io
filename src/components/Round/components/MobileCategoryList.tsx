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
          className={`p-2 rounded-lg border ${
            isActive ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-xs sm:text-sm truncate"> {/* Smaller font and truncate */}
              {category}
            </span>
            <div className="flex items-center space-x-1"> {/* Reduced spacing */}
              <span className="bg-gray-200 px-1.5 py-0.5 rounded-full text-xs">
                {cards.length}
              </span>
              <button
                onClick={() => onExpand(category)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="w-full space-y-2"> {/* Reduced vertical spacing */}
          {/* First row - Very Important */}
          <div className="w-full">
            <CategoryRow
              category="Very Important"
              cards={categories['Very Important'] ?? []}
              onDrop={onDrop}
              isActive={activeDropZone === 'Very Important'}
              onExpand={onExpand}
            />
          </div>
      
          {/* Second row - Quite Important and Important */}
          <div className="grid grid-cols-2 gap-1"> {/* Reduced gap */}
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
          </div>
      
          {/* Third row - Of Some Importance and Not Important */}
          <div className="grid grid-cols-2 gap-1"> {/* Reduced gap */}
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
        </div>
      );
}
