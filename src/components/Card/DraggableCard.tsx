'use client'

import { useState } from 'react';
import { CardProps } from './types';
import { CategoryName } from '@/types';
import { getEnvBoolean } from '@/utils/config';
import { CardControls } from './CardControls';
import { CardMoveOptions } from './CardMoveOptions';
import { CardContent } from './CardContent';
import { getPostItStyles } from './styles';

// This version uses HTML5 drag and drop for RoundUI
export function DraggableCard({ 
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

  if (!value) return null;
  const isInCategory = columnIndex !== undefined;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    setIsDragging(true);
    const dragData = {
      ...value,
      sourceCategory: currentCategory
    };
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    if (debug) console.log('🎪 Card dragStart:', { value, columnIndex });
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>): void => {
    setIsDragging(false);
    setIsOver(false);
    if (debug) console.log('🏁 Card dragEnd:', { value, columnIndex });
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsOver(true);
    if (debug) console.log('➡️ Card dragEnter:', { value, columnIndex });
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsOver(false);
    if (debug) console.log('⬅️ Card dragLeave:', { value, columnIndex });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    if (debug) console.log('🔄 Card dragOver:', { value, columnIndex });
  };

  const { postItBaseStyles, tapeEffect } = getPostItStyles(isDragging, isOver);

  if (isInCategory) {
    return (
      <div
        id={`card-${value.title}`}
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        className={`${postItBaseStyles} ${tapeEffect} w-48 min-h-[40px]`}
      >
        <CardContent
          title={value.title}
          description={value.description}
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
        />
        <CardControls
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onShowMoveOptions={() => setShowMoveOptions(!showMoveOptions)}
          currentCategory={currentCategory}
        />
        {showMoveOptions && onMoveToCategory && currentCategory && (
          <CardMoveOptions
            value={value}
            currentCategory={currentCategory}
            onMoveToCategory={onMoveToCategory}
            onClose={() => setShowMoveOptions(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      className={`${postItBaseStyles} ${tapeEffect} w-48 h-48`}
    >
      <div className="relative z-10">
        <h3 className="font-medium text-gray-800 mb-3">{value.title}</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{value.description}</p>
      </div>
    </div>
  );
}
