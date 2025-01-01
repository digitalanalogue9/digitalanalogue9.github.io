import { useState } from 'react';
import { Position } from '@/lib/types';
import { useAnimation } from '@/lib/hooks/useAnimation';
/**
 * Custom hook to handle card drag animations.
 *
 * @param {Position} initialPosition - The initial position of the card.
 * @param {(endPosition: Position) => void} [onDragEnd] - Optional callback function to be called when dragging ends.
 * @returns {Object} An object containing:
 * - `isDragging` (boolean): Indicates whether the card is currently being dragged.
 * - `x` (AnimatedValue): The animated x-coordinate of the card.
 * - `y` (AnimatedValue): The animated y-coordinate of the card.
 * - `handleDragStart` (function): Function to call when dragging starts.
 * - `handleDragEnd` (function): Function to call when dragging ends.
 */
export const useCardDragAnimation = (initialPosition: Position, onDragEnd?: (endPosition: Position) => void) => {
  const [isDragging, setIsDragging] = useState(false);
  const { x, y } = useAnimation(initialPosition, {
    stiffness: 500,
    damping: 35,
    mass: 1,
  });
  const handleDragStart = () => {
    setIsDragging(true);
  };
  const handleDragEnd = () => {
    setIsDragging(false);
    if (onDragEnd) {
      onDragEnd({
        x: x.get(),
        y: y.get(),
      });
    }
  };
  return {
    isDragging,
    x,
    y,
    handleDragStart,
    handleDragEnd,
  };
};
