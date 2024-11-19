import { useState, useEffect } from 'react';
import { Position } from "@/lib/types";
export const useCardAnimation = (sourcePosition: {
  x: number;
  y: number;
}, targetPosition: {
  x: number;
  y: number;
}, duration: number = 500) => {
  const [position, setPosition] = useState(sourcePosition);
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    if (isAnimating) {
      const startTime = Date.now();
      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const eased = easeInOutCubic(progress);
        setPosition({
          x: sourcePosition.x + (targetPosition.x - sourcePosition.x) * eased,
          y: sourcePosition.y + (targetPosition.y - sourcePosition.y) * eased
        });
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isAnimating, sourcePosition, targetPosition, duration]);
  const startAnimation = () => {
    setIsAnimating(true);
  };
  return {
    position,
    isAnimating,
    startAnimation
  };
};

// Cubic easing function for smooth animation
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};