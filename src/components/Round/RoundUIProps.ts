import { Categories, CategoryName, Value } from '@/types';

export interface RoundUIProps {
    maxCards: number;
    showResults: boolean;
    sessionId?: string;
    roundNumber: number;
    targetCoreValues: number;
    remainingCards: Value[];
    categories: Categories;
    currentRoundCommands: any[];  // Consider creating a specific type for commands
    canProceedToNextRound: boolean;
    isEndGameReady: boolean;
    onMoveCard: (category: CategoryName, fromIndex: number, toIndex: number) => Promise<void>;
    onMoveBetweenCategories: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => Promise<void>;
    onDrop: (value: Value, category: CategoryName) => Promise<void>;
    onNextRound: () => Promise<void>;
}
