import { CategoryName, Value } from '@/types';
export interface RoundActionsProps {
  remainingCards: Value[];
  canProceedToNextRound: boolean;
  onNextRound: () => void;
  onDrop: (card: Value, category: CategoryName) => void;
  isEndGame: boolean;
}
