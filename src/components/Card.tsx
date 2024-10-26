// Card.tsx
'use client'

import { useState } from 'react';
import { Value } from "@/types/Value";
import { CardProps } from './CardProps';

export default function Card({ value, columnIndex, onDrop, onMoveUp, onMoveDown, debug = true }: CardProps) {
  if (!value) {
    return null;
  }

  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);

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

  return (
    <div className="group relative">
      {(onMoveUp || onMoveDown) && (
        <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onMoveUp && (
            <button
              onClick={() => onMoveUp(value, columnIndex)}
              className="p-1 bg-gray-200 hover:bg-gray-300 rounded"
              aria-label="Move Up"
            >
              ↑
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={() => onMoveDown(value, columnIndex)}
              className="p-1 bg-gray-200 hover:bg-gray-300 rounded"
              aria-label="Move Down"
            >
              ↓
            </button>
          )}
        </div>
      )}
      <div
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        className={`
          w-48 h-48 
          p-4 
          shadow-md 
          cursor-move 
          transform transition-transform duration-200
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
        <h3 className="font-bold mb-2 text-gray-800 text-lg font-handwritten">
          {value.title}
        </h3>
        <p className="text-sm text-gray-700 font-handwritten leading-tight overflow-auto">
          {value.description}
        </p>
      </div>
    </div>
  );
}
