import { Categories, Value } from '@/types';

export interface SessionReconstruction {
  categories: Categories;
  currentRound: number;
  remainingCards: Value[];
}
