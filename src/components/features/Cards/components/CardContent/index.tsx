// src/components/features/Cards/components/CardContent.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { CardContentProps } from './types';

/**
 * Renders the content of a card, including a title and an optional description that can be expanded or collapsed.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.title - The title of the card.
 * @param {string} props.description - The description of the card.
 * @param {boolean} props.isExpanded - A flag indicating whether the description is expanded.
 *
 * @returns {JSX.Element} The rendered card content.
 */
export function CardContent({ title, description, isExpanded }: Omit<CardContentProps, 'onToggle'>) {
  const headingId = `heading-${title.toLowerCase().replace(/\s+/g, '-')}`;
  const descriptionId = `description-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div
      className="flex w-full flex-col pl-2" // Added pt-10 to account for controls
      role="region"
      aria-labelledby={headingId}
    >
      <div className="flex w-full items-start" role="heading" aria-level={3}>
        <h3 id={headingId} className="flex-1 break-words text-sm font-medium text-black sm:text-base">
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
            <p id={descriptionId} className="text-base leading-relaxed text-black" aria-expanded={isExpanded}>
              <span className="sr-only">Description: </span>
              {description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
