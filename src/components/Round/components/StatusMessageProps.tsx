export interface StatusMessageProps {
    status: { text: string; type: 'info' | 'warning' | 'success'; };
    isNearingCompletion: boolean;
    hasTooManyImportantCards: boolean;
    hasNotEnoughImportantCards: boolean;
    hasEnoughCards: boolean;
    targetCoreValues: number;
    canProceedToNextRound: boolean;
    remainingCards: any[];
}
