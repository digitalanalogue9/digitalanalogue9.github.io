import { CategoryName } from '../types/CategoryName';

export interface DropCommandPayload {
    cardId: string;
    category: CategoryName;
    // other properties...
}
