import { CategoryName, Categories, Value } from '@/types';

export interface RoundHeaderProps {
  targetCoreValues: number;
  roundNumber: number;
  remainingCardsCount: number;
}

export interface RoundActionsProps {
  remainingCards: Value[];
  canProceedToNextRound: boolean;
  onNextRound: () => void;
  onDrop: (value: Value, category: CategoryName) => Promise<void>;
}

export interface CategoryGridProps {
  categories: Categories;
  onDrop: (value: Value, category: CategoryName) => Promise<void>;
  onMoveCard: (category: CategoryName, fromIndex: number, toIndex: number) => Promise<void>;
  onMoveBetweenCategories: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => Promise<void>;
}
