// src/components/CategoryColumn.tsx
import { Value, CategoryName } from "@/lib/types";
import { Card } from "@/components/features/Cards/components"; // Change this import
import {CategoryColumnProps} from "./types";

/**
 * CategoryColumn component represents a column in a Kanban-style board.
 * It allows for drag-and-drop functionality to reorder cards within the column
 * or move cards between different columns.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.title - The title of the category.
 * @param {Array} props.cards - The list of cards in the category.
 * @param {Function} props.onDrop - Callback function when a card is dropped into the category.
 * @param {Function} props.onMoveWithinCategory - Callback function when a card is moved within the same category.
 * @param {Function} props.onMoveBetweenCategories - Callback function when a card is moved between different categories.
 * @param {number} props.columnIndex - The index of the column.
 *
 * @returns {JSX.Element} The rendered CategoryColumn component.
 */
export default function CategoryColumn({
  title,
  cards,
  onDrop,
  onMoveWithinCategory,
  onMoveBetweenCategories,
  columnIndex
}: CategoryColumnProps) {


  const findDropIndex = (mouseY: number, container: HTMLElement): number => {
    const cardElements = container.querySelectorAll('[data-card-id]');
    const containerRect = container.getBoundingClientRect();
    
    // If no cards or mouse is above all cards, return 0
    if (cardElements.length === 0 || mouseY < containerRect.top) {
      return 0;
    }
    
    // If mouse is below all cards, return length
    if (mouseY > containerRect.bottom) {
      return cards.length;
    }

    // Find the card the mouse is closest to
    for (let i = 0; i < cardElements.length; i++) {
      const cardRect = cardElements[i].getBoundingClientRect();
      const cardMiddle = cardRect.top + (cardRect.height / 2);
      
      if (mouseY < cardMiddle) {
        return i;
      }
    }

    // If we get here, the mouse is below the middle of the last card
    return cards.length;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('bg-gray-50');
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-gray-50');
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-gray-50');
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const dropContainer = e.currentTarget.querySelector('.space-y-2') as HTMLElement | null;;
      
      if (!dropContainer) return;
      const toIndex = findDropIndex(e.clientY, dropContainer);

      // If dropping into the same category
      if (data.sourceCategory === title) {
        // const fromIndex = data.sourceIndex;
        // const toIndex = cards.length -1 ; // Drop at the end
        // onMoveWithinCategory(fromIndex, toIndex);
        const fromIndex = data.sourceIndex;
        if (fromIndex !== toIndex) {
          onMoveWithinCategory(fromIndex, toIndex);
        }
      }
      // If dropping from another category
      else if (data.sourceCategory) {
        onMoveBetweenCategories({
          id: data.id,
          title: data.title,
          description: data.description
        }, data.sourceCategory, title);
      }
      // If dropping a new card
      else {
        onDrop({
          id: data.id,
          title: data.title,
          description: data.description
        }, title);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };
  return <div className="bg-white rounded-lg shadow-sm p-4 transition-colors duration-200 w-full" data-category={title} aria-label={`${title} category`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-black flex items-center justify-between w-full">
          <span>{title}</span>
          <span className="bg-gray-100 rounded-full px-2.5 py-0.5 text-sm font-medium text-black ml-2">
            {cards.length}
          </span>
        </h2>
      </div>

      <div className="border-2 border-dashed border-gray-400 rounded-lg p-2 min-h-[400px] transition-colors duration-200" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} role="region" aria-label={`Drop zone for ${title} category`}>
        <div className="space-y-2">
          {cards.map((card, index) => <div key={card.id} className="transition-all duration-200">
              <Card data-card-id={card.id} value={card} columnIndex={index} currentCategory={title} onDrop={value => onDrop(value, title, index)} onMoveUp={index > 0 ? () => onMoveWithinCategory(index, index - 1) : undefined} onMoveDown={index < cards.length ? () => onMoveWithinCategory(index, index + 1) : undefined} onMoveBetweenCategories={onMoveBetweenCategories} />
              {/* <Card data-card-id={card.id} value={card} columnIndex={index} currentCategory={title} onDrop={value => onDrop(value, title, index)} onMoveUp={() => onMoveWithinCategory(index, index - 1)} onMoveDown={() => onMoveWithinCategory(index, index + 1)} onMoveBetweenCategories={onMoveBetweenCategories} /> */}
            </div>)}
        </div>

        <div className={`text-black text-sm text-center py-4 mt-2 ${cards.length === 0 ? '' : 'border-t-2 border-dashed border-gray-400'}`}>
          Drop values here
        </div>
      </div>
    </div>;
}