'use client'

import { useState } from 'react';
import { CardProps } from './CardProps';
import { CategoryName } from '@/types/CategoryName';
import { getEnvBoolean } from '@/utils/envUtils';

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

  const toggleDescription = () => {
    if (isInCategory) {
      setIsExpanded(!isExpanded);
      if (debug) console.log('📖 Toggle description:', { isExpanded: !isExpanded });
    }
  };

  const categories: CategoryName[] = [
    'Very Important',
    'Quite Important',
    'Important',
    'Of Some Importance',
    'Not Important'
  ];

  const renderCardContent = () => {
    if (isInCategory) {
      return (
        <div
          draggable="true"
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          className={`
            min-h-[40px]
            w-48
            p-4
            shadow-md
            cursor-move
            transform transition-all duration-200
            ${isDragging ? 'scale-105 opacity-75' : ''}
            ${isOver ? 'border-2 border-blue-500' : ''}
            bg-yellow-100
            rotate-1
            rounded-sm
            border-b-4 border-yellow-200
            shadow-lg
            hover:scale-105
            flex flex-col
            relative
            overflow-hidden
            before:content-['']
            before:absolute
            before:top-0
            before:left-0
            before:w-full
            before:h-4
            before:bg-yellow-200/50
          `}
        >
          <div className="flex items-center gap-2">
            <h3
              onClick={toggleDescription}
              className="flex-grow font-bold text-gray-800 text-lg font-handwritten cursor-pointer hover:text-gray-600"
            >
              {value.title}
              <span className="ml-1 text-sm text-gray-500">
                {isExpanded ? '▼' : '▶'}
              </span>
            </h3>
            <div className="flex gap-1">
              {onMoveUp && (
                <button
                  onClick={onMoveUp}
                  className="p-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                  aria-label="Move Up"
                >
                  ↑
                </button>
              )}
              {onMoveDown && (
                <button
                  onClick={onMoveDown}
                  className="p-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                  aria-label="Move Down"
                >
                  ↓
                </button>
              )}
              {currentCategory && (
                <button
                  onClick={() => setShowMoveOptions(!showMoveOptions)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  ⋮
                </button>
              )}
            </div>
          </div>
          {isExpanded && (
            <p className="mt-2 text-sm text-gray-700 font-handwritten leading-tight">
              {value.description}
            </p>
          )}
          {showMoveOptions && onMoveToCategory && currentCategory && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
              {categories
                .filter(cat => cat !== currentCategory)
                .map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      onMoveToCategory(value, currentCategory, category);
                      setShowMoveOptions(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Move to {category}
                  </button>
                ))
              }
            </div>
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
        className={`
          h-48
          w-48
          p-4
          shadow-md
          cursor-move
          transform transition-all duration-200
          ${isDragging ? 'scale-105 opacity-75' : ''}
          ${isOver ? 'border-2 border-blue-500' : ''}
          bg-yellow-100
          rotate-1
          rounded-sm
          border-b-4 border-yellow-200
          shadow-lg
          hover:scale-105
          flex flex-col
          relative
          overflow-hidden
          before:content-['']
          before:absolute
          before:top-0
          before:left-0
          before:w-full
          before:h-4
          before:bg-yellow-200/50
        `}
      >
        <h3 className="font-bold text-gray-800 text-lg font-handwritten mb-2">
          {value.title}
        </h3>
        <p className="text-sm text-gray-700 font-handwritten leading-tight">
          {value.description}
        </p>
      </div>
    );
  };

  return renderCardContent();
}
