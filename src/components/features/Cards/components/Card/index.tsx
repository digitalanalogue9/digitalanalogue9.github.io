'use client';

import { memo, useRef, useState } from 'react';
import type { CardProps } from '@/components/features/Cards/types';
import { CardControls } from '../CardControls';
import { CardMoveOptions } from '../CardMoveOptions';
import { CardContent } from '../CardContent';
import { getPostItStyles } from '../styles';
import { useMobile } from '@/lib/contexts/MobileContext';

/**
 * A memoized Card component that supports drag-and-drop functionality.
 *
 * @component
 * @param {CardProps} props - The properties for the Card component.
 * @param {Object} props.value - The value object containing card details.
 * @param {Function} props.onDrop - Callback function to handle drop events.
 * @param {Function} props.onMoveUp - Callback function to handle moving the card up.
 * @param {Function} props.onMoveDown - Callback function to handle moving the card down.
 * @param {Function} props.onMoveBetweenCategories - Callback function to handle moving the card between categories.
 * @param {string} props.currentCategory - The current category of the card.
 * @param {number} props.columnIndex - The index of the column where the card is located.
 * @param {Function} props.onClick - Callback function to handle click events.
 * @param {boolean} props.selectedMobileCard - Indicates if the card is selected on mobile.
 *
 * @returns {JSX.Element | null} The rendered Card component or null if no value is provided.
 *
 * @example
 * <Card
 *   value={cardValue}
 *   onDrop={handleDrop}
 *   onMoveUp={handleMoveUp}
 *   onMoveDown={handleMoveDown}
 *   onMoveBetweenCategories={handleMoveBetweenCategories}
 *   currentCategory="category1"
 *   columnIndex={0}
 *   onClick={handleClick}
 *   selectedMobileCard={true}
 * />
 */
