// Card.tsx
'use client'

import { useState } from 'react';
import { Value } from "@/types/Value";
import { CardProps } from './CardProps';
import { getEnvBoolean } from '@/utils/envUtils';


export default function Card({ value, columnIndex, onDrop, onMoveUp, onMoveDown }: CardProps) {
  if (!value) {
    return null;
  }
  const debug = getEnvBoolean('debug', false);

  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isInCategory = columnIndex !== undefined;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', JSON.stringify(value));
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
                onClick={() => onMoveUp(value, columnIndex)}
                className="p-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                aria-label="Move Up"
              >
                ↑
              </button>
            )}
            {onMoveDown && (
              <button
                onClick={() => onMoveDown(value, columnIndex)}
                className="p-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                aria-label="Move Down"
              >
                ↓
              </button>
            )}
          </div>
        </div>
        
        {isExpanded && (
          <p className="mt-2 text-sm text-gray-700 font-handwritten leading-tight">
            {value.description}
          </p>
        )}
      </div>
    );
  }

  // Unassigned card view
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
}
