import { CategoryName, Value } from '@/types';


export interface RoundActionsProps {
  remainingCards: Value[];
  canProceedToNextRound: boolean;
  onNextRound: () => void;
  onDrop: (value: Value, category: CategoryName) => Promise<void>;
}