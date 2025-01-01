import { useEffect, useState } from 'react';
import { useMotionValue, useSpring, MotionValue } from 'framer-motion';
import { Position, AnimationConfig } from '@/lib/types';

/**
 * Custom hook to create animated motion values for x and y positions using springs.
 *
 * @param {Position} initialPosition - The initial position for the animation.
 * @param {AnimationConfig} [config={}] - Optional configuration for the spring animation.
 * @param {number} [config.stiffness=300] - The stiffness of the spring.
 * @param {number} [config.damping=30] - The damping of the spring.
 * @param {number} [config.mass=1] - The mass of the spring.
 * @returns {{ x: MotionValue, y: MotionValue }} - An object containing the animated x and y motion values.
 */
export const useAnimation = (initialPosition: Position, config: AnimationConfig = {}) => {
  const x = useMotionValue(initialPosition.x);
  const y = useMotionValue(initialPosition.y);
  const springX = useSpring(x, {
    stiffness: config.stiffness ?? 300,
    damping: config.damping ?? 30,
    mass: config.mass ?? 1,
  });
  const springY = useSpring(y, {
    stiffness: config.stiffness ?? 300,
    damping: config.damping ?? 30,
    mass: config.mass ?? 1,
  });
  return {
    x: springX,
    y: springY,
  };
};