const Card = memo(function Card({
  value,
  onDrop,
  onMoveUp,
  onMoveDown,
  onMoveBetweenCategories,
  currentCategory,
  columnIndex,
  onClick,
  selectedMobileCard,
}: CardProps) {
  const isDebug = process.env.NEXT_PUBLIC_DEBUG === 'true';
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoveOptions, setShowMoveOptions] = useState(false);
  const draggedIndexRef = useRef<number | null>(null);
  const { isMobile } = useMobile();
  if (!value) return null;
  const isInCategory = columnIndex !== undefined;
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    if (isMobile) {
      e.preventDefault();
      return;
    }
    setIsDragging(true);
    draggedIndexRef.current = columnIndex !== undefined ? columnIndex : null;
    const dragData = {
      id: value.id,
      title: value.title,
      description: value.description,
      sourceCategory: currentCategory,
      sourceIndex: columnIndex,
      isInternalDrag: isInCategory,
    };
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
    if (isDebug) console.log('🎪 Card dragStart:', dragData);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    if (isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsOver(true);
  };

  const findDropIndex = (mouseY: number, container: HTMLElement): number => {
    const cardElements = container.querySelectorAll('[data-card-id]');
    const containerRect = container.getBoundingClientRect();

    // If no cards or mouse is above all cards, return 0
    if (cardElements.length === 0 || mouseY < containerRect.top) {
      return 0;
    }

    // If mouse is below all cards, return length
    if (mouseY > containerRect.bottom) {
      return cardElements.length;
    }

    // Find the card the mouse is closest to
    for (let i = 0; i < cardElements.length; i++) {
      const cardRect = cardElements[i].getBoundingClientRect();
      const cardMiddle = cardRect.top + cardRect.height / 2;

      if (mouseY < cardMiddle) {
        return i;
      }
    }

    // If we get here, the mouse is below the middle of the last card
    return cardElements.length;
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    try {
      const droppedData = JSON.parse(e.dataTransfer.getData('text/plain'));
      const sourceIndex = droppedData.sourceIndex;

      const dropContainer = e.currentTarget.closest('.space-y-2') as HTMLElement | null;

      if (!dropContainer) return;
      const targetIndex = findDropIndex(e.clientY, dropContainer);

      const sourceCategory = droppedData.sourceCategory;
      if (isDebug) {
        console.log('📥 Drop data:', {
          droppedData,
          sourceIndex,
          targetIndex,
          sourceCategory,
          currentCategory,
        });
      }

      // Handle internal category reordering
      if (
        droppedData.isInternalDrag &&
        sourceCategory === currentCategory &&
        sourceIndex !== undefined &&
        targetIndex !== undefined
      ) {
        if (sourceIndex < targetIndex) {
          onMoveDown?.();
        } else if (sourceIndex > targetIndex) {
          onMoveUp?.();
        }
      }
      // Handle between category movement
      else if (sourceCategory && currentCategory && sourceCategory !== currentCategory) {
        onMoveBetweenCategories?.(
          {
            id: droppedData.id,
            title: droppedData.title,
            description: droppedData.description,
          },
          sourceCategory,
          currentCategory
        );
      }
      // Handle new card drop
      else if (onDrop) {
        onDrop(droppedData);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };
  const handleDragEnd = (): void => {
    if (isMobile) return;
    setIsDragging(false);
    setIsOver(false);
    draggedIndexRef.current = null;
    if (isDebug)
      console.log('🏁 Card dragEnd:', {
        value,
        columnIndex,
      });
  };
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    if (isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    setIsOver(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    if (isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
  };
  const handleCardClick = () => {
    if (isMobile && onClick) {
      onClick(value);
    } else if (!isMobile && columnIndex !== undefined) {
      setIsExpanded(!isExpanded);
    }
  };
  const { postItBaseStyles, tapeEffect } = getPostItStyles(isDragging, isOver);
  const cardContainerClasses = `
    ${postItBaseStyles} 
    ${tapeEffect} 
    ${isInCategory ? 'w-full max-w-full min-h-[40px]' : 'w-48 h-48'}
    relative select-none cursor-move
    ${isMobile ? 'touch-manipulation' : ''}
    ${isOver ? 'border-2 border-blue-300' : ''}
    ${isMobile && onClick && !isInCategory ? 'hover:bg-yellow-100 active:bg-yellow-200' : ''}
    ${selectedMobileCard ? 'bg-yellow-200' : ''} // Add this for selected state
`;
  if (isInCategory) {
    return (
      <div
        id={`card-${value.id}`}
        data-card-id={value.id}
        data-index={columnIndex}
        data-dropzone="true"
        draggable="true"
        onClick={handleCardClick}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${cardContainerClasses} group relative`}
        role="article"
        aria-label={`Value card: ${value.title}`}
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardClick();
          }
        }}
      >
        {/* Content component */}
        <CardContent title={value.title} description={value.description} isExpanded={isExpanded} />
        {!isMobile && (
          <div className="mt-2 flex justify-end">
            <CardControls
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onShowMoveOptions={() => setShowMoveOptions(!showMoveOptions)}
              currentCategory={currentCategory}
              isExpanded={isExpanded}
              onToggleExpand={() => setIsExpanded(!isExpanded)}
              value={value}
            />
          </div>
        )}

        {/* Move options dialog */}
        {!isMobile && showMoveOptions && onMoveBetweenCategories && currentCategory && (
          <div className="absolute right-2 top-12 z-50" role="dialog" aria-label="Move options">
            <CardMoveOptions
              value={value}
              currentCategory={currentCategory}
              onMoveBetweenCategories={onMoveBetweenCategories}
              onClose={() => setShowMoveOptions(false)}
            />
          </div>
        )}
      </div>
    );
  }
  return (
    <div
      draggable="true"
      onClick={handleCardClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cardContainerClasses}
      role="article"
      aria-label={`Value card: ${value.title}`}
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
    >
      <div className="pointer-events-none relative z-10" role="region" aria-label={`Content for ${value.title}`}>
        <h3 className="mb-3 font-medium text-black">{value.title}</h3>
        <p className="text-sm leading-relaxed text-black">{value.description}</p>
      </div>
    </div>
  );
});
export default Card;
