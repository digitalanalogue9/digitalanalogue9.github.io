// src/components/Card/CardContent.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { CardContentProps } from './types';

export function CardContent({
  title,
  description,
  isExpanded,
  controls
}: Omit<CardContentProps, 'onToggle'> & { controls?: React.ReactNode }) {
  const headingId = `heading-${title.toLowerCase().replace(/\s+/g, '-')}`;
  const descriptionId = `description-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div 
      className="flex flex-col w-full p-2"
      role="region"
      aria-labelledby={headingId}
    >
      <div 
        className="flex items-start justify-between gap-2 w-full"
        role="heading"
        aria-level={3}
      >
        <h3 
          id={headingId}
          className="font-medium text-gray-800 text-sm sm:text-base flex-1 break-words pr-2"
        >
          {title}
        </h3>
        
        {controls && (
          <div 
            className="flex-shrink-0 ml-auto"
            role="toolbar"
            aria-label={`Controls for ${title}`}
          >
            {controls}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 border-t border-gray-100 pt-2"
            role="region"
            aria-labelledby={descriptionId}
          >
            <p 
              id={descriptionId}
              className="text-sm text-gray-700 leading-relaxed"
              aria-expanded={isExpanded}
            >
              <span className="sr-only">Description: </span>
              {description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
