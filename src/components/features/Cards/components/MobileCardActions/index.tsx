// src/components/Mobile/MobileCardActions.tsx
import React from 'react';
import { Value, CategoryName } from "@/lib/types";
import {MobileCardActionsProps } from "@/components/features/Cards/types";

/**
 * MobileCardActions component provides a set of action buttons for a card
 * that allow users to move the card up, down, or between categories.
 *
 * @param {MobileCardActionsProps} props - The properties for the component.
 * @param {Card} props.card - The card object containing details about the card.
 * @param {Function} props.onMoveUp - Callback function to move the card up.
 * @param {Function} props.onMoveDown - Callback function to move the card down.
 * @param {Function} props.onMoveBetweenCategories - Callback function to move the card to a different category.
 * @param {boolean} props.canMoveUp - Flag indicating if the card can be moved up.
 * @param {boolean} props.canMoveDown - Flag indicating if the card can be moved down.
 * @param {string} props.category - The current category of the card.
 * @returns {JSX.Element | null} The rendered component or null if no category is provided.
 */
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
  return <div className="flex gap-2 mt-2" role="toolbar" aria-label={`Actions for ${card.title} in ${category}`}>
      <div role="group" aria-label="Reorder controls" className="flex gap-2">
        <button onClick={onMoveUp} disabled={!canMoveUp} className={`${baseButtonClasses} ${canMoveUp ? 'bg-blue-100 hover:bg-blue-150 active:bg-blue-200 text-blue-500' : 'bg-gray-100 text-black cursor-not-allowed'}`} aria-label={`Move ${card.title} up in ${category}`} tabIndex={canMoveUp ? 0 : -1}>
          <span aria-hidden="true">↑</span>
          <span className="sr-only">Move Up</span>
        </button>
        <button onClick={onMoveDown} disabled={!canMoveDown} className={`${baseButtonClasses} ${canMoveDown ? 'bg-blue-100 hover:bg-blue-150 active:bg-blue-200 text-blue-500' : 'bg-gray-100 text-black cursor-not-allowed'}`} aria-label={`Move ${card.title} down in ${category}`} tabIndex={canMoveDown ? 0 : -1}>
          <span aria-hidden="true">↓</span>
          <span className="sr-only">Move Down</span>
        </button>
      </div>

      <button onClick={onMoveBetweenCategories} className={`${baseButtonClasses} 
          bg-blue-100 hover:bg-blue-150 active:bg-blue-200 
          flex-grow text-blue-500`} aria-label={`Move ${card.title} to different category`} aria-haspopup="true">
        <span aria-hidden="true">Move to...</span>
        <span className="sr-only">
          Select new category for {card.title}
        </span>
      </button>
    </div>;
};