// Card.tsx
'use client'

import { useState, TouchEvent as ReactTouchEvent } from 'react';
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
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

  const {
    x,
    y,
    handleDragStart: handleAnimationDragStart,
    handleDragEnd: handleAnimationDragEnd
  } = useCardDragAnimation({ x: 0, y: 0 });

  if (!value) return null;
  const isInCategory = columnIndex !== undefined;

  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
    handleAnimationDragStart();
  };

  const handleTouchMove = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const newX = touch.clientX - touchStart.x;
    const newY = touch.clientY - touchStart.y;
    x.set(newX);
    y.set(newY);
  };

  const handleTouchEnd = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsOver(false);

    const touch = e.changedTouches[0];
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    const categoryElement = elements.find(el => el.hasAttribute('data-category'));

    if (categoryElement && onDrop && currentCategory) {
      const dragData = {
        ...value,
        sourceCategory: currentCategory
      };
      onDrop(dragData);
    }

    x.set(0);
    y.set(0);
    handleAnimationDragEnd();
  };

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

  const commonProps = {
    drag: !('ontouchstart' in window),
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
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  if (isInCategory) {
    return (
      <motion.div
        {...commonProps}
        id={`card-${value.title}`}
        className={`${postItBaseStyles} ${tapeEffect} w-full min-h-[40px] relative touch-manipulation`}
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
              value={value}
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
      className={`${postItBaseStyles} ${tapeEffect} w-48 h-48 touch-manipulation`}
    >
      <div className="relative z-10">
        <h3 className="font-medium text-gray-800 mb-3">{value.title}</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{value.description}</p>
      </div>
    </motion.div>
  );
}
