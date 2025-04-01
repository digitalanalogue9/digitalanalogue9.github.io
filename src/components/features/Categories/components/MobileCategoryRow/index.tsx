'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CategoryName, Value } from '@/lib/types';
import { ChevronDownIcon, ChevronUpIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { MobileCategoryRowProps } from './types';
import { useMobileInteractions } from '@/components/features/Categories/components/hooks/useMobileInteractions';

/**
 * Component representing a row of categories in a mobile view.
 */
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
  onMoveBetweenCategories,
  lastDroppedCategory,
}: MobileCategoryRowProps) {
  const currentCategoryIndex = availableCategories.indexOf(category);
  const categoryId = `category-${category.toLowerCase().replace(/\s+/g, '-')}`;
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const { handleExpand } = useMobileInteractions();

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
  const handleMoveBetweenCategories = (card: Value, fromCategory: CategoryName, toCategory: CategoryName) => {
    if (onMoveBetweenCategories) {
      onMoveBetweenCategories(card, fromCategory, toCategory);
    }
    handleExpand(toCategory);
  };
  return (
    <motion.div
      layout
      className={`border-1 rounded-lg transition-all duration-300 ${isActive || lastDroppedCategory === category ? 'bg-green-50' : 'bg-white'} ${showingCardSelection ? 'z-50 cursor-pointer border-black shadow-md' : 'z-0 border-transparent hover:border-gray-200'} `}
      role="region"
      aria-labelledby={categoryId}
    >
      <button
        type="button"
        onClick={() => (showingCardSelection ? onCategorySelect(category) : onCategoryTap(category))}
        className="w-full bg-gray-200 p-4 hover:bg-gray-300"
        aria-expanded={isExpanded}
        aria-controls={`${categoryId}-content`}
        aria-label={`${category} category with ${cards.length} cards${showingCardSelection ? '. Tap to select' : ''}`}
      >
        <div className="flex items-center justify-between">
          <h3 id={categoryId} className="font-medium">
            {category}
          </h3>
          <span
            className="rounded-full bg-gray-200 px-2 py-1 text-sm text-black hover:bg-gray-300"
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
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: 'auto',
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            className="overflow-hidden"
            role="list"
            aria-label={`Cards in ${category}`}
          >
            <div className="mt-1 space-y-2 px-2 pb-2" role="list">
              {cards.map((card, index) => (
                <div key={card.id} className="rounded-lg bg-yellow-100 shadow-sm" role="listitem">
                  <div className="flex items-center justify-between gap-2 border-b border-yellow-200 p-2">
                    {/* Card Title and Expand Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleCardExpansion(card.id, e)}
                      className="flex min-w-0 items-center gap-2 bg-yellow-100 text-left text-black hover:bg-yellow-100"
                      aria-expanded={expandedCards.has(card.id)}
                      aria-controls={`${categoryId}-content`}
                      aria-label={`${card.title}. Click to ${expandedCards.has(card.id) ? 'collapse' : 'expand'}`}
                    >
                      <ChevronDownIcon
                        className={`h-4 w-4 flex-shrink-0 bg-yellow-100 text-black transition-transform ${expandedCards.has(card.id) ? 'rotate-180' : ''} `}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 max-w-[200px] break-words bg-yellow-100 text-sm font-medium text-black">
                        {card.title}
                      </span>
                    </button>

                    {/* Controls */}
                    <div className="ml-auto flex flex-shrink-0 items-center gap-3">
                      {/* Category Movement Controls */}
                      <div className="flex items-center gap-1 border-r border-yellow-200 pr-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleMoveBetweenCategories(card, category, availableCategories[currentCategoryIndex - 1])
                          }
                          className={`rounded-full bg-blue-100 p-1.5 text-blue-800 hover:bg-blue-200 ${
                            currentCategoryIndex > 0 ? 'visible' : 'invisible'
                          }`}
                          aria-label={`Move to ${availableCategories[currentCategoryIndex - 1]}`}
                          disabled={currentCategoryIndex === 0}
                        >
                          <ArrowUpIcon className="h-4 w-4 text-black" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleMoveBetweenCategories(card, category, availableCategories[currentCategoryIndex + 1])
                          }
                          className={`rounded-full bg-blue-100 p-1.5 text-blue-800 hover:bg-blue-200 ${
                            currentCategoryIndex < availableCategories.length - 1 ? 'visible' : 'invisible'
                          }`}
                          aria-label={`Move to ${availableCategories[currentCategoryIndex + 1]}`}
                          disabled={currentCategoryIndex === availableCategories.length - 1}
                        >
                          <ArrowDownIcon className="h-4 w-4 text-black" />
                        </button>
                      </div>

                      {/* Position Movement Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onMoveWithinCategory?.(index, index - 1)}
                          className={`rounded-full bg-gray-100 p-1.5 text-black hover:bg-gray-200 ${
                            index > 0 ? 'visible' : 'invisible'
                          }`}
                          aria-label="Move up within category"
                          disabled={index === 0}
                        >
                          <ChevronUpIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onMoveWithinCategory?.(index, index + 1)}
                          className={`rounded-full bg-gray-100 p-1.5 text-black hover:bg-gray-200 ${
                            index < cards.length - 1 ? 'visible' : 'invisible'
                          }`}
                          aria-label="Move down within category"
                          disabled={index === cards.length - 1}
                        >
                          <ChevronDownIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Description */}
                  <AnimatePresence>
                    {expandedCards.has(card.id) && (
                      <motion.div
                        id={`${categoryId}-content`}
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: 'auto',
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        className="overflow-hidden"
                      >
                        <div className="black px-4 pb-3 text-sm">{card.description}</div>
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
