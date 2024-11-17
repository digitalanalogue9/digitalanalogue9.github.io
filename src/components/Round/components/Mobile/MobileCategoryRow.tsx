// src/components/Round/components/Mobile/MobileCategoryRow.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryName, Value } from '@/types';
import { Card } from '@/components/Card';
import { MobileCardControls } from './MobileCardControls';
interface MobileCategoryRowProps {
  category: CategoryName;
  cards: Value[];
  availableCategories: CategoryName[];
  isActive: boolean;
  isExpanded: boolean;
  onCategoryTap: (category: CategoryName) => void;
  onCategorySelect: (category: CategoryName) => void;
  showingCardSelection: boolean;
  onMoveWithinCategory?: (fromIndex: number, toIndex: number) => void;
  onMoveBetweenCategories?: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => Promise<void>;
}

export function MobileCategoryRow({
  category,
  cards,
  availableCategories,
  isActive,
  isExpanded,
  onCategoryTap,
  onCategorySelect,
  showingCardSelection,
  onMoveWithinCategory,
  onMoveBetweenCategories
}: MobileCategoryRowProps) {
  const currentCategoryIndex = availableCategories.indexOf(category);
  const categoryId = `category-${category.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <motion.div 
      layout
      className={`
        rounded-lg border transition-colors duration-200
        ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}
        ${showingCardSelection ? 'z-50 transform scale-105 shadow-lg' : 'z-0'}
      `}
      role="region"
      aria-labelledby={categoryId}
    >
      <button
        onClick={() => showingCardSelection ? onCategorySelect(category) : onCategoryTap(category)}
        className="w-full p-4"
        aria-expanded={isExpanded}
        aria-controls={`${categoryId}-content`}
        aria-label={`${category} category with ${cards.length} cards${showingCardSelection ? '. Tap to select' : ''}`}
      >
        <div className="flex items-center justify-between">
          <h3 
            id={categoryId}
            className="font-medium"
          >
            {category}
          </h3>
          <span 
            className="bg-gray-200 px-2 py-1 rounded-full text-sm"
            aria-label={`${cards.length} cards`}
          >
            {cards.length}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && !showingCardSelection && cards.length > 0 && (
          <motion.div
            id={`${categoryId}-content`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
            role="list"
            aria-label={`Cards in ${category}`}
          >
            <div className="space-y-4 pb-4">
              {cards.map((card, index) => (
                <div 
                  key={card.id} 
                  className="bg-white rounded-lg shadow-sm mx-4"
                  role="listitem"
                >
                  <div className="p-4">
                    <Card 
                      value={card}
                      aria-label={`${card.title} in ${category}`}
                    />
                  </div>
                  <MobileCardControls
                    canMoveUp={index > 0}
                    canMoveDown={index < cards.length - 1}
                    onMoveUp={() => onMoveWithinCategory?.(index, index - 1)}
                    onMoveDown={() => onMoveWithinCategory?.(index, index + 1)}
                    canMoveToPrevCategory={currentCategoryIndex > 0}
                    canMoveToNextCategory={currentCategoryIndex < availableCategories.length - 1}
                    onMoveToPrevCategory={() => 
                      onMoveBetweenCategories?.(card, category, availableCategories[currentCategoryIndex - 1])
                    }
                    onMoveToNextCategory={() => 
                      onMoveBetweenCategories?.(card, category, availableCategories[currentCategoryIndex + 1])
                    }
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
