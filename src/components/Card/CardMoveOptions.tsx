import { motion } from 'framer-motion';
import { CardMoveOptionsProps } from './types';
import { CategoryName } from '@/types';

const categories: CategoryName[] = [
  'Very Important',
  'Quite Important',
  'Important',
  'Of Some Importance',
  'Not Important'
];

export function CardMoveOptions({
  value,
  currentCategory,
  onMoveToCategory,
  onClose
}: CardMoveOptionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 mt-1 sm:mt-2 w-36 sm:w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200"
    >
      {categories
        .filter(cat => cat !== currentCategory)
        .map(category => (
          <button
            key={category}
            onClick={() => {
              onMoveToCategory(value, currentCategory, category);
              onClose();
            }}
            className="block w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50"
          >
            Move to {category}
          </button>
        ))
      }
    </motion.div>
  );
}
