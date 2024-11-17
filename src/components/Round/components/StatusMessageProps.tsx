// src/components/Round/components/StatusMessageProps.tsx
export interface StatusMessageProps {
    status: {
      text: string;
      type: 'info' | 'warning' | 'success';
      isEndGame?: boolean;
    };
    isNearingCompletion: boolean;
    hasTooManyImportantCards: boolean;
    hasNotEnoughImportantCards: boolean;
    hasEnoughCards: boolean;
    targetCoreValues: number;
    canProceedToNextRound: boolean;
    remainingCards: any[];
    showDetails?: boolean;
    setShowDetails?: (show: boolean) => void;
  }
  