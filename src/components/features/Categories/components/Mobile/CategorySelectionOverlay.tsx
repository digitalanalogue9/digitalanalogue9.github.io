import type { CategorySelectionOverlayProps } from '@/components/features/Categories/types';
// src/components/Mobile/CategorySelectionOverlay.tsx
import React from 'react';
import { allCategories } from "@/components/features/Categories/constants/categories";
import { CategoryName } from "@/lib/types";
/**
 * CategorySelectionOverlay component renders an overlay for selecting categories.
 * 
 * @param {CategorySelectionOverlayProps} props - The props for the component.
 * @param {function} props.onCategorySelect - Callback function to handle category selection.
 * @param {boolean} props.isVisible - Determines if the overlay is visible.
 * @param {string} [props.instruction="Select a category for this card"] - Instruction text displayed at the top of the overlay.
 * 
 * @returns {JSX.Element | null} The rendered overlay component or null if not visible.
 * 
 * @example
 * <CategorySelectionOverlay
 *   onCategorySelect={(category) => console.log(category)}
 *   isVisible={true}
 * />
 */
export const CategorySelectionOverlay: React.FC<CategorySelectionOverlayProps> = ({
  onCategorySelect,
  isVisible,
  instruction = "Select a category for this card"
}) => {
  if (!isVisible) return null;

  return <div className="fixed inset-0 bg-white z-50 flex flex-col" role="dialog" aria-modal="true" aria-labelledby="category-selection-title">
      <div className="p-4 text-center" role="heading" aria-level={2}>
        <h2 id="category-selection-title" className="text-lg font-semibold">
          {instruction}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4" role="group" aria-label="Available categories">
        {allCategories.map((category, index) => <button key={category} onClick={() => onCategorySelect(category)} className="bg-blue-100 p-4 rounded-lg text-center font-medium 
                     hover:bg-blue-200 active:bg-blue-300 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" aria-label={`Select ${category} category`} tabIndex={0}
      // Improved keyboard navigation
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          onCategorySelect(category);
        }
        // Add arrow key navigation
        if (e.key === 'ArrowRight' && index < allCategories.length - 1) {
          const nextButton = document.querySelector(`[data-category-index="${index + 1}"]`) as HTMLElement;
          nextButton?.focus();
        }
        if (e.key === 'ArrowLeft' && index > 0) {
          const prevButton = document.querySelector(`[data-category-index="${index - 1}"]`) as HTMLElement;
          prevButton?.focus();
        }
      }} data-category-index={index}>
            <span className="sr-only">Select category: </span>
            {category}
          </button>)}
      </div>

      {/* Add a hidden close button for screen readers */}
      <button onClick={() => onCategorySelect(allCategories[0])} // Default to first category
    className="sr-only" aria-label="Close category selection">
        Close
      </button>
    </div>;
};