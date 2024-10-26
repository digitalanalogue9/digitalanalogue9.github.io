'use client'

import { useState } from 'react';
import { Value } from '../types';

interface CardProps {
  value: Value;
  columnIndex: number;
  onDrop?: (value: Value, columnIndex: number) => void;
  onMoveUp?: (value: Value, fromColumnIndex: number) => void;
  onMoveDown?: (value: Value, fromColumnIndex: number) => void;
}

export default function Card({ value, columnIndex, onDrop, onMoveUp, onMoveDown }: CardProps) {
  // Early return if value is undefined
  if (!value) {
    return null;
  }

  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', JSON.stringify(value));
  };

  const handleDragEnd = (): void => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    try {
      const droppedValue = JSON.parse(e.dataTransfer.getData('text/plain')) as Value;
      if (onDrop) {
        onDrop(droppedValue, columnIndex);
      }
    } catch (error) {
      console.error('Error parsing dropped value:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
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
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          w-48 h-48 
          p-4 
          shadow-md 
          cursor-move 
          transform transition-transform duration-200
          ${isDragging ? 'scale-105 opacity-75' : ''}
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
