import { useEffect, useState } from 'react';
import { useMotionValue, useSpring, MotionValue } from 'framer-motion';
import { Position } from '@/types';

interface AnimationConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
  duration?: number;
}

export const useAnimation = (
  initialPosition: Position,
  config: AnimationConfig = {}
) => {
  const x = useMotionValue(initialPosition.x);
  const y = useMotionValue(initialPosition.y);

  const springX = useSpring(x, {
    stiffness: config.stiffness ?? 300,
    damping: config.damping ?? 30,
    mass: config.mass ?? 1
  });

  const springY = useSpring(y, {
    stiffness: config.stiffness ?? 300,
    damping: config.damping ?? 30,
    mass: config.mass ?? 1
  });

  return { x: springX, y: springY };
};