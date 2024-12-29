import { Value, CategoryName, Categories } from "@/lib/types";

export interface StatusState {
  remainingCards: Value[];
  targetCoreValues: number;
  categories: Categories;
  hasMinimumNotImportant: boolean;
  hasEnoughCards: boolean;
  isNearingCompletion: boolean;
  veryImportantCount: number;
  totalActiveCards: number;
  hasTargetCoreValuesInVeryImportant : boolean;
}

/** State interface tracking the current round's status and progress */
export interface RoundState {
  /** Number of cards currently in play */
  activeCards: number;
  /** Total number of cards across all categories */
  totalActiveCards: number;
  /** List of categories that can receive cards */
  validCategories: CategoryName[];
  /** List of categories currently in use */
  activeCategories: CategoryName[];
  /** Categories and their cards currently visible */
  visibleCategories: Categories;
  /** Count of cards in the Very Important category */
  veryImportantCount: number;
  /** Count of cards in the Not Important category */
  notImportantCount: number;
  /** Flag indicating if nearing round completion */
  isNearingCompletion: boolean;
  /** Flag indicating if minimum card requirement is met */
  hasEnoughCards: boolean;
  /** Flag indicating if Not Important category meets minimum requirement */
  hasMinimumNotImportant: boolean;
  /** Flag indicating if Important category has too many cards */
  hasTooManyImportantCards: boolean;
  /** Flag indicating if Important category needs more cards */
  hasNotEnoughImportantCards: boolean;
  /** Flag indicating if ready to end the game */
  isEndGameReady: boolean;
  /** Flag indicating if core values have been identified */
  hasFoundCoreValues: boolean;
  /** Flag indicating if Very Important category has target number of core values */
  hasTargetCoreValuesInVeryImportant: boolean;
  /** Current state of all categories */
  categories: Categories;
}

/** Type for status */
export type StatusType = 'info' | 'warning' | 'success';

/** Interface for status */
export interface Status {
  /** Status text */
  text: string;
  /** Status type */
  type: StatusType;
  /** Flag indicating if it is end game */
  isEndGame?: boolean;
}
