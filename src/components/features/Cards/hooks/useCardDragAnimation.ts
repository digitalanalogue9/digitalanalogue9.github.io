import { useState } from 'react';
import { Position } from "@/lib/types";
import { useAnimation } from '@/lib/hooks/useAnimation';
export const useCardDragAnimation = (initialPosition: Position, onDragEnd?: (endPosition: Position) => void) => {
  const [isDragging, setIsDragging] = useState(false);
  const {
    x,
    y
  } = useAnimation(initialPosition, {
    stiffness: 500,
    damping: 35,
    mass: 1
  });
  const handleDragStart = () => {
    setIsDragging(true);
  };
  const handleDragEnd = () => {
    setIsDragging(false);
    if (onDragEnd) {
      onDragEnd({
        x: x.get(),
        y: y.get()
      });
    }
  };
  return {
    isDragging,
    x,
    y,
    handleDragStart,
    handleDragEnd
  };
};