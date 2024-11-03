import { CategoryName, Value } from '@/types';
export interface RoundActionsProps {
  remainingCards: Value[];
  canProceedToNextRound: boolean;
  onNextRound: () => Promise<void>;
  onDrop: (value: Value, category: CategoryName) => Promise<void>;
  isEndGame?: boolean;  // Add this prop
}
