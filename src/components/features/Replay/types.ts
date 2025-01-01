import { Value } from '@/lib/types';

/**
 * Represents an animating card with its value and positions.
 */
export interface AnimatingCard {
  /** The value of the card. */
  value: Value;
  /** The source position of the card. */
  sourcePos: { x: number; y: number };
  /** The target position of the card. */
  targetPos: { x: number; y: number };
}
