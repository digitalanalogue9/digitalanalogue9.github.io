'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CardProps } from '@/components/features/Cards/types';
import { getEnvBoolean } from "@/lib/utils/config";
import { CardControls } from "../CardControls";
import { CardMoveOptions } from "../CardMoveOptions";
import { CardContent } from "../CardContent";
import { getPostItStyles } from '../styles';

// Faster animation settings for replay
const cardVariants = {
  initial: {
    scale: 0.8,
    opacity: 0
  },
  animate: {
    scale: 1,
    opacity: 1
  },
  exit: {
    scale: 0.8,
    opacity: 0
  },
  hover: {
    scale: 1.05
  }
};
const cardTransition = {
  type: "spring",
  stiffness: 700,
  // Increased from 500
  damping: 30,
  // Reduced from 35
  mass: 0.8 // Reduced from 1
};

// This version uses Framer Motion for Replay view
/**
 * AnimatedCard component renders a card with animation effects.
 * It can be expanded to show more details and provides options to move the card between categories.
 *
 * @param {CardProps} props - The properties for the AnimatedCard component.
 * @param {CardValue} props.value - The value of the card, containing title and description.
 * @param {Function} props.onMoveUp - Callback function to move the card up.
 * @param {Function} props.onMoveDown - Callback function to move the card down.
 * @param {Function} props.onMoveBetweenCategories - Callback function to move the card between categories.
 * @param {string} props.currentCategory - The current category of the card.
 * @param {number} props.columnIndex - The index of the column where the card is located.
 *
 * @returns {JSX.Element | null} The rendered AnimatedCard component or null if the value is not provided.
 */
export function AnimatedCard({
  value,
  onMoveUp,
  onMoveDown,
  onMoveBetweenCategories,
  currentCategory,
  columnIndex
}: CardProps) {
  const isDebug = process.env.NEXT_PUBLIC_DEBUG === 'true';
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoveOptions, setShowMoveOptions] = useState(false);
  if (!value) return null;
  const isInCategory = columnIndex !== undefined;
  const {
    postItBaseStyles,
    tapeEffect
  } = getPostItStyles(false, false);
  if (isInCategory) {
    return <motion.div id={`card-${value.title}`} variants={cardVariants} initial="initial" animate="animate" exit="exit" whileHover="hover" transition={cardTransition} className={`${postItBaseStyles} ${tapeEffect} w-full min-h-[40px] relative`}>
        <CardContent title={value.title} description={value.description} isExpanded={isExpanded} controls={<CardControls onMoveUp={onMoveUp} onMoveDown={onMoveDown} onShowMoveOptions={() => setShowMoveOptions(!showMoveOptions)} currentCategory={currentCategory} isExpanded={isExpanded} onToggleExpand={() => setIsExpanded(!isExpanded)} value={value} // Add this
      />} />
        <AnimatePresence>
          {showMoveOptions && onMoveBetweenCategories && currentCategory && <div className="relative z-50">
              <CardMoveOptions value={value} currentCategory={currentCategory} onMoveBetweenCategories={onMoveBetweenCategories} onClose={() => setShowMoveOptions(false)} />
            </div>}
        </AnimatePresence>
      </motion.div>;
  }
  return <motion.div variants={cardVariants} initial="initial" animate="animate" exit="exit" whileHover="hover" transition={cardTransition} className={`${postItBaseStyles} ${tapeEffect} w-full sm:w-48 h-auto sm:h-48 max-w-sm mx-auto p-3 sm:p-4`}>
      <div className="relative z-10">
        <h3 className="font-medium text-black text-sm sm:text-base mb-2 sm:mb-3">{value.title}</h3>
        <p className="text-xs sm:text-sm text-black leading-relaxed">{value.description}</p>
      </div>
    </motion.div>;
}