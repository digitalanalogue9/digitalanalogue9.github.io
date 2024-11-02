// Card.tsx
'use client'

import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { CardProps } from './types';
import { getEnvBoolean } from '@/utils/config';
import { cardVariants, cardTransition } from '@/utils/animation';
import { useCardDragAnimation } from '@/hooks/useCardDragAnimation';
import { CardControls } from './CardControls';
import { CardMoveOptions } from './CardMoveOptions';
import { CardContent } from './CardContent';
import { getPostItStyles } from './styles';

export default function Card({
  value,
  onDrop,
  onMoveUp,
  onMoveDown,
  onMoveToCategory,
  currentCategory,
  columnIndex
}: CardProps) {
  const debug = getEnvBoolean('debug', false);
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoveOptions, setShowMoveOptions] = useState(false);

  const {
    x,
    y,
    handleDragStart: handleAnimationDragStart,
    handleDragEnd: handleAnimationDragEnd
  } = useCardDragAnimation({ x: 0, y: 0 });

  if (!value) return null;
  const isInCategory = columnIndex !== undefined;

  const handleDragStart = (_event: MouseEvent | TouchEvent | PointerEvent, _info: PanInfo): void => {
    setIsDragging(true);
    handleAnimationDragStart();
    if (debug) console.log('🎪 Card dragStart:', { value, columnIndex });
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    setIsDragging(false);
    setIsOver(false);
    handleAnimationDragEnd();

    if (onDrop && currentCategory) {
      const dragData = {
        ...value,
        sourceCategory: currentCategory
      };
      onDrop(dragData);
    }

    if (debug) console.log('🏁 Card dragEnd:', { value, columnIndex, velocity: info.velocity });
  };

  const { postItBaseStyles, tapeEffect } = getPostItStyles(isDragging, isOver);

  const renderCard = () => {
    const commonProps = {
      drag: true,
      dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
      dragElastic: 0.1,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      style: { x, y },
      variants: cardVariants,
      initial: "initial",
      animate: "animate",
      exit: "exit",
      whileHover: "hover",
      transition: cardTransition,
    };

    if (isInCategory) {
      return (
        <motion.div
          {...commonProps}
          id={`card-${value.title}`}
          className={`${postItBaseStyles} ${tapeEffect} w-full min-h-[40px] relative`}
        >
          <CardContent
            title={value.title}
            description={value.description}
            isExpanded={isExpanded}
            controls={
              <CardControls
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onShowMoveOptions={() => setShowMoveOptions(!showMoveOptions)}
                currentCategory={currentCategory}
                isExpanded={isExpanded}
                onToggleExpand={() => setIsExpanded(!isExpanded)}
                value={value}  // Add this
              />
            }
          />
          <AnimatePresence>
            {showMoveOptions && onMoveToCategory && currentCategory && (
              <div className="absolute right-0 top-8 z-50">
                <CardMoveOptions
                  value={value}
                  currentCategory={currentCategory}
                  onMoveToCategory={onMoveToCategory}
                  onClose={() => setShowMoveOptions(false)}
                />
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    }

    return (
      <motion.div
        {...commonProps}
        className={`${postItBaseStyles} ${tapeEffect} w-48 h-48`}
      >
        <div className="relative z-10">
          <h3 className="font-medium text-gray-800 mb-3">{value.title}</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{value.description}</p>
        </div>
      </motion.div>
    );
  };

  return renderCard();
}
