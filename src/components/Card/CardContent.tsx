// CardContent.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { CardContentProps } from './types';

export function CardContent({
  title,
  description,
  isExpanded,
  controls
}: Omit<CardContentProps, 'onToggle'> & { controls?: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col w-full p-2">
        <div className="flex items-start justify-between gap-2 w-full">
          <h3 className="font-medium text-gray-800 text-sm sm:text-base flex-1 break-words pr-2">
            {title}
          </h3>
          <div className="flex-shrink-0 ml-auto">
            {controls}
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-sm text-gray-700 leading-relaxed 
                       border-t border-gray-100 pt-2"
            >
              {description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
