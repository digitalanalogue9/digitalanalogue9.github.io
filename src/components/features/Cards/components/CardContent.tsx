// src/components/features/Cards/components/CardContent.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { CardContentProps } from '@/components/features/Cards/types';

export function CardContent({
  title,
  description,
  isExpanded,
}: Omit<CardContentProps, 'onToggle'>) {
  const headingId = `heading-${title.toLowerCase().replace(/\s+/g, '-')}`;
  const descriptionId = `description-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div
      className="flex flex-col w-full pl-2" // Added pt-10 to account for controls
      role="region"
      aria-labelledby={headingId}
    >
      <div
        className="flex items-start w-full"
        role="heading"
        aria-level={3}
      >
        <h3
          id={headingId}
          className="font-medium text-black text-sm sm:text-base flex-1 break-words"
        >
          {title}
        </h3>
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
              className="text-base text-black leading-relaxed"
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
