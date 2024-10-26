import { CategoryName } from "./CategoryName";


export interface MoveCommandPayload {
    cardId: string;
    fromCategory: CategoryName;
    toCategory: CategoryName;
}
