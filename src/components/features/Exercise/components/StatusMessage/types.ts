/** Props for status message */
export interface StatusMessageProps {
    /** Status object containing text and type */
    status: {
      text: string;
      type: 'info' | 'warning' | 'success';
      isEndGame?: boolean;
    };
    /** Flag indicating if nearing completion */
    isNearingCompletion: boolean;
    /** Flag indicating if there are too many important cards */
    hasTooManyImportantCards: boolean;
    /** Flag indicating if there are not enough important cards */
    hasNotEnoughImportantCards: boolean;
    /** Flag indicating if there are enough cards */
    hasEnoughCards: boolean;
    /** Target number of core values */
    targetCoreValues: number;
    /** Flag indicating if can proceed to next round */
    canProceedToNextRound: boolean;
    /** List of remaining cards */
    remainingCards: any[];
    /** Flag indicating if details should be shown */
    showDetails?: boolean;
    /** Callback to set show details flag */
    setShowDetails?: (show: boolean) => void;
    /** Total number of active cards */
    totalActiveCards: number;
    /** Flag indicating if target core values are in Very Important category */
    hasTargetCoreValuesInVeryImportant: boolean;
  }