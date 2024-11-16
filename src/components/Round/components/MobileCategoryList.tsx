// src/components/Round/components/MobileCategoryList.tsx
import { Categories, CategoryName, Value } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileCardView } from './MobileCardView';

interface MobileCategoryRowProps {
  category: CategoryName;
  cards: Value[];
  isActive: boolean;
  onExpand: (category: CategoryName) => void;
  onMoveWithinCategory?: (fromIndex: number, toIndex: number) => void;
}

interface MobileCategoryListProps {
  categories: Categories;
  activeDropZone: CategoryName | null;
  onExpand: (category: CategoryName) => void;
  onDrop: (card: Value, category: CategoryName) => void;
  expandedCategory: CategoryName | null;
  onClose: () => void;
  onMoveWithinCategory: (category: CategoryName, fromIndex: number, toIndex: number) => Promise<void>;
  onMoveBetweenCategories: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => Promise<void>;
}

function MobileCategoryRow({
  category,
  cards,
  isActive,
  onExpand,
  onMoveWithinCategory
}: MobileCategoryRowProps) {
  return (
    <motion.div 
      layout
      className={`
        p-4 rounded-lg border transition-colors duration-200
        ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{category}</h3>
        <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">
          {cards.length}
        </span>
      </div>
      {cards.length > 0 && (
        <div className="space-y-2 mb-2">
          {cards.map((card, index) => (
            <div 
              key={card.id}
              className="p-2 bg-yellow-50 rounded flex justify-between items-center"
            >
              <span className="text-sm truncate">{card.title}</span>
              <div className="flex space-x-1">
                {index > 0 && (
                  <button
                    onClick={() => onMoveWithinCategory?.(index, index - 1)}
                    className="p-1 hover:bg-yellow-100 rounded"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                )}
                {index < cards.length - 1 && (
                  <button
                    onClick={() => onMoveWithinCategory?.(index, index + 1)}
                    className="p-1 hover:bg-yellow-100 rounded"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => onExpand(category)}
        className="text-blue-600 text-sm hover:text-blue-800 transition-colors"
      >
        View Cards
      </button>
    </motion.div>
  );
}

export function MobileCategoryList({
  categories,
  activeDropZone,
  onExpand,
  onDrop,
  expandedCategory,
  onClose,
  onMoveWithinCategory,
  onMoveBetweenCategories
}: MobileCategoryListProps) {
  return (
    <>
      <div className="w-full flex flex-col gap-3 p-4 pb-8"> 
        {(['Very Important', 'Quite Important', 'Important', 'Of Some Importance', 'Not Important'] as CategoryName[]).map(category => (
          <MobileCategoryRow
            key={category}
            category={category}
            cards={categories[category] ?? []}
            isActive={activeDropZone === category}
            onExpand={onExpand}
            onMoveWithinCategory={(fromIndex, toIndex) => 
              onMoveWithinCategory(category, fromIndex, toIndex)
            }
          />
        ))}
      </div>

      <AnimatePresence>
        {expandedCategory && (
          <MobileCardView
            category={expandedCategory}
            cards={categories[expandedCategory] ?? []}
            onClose={onClose}
            onMoveCard={(card, toCategory) => 
              onMoveBetweenCategories(card, expandedCategory, toCategory)
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}
