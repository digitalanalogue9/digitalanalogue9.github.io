import { Categories, CategoryName, Value } from '@/lib/types';

/** Props for round UI */
export interface RoundUIProps {
  /** Maximum number of cards */
  maxCards: number;
  /** Flag indicating if results should be shown */
  showResults: boolean;
  /** Session ID */
  sessionId?: string;
  /** Current round number */
  roundNumber: number;
  /** Target number of core values */
  targetCoreValues: number;
  /** List of remaining cards */
  remainingCards: Value[];
  /** List of categories */
  categories: Categories;
  /** List of current round commands */
  currentRoundCommands: unknown[];
  /** Flag indicating if can proceed to next round */
  canProceedToNextRound: boolean;
  /** Flag indicating if end game is ready */
  isEndGameReady: boolean;
  /** Callback to move a card */
  onMoveCard: (category: CategoryName, fromIndex: number, toIndex: number) => Promise<void>;
  /** Callback to move a card between categories */
  onMoveBetweenCategories: (value: Value, fromCategory: CategoryName, toCategory: CategoryName) => Promise<void>;
  /** Callback when a card is dropped */
  onDrop: (value: Value, category: CategoryName) => Promise<void>;
  /** Callback to proceed to next round */
  onNextRound: () => Promise<void>;
}
