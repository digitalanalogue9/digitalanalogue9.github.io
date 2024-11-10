'use client'

import { memo, useCallback, useState } from 'react';
import { Card } from '@/components/Card';
import { CategoryColumnProps } from './CategoryColumnProps';
import { Value, CategoryName } from '@/types';


const CategoryColumn = memo(function CategoryColumn({
  title,
  cards,
  onDrop,
  onMoveWithinCategory,
  onMoveBetweenCategories
}: CategoryColumnProps) {
  const [isOver, setIsOver] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    
    try {
      const droppedValue = JSON.parse(e.dataTransfer.getData('text/plain')) as Value & { 
        sourceCategory?: string;
        isInternalDrag?: boolean;
        sourceIndex?: number;
      };

      // If this is an internal drag within the same category
      if (droppedValue.isInternalDrag && droppedValue.sourceCategory === title) {
        const sourceIndex = droppedValue.sourceIndex;
        
        // Get the closest dropzone, or the container itself if dropped at the bottom
        const dropzone = (e.target as HTMLElement).closest('[data-dropzone]') || 
                        (e.currentTarget as HTMLElement);
        
        let targetIndex: number;
        
        if (dropzone.hasAttribute('data-dropzone')) {
          // Dropped on a card
          targetIndex = parseInt(dropzone.getAttribute('data-index') || '0', 10);
        } else {
          // Dropped at the bottom of the category
          targetIndex = cards.length - 1;
        }

        console.log('Drop indices:', { sourceIndex, targetIndex });

        if (sourceIndex !== undefined && sourceIndex !== targetIndex) {
          onMoveWithinCategory(sourceIndex, targetIndex);
        }
        return;
      }

      // Handle cross-category move
      if (droppedValue.sourceCategory && droppedValue.sourceCategory !== title) {
        onMoveBetweenCategories(droppedValue, droppedValue.sourceCategory as CategoryName, title);
        return;
      }

      // Handle new card drop
      if (!droppedValue.isInternalDrag) {
        onDrop(droppedValue, title);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleMoveUp = useCallback((index: number) => {
    if (isMoving) return;
    console.log('CategoryColumn: handleMoveUp called:', index);
    if (index > 0) {
      setIsMoving(true);
      onMoveWithinCategory(index, index - 1);
      // Reset the lock after a short delay
      setTimeout(() => setIsMoving(false), 300);
    }
  }, [onMoveWithinCategory, isMoving]);

  const handleMoveDown = useCallback((index: number) => {
    if (isMoving) return;
    console.log('CategoryColumn: handleMoveDown called:', index);
    if (index < cards.length - 1) {
      setIsMoving(true);
      onMoveWithinCategory(index, index + 1);
      // Reset the lock after a short delay
      setTimeout(() => setIsMoving(false), 300);
    }
  }, [onMoveWithinCategory, cards.length, isMoving]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      id={`category-${title}`}
      className={`
        flex-1 
        p-2
        rounded-lg 
        min-h-[500px]
        transition-colors 
        duration-200
        ${isOver ? 'bg-blue-50' : 'bg-gray-50'}
        border-2 
        ${isOver ? 'border-blue-300' : 'border-transparent'}
      `}
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-xl font-bold text-gray-700">{title}</h2>
        <span className="bg-gray-200 px-2 py-1 rounded-full text-sm text-gray-600">
          {cards.length}
        </span>
      </div>

      <div className="space-y-2">
        {cards.map((value, index) => (
          <div key={`${title}-${value.id}-${index}`} className="transition-all duration-200">
            <div
              data-index={index}
              data-dropzone="true"
              className="w-full"
            >
              <Card
                value={value}
                columnIndex={index}
                currentCategory={title}
                onDrop={(value: Value) => onDrop(value, title)}
                onMoveUp={index > 0 ? () => handleMoveUp(index) : undefined}
                onMoveDown={index < cards.length - 1 ? () => handleMoveDown(index) : undefined}
                onMoveToCategory={(value: Value, fromCat: CategoryName, toCat: CategoryName) =>
                  onMoveBetweenCategories(value, fromCat, toCat)}
              />
            </div>
          </div>
        ))}

        {cards.length === 0 && (
          <div data-index="0" data-dropzone="true" className="text-center mx-2 py-8 text-gray-400 border-2 border-dashed rounded-lg">
            Drop cards here
          </div>
        )}
      </div>
    </div>
  );
});

export default CategoryColumn;