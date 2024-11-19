import { CategoryName } from "./CategoryName";

export interface MoveCommandPayload {
    cardId: string;
    cardTitle: string; // Add this
    fromCategory: CategoryName;
    toCategory: CategoryName;
    fromIndex?: number;
    toIndex?: number;
}