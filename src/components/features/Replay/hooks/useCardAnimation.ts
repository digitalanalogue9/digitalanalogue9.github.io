import { useState, useEffect } from 'react';

export const useCardAnimation = (
  sourcePosition: { x: number; y: number },
  targetPosition: { x: number; y: number },
  duration: number = 500
) => {
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
        const eased = easeOutQuart(progress);
        
        // Calculate direct path
        const x = sourcePosition.x + (targetPosition.x - sourcePosition.x) * eased;
        const y = sourcePosition.y + (targetPosition.y - sourcePosition.y) * eased;

        setPosition({ x, y });

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

// Using easeOutQuart for a more natural dragging feel
const easeOutQuart = (t: number): number => {
  return 1 - Math.pow(1 - t, 4);
};
