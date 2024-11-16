import { useState } from 'react';
import { Categories, CategoryName, Value } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/Card';

interface MobileCategoryRowProps {
  category: CategoryName;
  cards: Value[];
  isActive: boolean;
  isExpanded: boolean;
  onCategoryTap: (category: CategoryName) => void;
  onCategorySelect: (category: CategoryName) => void;
  showingCardSelection: boolean;
}

interface MobileCategoryListProps {
  categories: Categories;
  unassignedCards: Value[];
  activeDropZone: CategoryName | null;
  onDrop: (card: Value, category: CategoryName) => void;
  onMoveWithinCategory: (category: CategoryName, fromIndex: number, toIndex: number) => Promise<void>;
  onMoveBetweenCategories: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => Promise<void>;
}

function MobileCategoryRow({
  category,
  cards,
  isActive,
  isExpanded,
  onCategoryTap,
  onCategorySelect,
  showingCardSelection
}: MobileCategoryRowProps) {
  return (
    <motion.div 
      layout
      className={`
        rounded-lg border transition-colors duration-200
        ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}
        ${showingCardSelection ? 'opacity-90 hover:opacity-100' : ''}
      `}
    >
      <button
        onClick={() => showingCardSelection ? onCategorySelect(category) : onCategoryTap(category)}
        className="w-full p-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{category}</h3>
          <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">
            {cards.length}
          </span>
        </div>
      </button>
      <AnimatePresence>
        {isExpanded && !showingCardSelection && cards.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {cards.map((card) => (
                <div key={card.id} className="p-2 bg-white rounded shadow-sm">
                  <Card value={card} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function MobileCategoryList({
  categories,
  unassignedCards,
  activeDropZone,
  onDrop,
  onMoveWithinCategory,
  onMoveBetweenCategories
}: MobileCategoryListProps) {
  const [expandedCategory, setExpandedCategory] = useState<CategoryName | null>(null);
  const [selectedCard, setSelectedCard] = useState<Value | null>(null);

  const handleCardSelect = (card: Value) => {
    setSelectedCard(card);
  };

  const handleCategorySelect = (category: CategoryName) => {
    if (selectedCard) {
      onDrop(selectedCard, category);
      setSelectedCard(null);
    }
  };

  const handleCategoryTap = (category: CategoryName) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="relative">
      {/* Main game card */}
      {!selectedCard && unassignedCards.length > 0 && (
        <div className="p-4 mb-4">
          <div 
            onClick={() => handleCardSelect(unassignedCards[0])}
            className="cursor-pointer active:scale-95 transition-transform"
          >
            <Card value={unassignedCards[0]} />
          </div>
        </div>
      )}

      {/* Category List */}
      <div className={`w-full flex flex-col gap-3 p-4 transition-opacity duration-200
        ${selectedCard ? 'opacity-90' : ''}`}
      > 
        {(['Very Important', 'Quite Important', 'Important', 'Of Some Importance', 'Not Important'] as CategoryName[]).map(category => (
          <MobileCategoryRow
            key={category}
            category={category}
            cards={categories[category] ?? []}
            isActive={activeDropZone === category}
            isExpanded={expandedCategory === category}
            onCategoryTap={handleCategoryTap}
            onCategorySelect={handleCategorySelect}
            showingCardSelection={!!selectedCard}
          />
        ))}
      </div>

      {/* Selection Mode Overlay */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 pointer-events-none">
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
            <p>Tap a category to place the card</p>
          </div>
        </div>
      )}
    </div>
  );
}
