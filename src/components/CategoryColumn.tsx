'use client'

import { useState } from 'react';
import { Card } from '@/components/Card';
import { CategoryColumnProps } from './CategoryColumnProps';
import { Value, CategoryName } from '@/types';


export default function CategoryColumn({
  title,
  cards,
  onDrop,
  onMoveWithinCategory,
  onMoveBetweenCategories
}: CategoryColumnProps) {
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
    const droppedValue = JSON.parse(e.dataTransfer.getData('text/plain')) as Value & { sourceCategory?: string };
    if (droppedValue.sourceCategory) {
      // Card is being moved between categories
      onMoveBetweenCategories(droppedValue, droppedValue.sourceCategory as CategoryName, title);
    } else {
      // Card is being dropped from the remaining cards
      onDrop(droppedValue, title);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      onMoveWithinCategory(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < cards.length - 1) {
      onMoveWithinCategory(index, index + 1);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      id={`category-${title}`}
      className={`
        flex-1 
        p-2      // Reduced padding to allow cards to be wider
        rounded-lg 
        min-h-[500px]
        transition-colors 
        duration-200
        ${isOver ? 'bg-blue-50' : 'bg-gray-50'}
        border-2 
        ${isOver ? 'border-blue-300' : 'border-transparent'}
      `}
    >
      <div className="flex items-center justify-between mb-4 px-2"> {/* Added padding here */}
        <h2 className="text-xl font-bold text-gray-700">{title}</h2>
        <span className="bg-gray-200 px-2 py-1 rounded-full text-sm text-gray-600">
          {cards.length}
        </span>
      </div>

      <div className="space-y-2"> {/* Reduced gap between cards */}
        {cards.map((value, index) => (
          <div key={value.id} className="transition-all duration-200">
            <Card
              value={value}
              columnIndex={index}
              currentCategory={title}
              onDrop={(value) => onDrop(value, title)}
              onMoveUp={index > 0 ? () => handleMoveUp(index) : undefined}
              onMoveDown={index < cards.length - 1 ? () => handleMoveDown(index) : undefined}
              onMoveToCategory={(value, fromCat, toCat) =>
                onMoveBetweenCategories(value, fromCat, toCat)}
            />
          </div>
        ))}

        {cards.length === 0 && (
          <div className="text-center mx-2 py-8 text-gray-400 border-2 border-dashed rounded-lg">
            Drop cards here
          </div>
        )}
      </div>
    </div>
  );
}
