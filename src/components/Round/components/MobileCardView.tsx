import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryName, Value } from '@/types';

interface MobileCardViewProps {
  category: CategoryName;
  cards: Value[];
  onClose: () => void;
  onMoveCard: (card: Value, toCategory: CategoryName) => void;
}

export function MobileCardView({
  category,
  cards,
  onClose,
  onMoveCard
}: MobileCardViewProps) {
  const [selectedCard, setSelectedCard] = useState<Value | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-white z-50 overflow-y-auto"
    >
      <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
        <h2 className="font-medium">{category}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="p-4 space-y-4">
        {cards.map(card => (
          <motion.div
            key={card.id}
            layout
            className={`
              p-4 rounded-lg shadow transition-all duration-200
              ${selectedCard?.id === card.id ? 'bg-blue-50 ring-2 ring-blue-400' : 'bg-yellow-50'}
            `}
            onClick={() => setSelectedCard(card)}
          >
            <h3 className="font-medium mb-2">{card.title}</h3>
            <p className="text-sm text-gray-600">{card.description}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t p-4"
          >
            <div className="space-y-2">
              <p className="text-sm font-medium">Move "{selectedCard.title}" to:</p>
              {['Very Important', 'Quite Important', 'Important', 'Of Some Importance', 'Not Important']
                .filter(cat => cat !== category)
                .map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onMoveCard(selectedCard, cat as CategoryName)}
                    className="w-full p-2 text-left rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
