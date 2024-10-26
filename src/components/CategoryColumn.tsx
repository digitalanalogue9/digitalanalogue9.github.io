'use client'

import { useState } from 'react';
import { Value } from '../types';
import { CategoryName } from '../types';
import Card from './Card';

interface CategoryColumnProps {
  title: CategoryName;
  cards: Value[];
  onDrop: (cardId: string, category: CategoryName) => void;
  onMoveCard: (category: CategoryName, fromIndex: number, toIndex: number) => void;
}

export default function CategoryColumn({ title, cards, onDrop, onMoveCard }: CategoryColumnProps) {
  const [isOver, setIsOver] = useState(false);

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
    const droppedValue = JSON.parse(e.dataTransfer.getData('text/plain'));
    onDrop(droppedValue.id, title);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      onMoveCard(title, index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < cards.length - 1) {
      onMoveCard(title, index, index + 1);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        flex-1 
        p-4 
        rounded-lg 
        min-h-[500px]
        transition-colors 
        duration-200
        ${isOver ? 'bg-blue-50' : 'bg-gray-50'}
        border-2 
        ${isOver ? 'border-blue-300' : 'border-transparent'}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-700">{title}</h2>
        <span className="bg-gray-200 px-2 py-1 rounded-full text-sm text-gray-600">
          {cards.length}
        </span>
      </div>
      
      <div className="space-y-4 relative">
        {cards.map((value, index) => (
          <div key={value.id} className="transition-all duration-200">
            <Card
              value={value}
              onDrop={(value) => onDrop(value.id, title)}
              onMoveUp={index > 0 ? () => handleMoveUp(index) : undefined}
              onMoveDown={index < cards.length - 1 ? () => handleMoveDown(index) : undefined}
            />
          </div>
        ))}
        
        {cards.length === 0 && (
          <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg">
            Drop cards here
          </div>
        )}
      </div>
    </div>
  );
}
