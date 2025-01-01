import { Categories, Value } from '@/lib/types';
export interface SessionReconstruction {
  categories: Categories;
  currentRound: number;
  remainingCards: Value[];
}
