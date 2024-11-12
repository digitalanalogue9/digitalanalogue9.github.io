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
import { CategoryName } from '@/types';

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
  const [dragStartY, setDragStartY] = useState<number | null>(null);

  const {
    x,
    y,
    handleDragStart: handleAnimationDragStart,
    handleDragEnd: handleAnimationDragEnd
  } = useCardDragAnimation({ x: 0, y: 0 });

  if (!value) return null;
  const isInCategory = columnIndex !== undefined;
  const isTouchDevice = 'ontouchstart' in window;

  // Native HTML5 Drag and Drop handlers
  const handleNativeDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStartY(e.clientY);
    const dragData = {
      ...value,
      sourceCategory: currentCategory,
      sourceIndex: columnIndex, // Add this to track the source index
      isInternalMove: true // Add this flag
    };
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    if (debug) console.log('🎪 Native dragStart:', { value, columnIndex });
  };

  const handleNativeDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);

    try {
      const droppedData = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (droppedData.isInternalMove && droppedData.sourceCategory === currentCategory) {
        // This is an internal move within the same category
        return;
      }
    } catch (error) {
      console.error('Error parsing drop data:', error);
    }
  };

  const handleNativeDragEnd = () => {
    setIsDragging(false);
    setIsOver(false);
    setDragStartY(null);
    if (debug) console.log('🏁 Native dragEnd:', { value, columnIndex });
  };

  const handleNativeDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleNativeDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleNativeDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isInCategory || dragStartY === null) return;

    const currentY = e.clientY;
    const deltaY = currentY - dragStartY;

    if (Math.abs(deltaY) > 30) {
      if (deltaY < 0 && onMoveUp) {
        console.log('Moving up from index:', columnIndex);
        onMoveUp();
        setDragStartY(currentY);
      } else if (deltaY > 0 && onMoveDown) {
        console.log('Moving down from index:', columnIndex);
        onMoveDown();
        setDragStartY(currentY);
      }
    }
  };

  // Touch handlers
  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
    handleAnimationDragStart();
    // Add visual feedback
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.opacity = '0.8';
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
    
    const touch = e.changedTouches[0];
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    const categoryElement = elements.find(el => el.hasAttribute('data-category'));
  
    if (categoryElement) {
      const category = categoryElement.getAttribute('data-category') as CategoryName;
      onDrop?.(value);
    }
  
    // Reset visual feedback
    e.currentTarget.style.transform = '';
    e.currentTarget.style.opacity = '';
    
    setIsDragging(false);
    setIsOver(false);
    handleAnimationDragEnd();
  };
  
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    setIsDragging(false);
    setIsOver(false);
    handleAnimationDragEnd();

    // Only proceed if we have column index (means we're in a category) and currentCategory
    if (columnIndex === undefined || !currentCategory) {
      if (onDrop) {
        onDrop(value);
      }
      return;
    }

    const DRAG_THRESHOLD = 30;
    const yMovement = info.offset.y;
    const yVelocity = info.velocity.y;

    // Calculate how many positions to move based on drag distance
    const moveDistance = Math.round(yMovement / 50); // 50px per card height for example
    if (Math.abs(moveDistance) > 0) {
      if (moveDistance < 0 && onMoveUp) {
        // Only call once at the end of drag
        console.log('Moving up from index:', columnIndex);
        onMoveUp();
      } else if (moveDistance > 0 && onMoveDown) {
        // Only call once at the end of drag
        console.log('Moving down from index:', columnIndex);
        onMoveDown();
      }
    }

    // Reset position
    x.set(0);
    y.set(0);
  };

  const { postItBaseStyles, tapeEffect } = getPostItStyles(isDragging, isOver);

  const cardContent = (
    <>
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
    </>
  );

  if (isInCategory) {
    if (!isTouchDevice) {
      // Desktop version with native drag and drop
      return (
        <div
          draggable="true"
          onDragStart={handleNativeDragStart}
          onDragEnd={handleNativeDragEnd}
          onDragEnter={handleNativeDragEnter}
          onDragLeave={handleNativeDragLeave}
          onDragOver={handleNativeDragOver}
          onDrop={handleNativeDrop}  // Add this
          id={`card-${value.title}`}
          data-category={currentCategory}
          data-index={columnIndex}
          className={`${postItBaseStyles} ${tapeEffect} w-full min-h-[40px] relative`}
        >
          {cardContent}
        </div>
      );
    }

    // Touch device version with Framer Motion
    return (
      <motion.div
        drag
        dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={handleAnimationDragStart}
        onDragEnd={handleAnimationDragEnd}
        style={{ x, y }}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover="hover"
        transition={cardTransition}
        whileTap={{ scale: 1.05 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        id={`card-${value.title}`}
        data-category={currentCategory}
        className={`${postItBaseStyles} ${tapeEffect} w-full min-h-[40px] relative touch-manipulation active:bg-blue-50`}
      >
        {cardContent}
      </motion.div>
    );
  }

  // Non-category card (always using Framer Motion)
  return (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
      dragElastic={0.1}
      dragMomentum={false}
      style={{ x, y }}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      transition={cardTransition}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`${postItBaseStyles} ${tapeEffect} w-48 h-48 touch-manipulation relative`}
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 mb-3">{value.title}</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{value.description}</p>
        </div>

        {isTouchDevice && (
          <div className="absolute bottom-0 left-0 right-0 bg-blue-50 p-2 rounded-b text-center">
            <div className="flex items-center justify-center gap-2 text-blue-700 text-sm font-medium">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7.5 3.5c0-1.1.9-2 2-2s2 .9 2 2v7m0 0v3m0-3h3m-3 0h-3m-2.5-4c0-1.1-.9-2-2-2s-2 .9-2 2"
                />
              </svg>
              Press & Hold to Drag
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
