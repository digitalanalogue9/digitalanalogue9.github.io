'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CategoryName, Value } from "@/lib/types";
import { ChevronDownIcon, ChevronUpIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { MobileCategoryRowProps } from '@/components/features/Round/types';
import { useMobileInteractions } from '@/components/features/Round/hooks/useMobileInteractions';

/**
 * Component representing a row of categories in a mobile view.
 * 
 * @param {Object} props - The properties object.
 * @param {string} props.category - The name of the category.
 * @param {Array} props.cards - The list of cards within the category.
 * @param {Array} props.availableCategories - The list of all available categories.
 * @param {boolean} props.isActive - Indicates if the category is currently active.
 * @param {boolean} props.isExpanded - Indicates if the category is currently expanded.
 * @param {Function} props.onCategoryTap - Callback function when a category is tapped.
 * @param {Function} props.onCategorySelect - Callback function when a category is selected.
 * @param {boolean} props.showingCardSelection - Indicates if card selection is being shown.
 * @param {Function} props.onMoveWithinCategory - Callback function to move a card within the category.
 * @param {Function} props.onMoveBetweenCategories - Callback function to move a card between categories.
 * @param {string} props.lastDroppedCategory - The last category where a card was dropped.
 * 
 * @returns {JSX.Element} The rendered component.
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
  lastDroppedCategory
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
  return <motion.div layout className={`
    rounded-lg 
    transition-all duration-300
    border-1
    ${isActive || lastDroppedCategory === category ? 'bg-green-50' : 'bg-white'}
    ${showingCardSelection ? 'border-black shadow-md z-50 cursor-pointer' : 'border-transparent hover:border-gray-200 z-0'}
  `} role="region" aria-labelledby={categoryId}>
      <button onClick={() => showingCardSelection ? onCategorySelect(category) : onCategoryTap(category)} 
      className="bg-gray-200 hover:bg-gray-300 w-full p-4" 
      aria-expanded={isExpanded} aria-controls={`${categoryId}-content`} 
      aria-label={`${category} category with ${cards.length} cards${showingCardSelection ? '. Tap to select' : ''}`}>
        <div className="flex items-center justify-between">
          <h3 id={categoryId} className="font-medium">
            {category}
          </h3>
          <span className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-full text-sm text-black" aria-label={`${cards.length} cards`}>
            {cards.length}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && !showingCardSelection && cards.length > 0 && <motion.div id={`${categoryId}-content`} initial={{
        height: 0,
        opacity: 0
      }} animate={{
        height: 'auto',
        opacity: 1
      }} exit={{
        height: 0,
        opacity: 0
      }} className="overflow-hidden" role="list" aria-label={`Cards in ${category}`}>
            <div className="space-y-2 px-2 pb-2 mt-1">
              {cards.map((card, index) => <div key={card.id} className="bg-yellow-100 rounded-lg shadow-sm" role="listitem">
                  <div className="flex items-center justify-between p-2 gap-2 border-b border-yellow-200">
                    {/* Card Title and Expand Button */}
                    <button onClick={e => toggleCardExpansion(card.id, e)} className="flex items-center gap-2 flex-1 text-left bg-yellow-100  hover:bg-yellow-100  text-black" 
                    aria-expanded={expandedCards.has(card.id)} aria-label={`${card.title}. Click to ${expandedCards.has(card.id) ? 'collapse' : 'expand'}`}>
                      <ChevronDownIcon className={`w-4 h-4  bg-yellow-100 text-black transition-transform flex-shrink-0
                          ${expandedCards.has(card.id) ? 'rotate-180' : ''}
                        `} aria-hidden="true" />
                      <span className="text-sm font-medium  bg-yellow-100 text-black truncate">
                        {card.title}
                      </span>
                    </button>

                    {/* Controls */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* Category Movement Controls */}
                      <div className="flex items-center gap-1 border-r border-yellow-200 pr-3">
                        {currentCategoryIndex > 0 && <button onClick={() => handleMoveBetweenCategories(card, category, availableCategories[currentCategoryIndex - 1])}
 className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800" aria-label={`Move to ${availableCategories[currentCategoryIndex - 1]}`}>
                            <ArrowUpIcon className="w-4 h-4 text-black" />
                          </button>}
                        {currentCategoryIndex < availableCategories.length - 1 && <button onClick={() => handleMoveBetweenCategories(card, category, availableCategories[currentCategoryIndex + 1])} className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800" aria-label={`Move to ${availableCategories[currentCategoryIndex + 1]}`}>
                            <ArrowDownIcon className="w-4 h-4 text-black" />
                          </button>}
                      </div>

                      {/* Position Movement Controls */}
                      <div className="flex items-center gap-1">
                        {index > 0 && <button onClick={() => onMoveWithinCategory?.(index, index - 1)} className="p-1.5 rounded-full bg-gray-100 text-black hover:bg-gray-200" aria-label="Move up within category">
                            <ChevronUpIcon className="w-4 h-4" />
                          </button>}
                        {index < cards.length - 1 && <button onClick={() => onMoveWithinCategory?.(index, index + 1)} className="p-1.5 rounded-full bg-gray-100 text-black hover:bg-gray-200" aria-label="Move down within category">
                            <ChevronDownIcon className="w-4 h-4" />
                          </button>}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Description */}
                  <AnimatePresence>
                    {expandedCards.has(card.id) && <motion.div initial={{
                height: 0,
                opacity: 0
              }} animate={{
                height: 'auto',
                opacity: 1
              }} exit={{
                height: 0,
                opacity: 0
              }} className="overflow-hidden">
                        <div className="px-4 pb-3 text-sm black">
                          {card.description}
                        </div>
                      </motion.div>}
                  </AnimatePresence>
                </div>)}
            </div>
          </motion.div>}
      </AnimatePresence>
    </motion.div>;
}