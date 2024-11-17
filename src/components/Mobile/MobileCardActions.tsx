// src/components/Mobile/MobileCardActions.tsx
import React from 'react';
import { Value, CategoryName } from '@/types';

interface MobileCardActionsProps {
  card: Value;
  category?: CategoryName;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onMoveBetweenCategories: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export const MobileCardActions: React.FC<MobileCardActionsProps> = ({
  card,
  onMoveUp,
  onMoveDown,
  onMoveBetweenCategories,
  canMoveUp,
  canMoveDown,
  category
}) => {
  if (!category) return null;

  const baseButtonClasses = `
    p-2 rounded 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    transition-colors duration-200
  `;

  return (
    <div 
      className="flex gap-2 mt-2"
      role="toolbar"
      aria-label={`Actions for ${card.title} in ${category}`}
    >
      <div 
        role="group" 
        aria-label="Reorder controls"
        className="flex gap-2"
      >
        <button
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className={`${baseButtonClasses} ${
            canMoveUp 
              ? 'bg-blue-100 hover:bg-blue-150 active:bg-blue-200 text-blue-700' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          aria-label={`Move ${card.title} up in ${category}`}
          tabIndex={canMoveUp ? 0 : -1}
        >
          <span aria-hidden="true">↑</span>
          <span className="sr-only">Move Up</span>
        </button>
        <button
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className={`${baseButtonClasses} ${
            canMoveDown 
              ? 'bg-blue-100 hover:bg-blue-150 active:bg-blue-200 text-blue-700' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          aria-label={`Move ${card.title} down in ${category}`}
          tabIndex={canMoveDown ? 0 : -1}
        >
          <span aria-hidden="true">↓</span>
          <span className="sr-only">Move Down</span>
        </button>
      </div>

      <button
        onClick={onMoveBetweenCategories}
        className={`${baseButtonClasses} 
          bg-blue-100 hover:bg-blue-150 active:bg-blue-200 
          flex-grow text-blue-700`}
        aria-label={`Move ${card.title} to different category`}
        aria-haspopup="true"
      >
        <span aria-hidden="true">Move to...</span>
        <span className="sr-only">
          Select new category for {card.title}
        </span>
      </button>
    </div>
  );
};
