import { Categories, Command, Value } from "../../../../../lib/types";

/** Props for replaying previous round */
export interface ReplayPreviousRoundProps {
  /** Session ID */
  sessionId: string;
  /** Current round number */
  roundNumber: number;
  /** List of categories */
  categories: Categories;
  /** List of remaining cards */
  remainingCards: Value[];
  /** Callback to set categories */
  setCategories: (categories: Categories) => void;
  /** Callback to set remaining cards */
  setRemainingCards: (cards: Value[]) => void;
  /** Callback to add a command */
  addCommand: (command: Command) => Promise<void>;
}
