import { CategoryName, Value } from '@/lib/types';

/** Props for round actions */
export interface RoundActionsProps {
  /** List of remaining cards */
  remainingCards: Value[];
  /** Target core values */
  targetCoreValues: number;
  /** Flag indicating if can proceed to next round */
  canProceedToNextRound: boolean;
  /** Callback to proceed to next round */
  onNextRound: () => void;
  /** Callback to early finish */
  onEarlyFinish: () => void;
  /** Callback when a card is dropped */
  onDrop: (card: Value, category: CategoryName) => void;
  /** Flag indicating if it is end game */
  isEndGame: boolean;
  /** Callback to set show details flag */
  setShowDetails?: (show: boolean) => void;
}

/** Props for round actions with active zone */
export interface RoundActionsPropsWithActiveZone extends RoundActionsProps {
  /** Callback when active drop zone changes */
  onActiveDropZoneChange?: (category: CategoryName | null) => void;
  /** Selected mobile card */
  selectedMobileCard?: Value | null;
  /** Callback when mobile card is selected */
  onMobileCardSelect?: (card: Value | null) => void;
}
