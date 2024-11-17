'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { CategoryName, Value } from '@/types';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/solid';
import { useState } from 'react';

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
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCardExpansion = (cardId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <motion.div
      layout
      className={`
        rounded-lg border transition-colors duration-200
        ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}
        ${showingCardSelection ? 'z-50 transform' : 'z-0'}
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
            <div className="space-y-2 px-2 pb-2">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  className="bg-yellow-100 rounded-lg shadow-sm" // Changed to yellow background
                  role="listitem"
                >
                  <div className="flex items-center justify-between p-2 gap-2 border-b border-yellow-200"> {/* Added subtle border */}
                    {/* Card Title and Expand Button */}
                    <button
                      onClick={(e) => toggleCardExpansion(card.id, e)}
                      className="flex items-center gap-2 flex-1 text-left"
                      aria-expanded={expandedCards.has(card.id)}
                      aria-label={`${card.title}. Click to ${expandedCards.has(card.id) ? 'collapse' : 'expand'}`}
                    >
                      <ChevronDownIcon
                        className={`w-4 h-4 text-yellow-700 transition-transform flex-shrink-0
            ${expandedCards.has(card.id) ? 'rotate-180' : ''}
          `}
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium text-yellow-900 truncate">
                        {card.title}
                      </span>
                    </button>

                    {/* Controls */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* Category Movement Controls */}
                      <div className="flex items-center gap-1 border-r border-yellow-200 pr-3">
                        {currentCategoryIndex > 0 && (
                          <button
                            onClick={() => onMoveBetweenCategories?.(card, category, availableCategories[currentCategoryIndex - 1])}
                            className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800"
                            aria-label={`Move to ${availableCategories[currentCategoryIndex - 1]}`}
                          >
                            <ArrowUpIcon className="w-4 h-4" />
                          </button>
                        )}
                        {currentCategoryIndex < availableCategories.length - 1 && (
                          <button
                            onClick={() => onMoveBetweenCategories?.(card, category, availableCategories[currentCategoryIndex + 1])}
                            className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800"
                            aria-label={`Move to ${availableCategories[currentCategoryIndex + 1]}`}
                          >
                            <ArrowDownIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Position Movement Controls - keeping these with gray background for contrast */}
                      <div className="flex items-center gap-1">
                        {index > 0 && (
                          <button
                            onClick={() => onMoveWithinCategory?.(index, index - 1)}
                            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200"
                            aria-label="Move up within category"
                          >
                            <ChevronUpIcon className="w-4 h-4" />
                          </button>
                        )}
                        {index < cards.length - 1 && (
                          <button
                            onClick={() => onMoveWithinCategory?.(index, index + 1)}
                            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200"
                            aria-label="Move down within category"
                          >
                            <ChevronDownIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Description */}
                  <AnimatePresence>
                    {expandedCards.has(card.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-3 text-sm text-yellow-800"> {/* Updated text color */}
                          {card.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
