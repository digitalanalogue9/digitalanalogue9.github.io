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
      <div className="flex flex-wrap items-start gap-1 relative z-10 min-h-[28px] p-1">
        <div className="flex flex-1 items-start justify-between gap-1 w-full">
          <h3 className="flex items-start gap-1 font-medium text-gray-800  text-sm sm:text-base flex-1 break-words">
            <span className="break-words whitespace-normal pr-1">{title}</span>
          </h3>
          <div className="flex-shrink-0">
            {controls}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 text-sm text-gray-700 leading-relaxed relative z-10 
                     border-t border-gray-100 pt-2 px-1"
          >
            {description}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}
