// src/lib/types/Animation.ts
import { MotionValue } from 'framer-motion';
import { Position } from './Position';

export interface AnimationConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
  duration?: number;
}
