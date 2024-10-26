export type CategoryName = 'Very Important' | 'Quite Important' | 'Important' | 'Of Some Importance' | 'Not Important';

export type Categories = {
    [key in CategoryName]: Value[];
}

export interface Session {
    id: string;
    timestamp: number;
    targetCoreValues: number;
    currentRound: number;
}

export interface Round {
    sessionId: string;
    roundNumber: number;
    commands: Command[];
}

export interface Command {
    type: string;
    payload: any;
    timestamp: number;
}

export interface DropCommandPayload {
    cardId: string;
    category: CategoryName;
}

export interface MoveCommandPayload {
    cardId: string;
    fromCategory: CategoryName;
    toCategory: CategoryName;
}

export type Value = {
    id: number;
    title: string;
    description: string;
    category?: Category;
};

export enum Category {
    ESSENTIAL = "ESSENTIAL",
    VERY_IMPORTANT = "VERY_IMPORTANT",
    IMPORTANT = "IMPORTANT",
    NOT_IMPORTANT = "NOT_IMPORTANT",
    DROPPED = "DROPPED"
}