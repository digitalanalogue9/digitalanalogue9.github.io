import React from 'react';
import { CategoryName } from '@/types';
import { allCategories } from '@/constants/categories';

interface CategorySelectionOverlayProps {
  onCategorySelect: (category: CategoryName) => void;
  isVisible: boolean;
  instruction?: string;
}

export const CategorySelectionOverlay: React.FC<CategorySelectionOverlayProps> = ({
  onCategorySelect,
  isVisible,
  instruction = "Select a category for this card"
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="p-4 text-center text-lg font-semibold">
        {instruction}
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className="bg-blue-100 p-4 rounded-lg text-center font-medium hover:bg-blue-200 active:bg-blue-300"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
