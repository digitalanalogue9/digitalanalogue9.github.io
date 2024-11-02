import { motion, AnimatePresence } from 'framer-motion';
import { CardContentProps } from './types';

export function CardContent({
  title,
  description,
  isExpanded,
  onToggle
}: CardContentProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-2 relative z-10">
        <h3
          onClick={onToggle}
          className="flex-grow font-medium text-gray-800 text-sm sm:text-base hover:text-gray-600 cursor-pointer"
        >
          {title}
          <span className="ml-1 text-xs text-gray-500">
            {isExpanded ? '▼' : '▶'}
          </span>
        </h3>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-700 leading-relaxed relative z-10"
          >
            {description}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}
