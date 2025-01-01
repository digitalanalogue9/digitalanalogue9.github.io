import { CategoryName } from './CategoryName';
export interface DropCommandPayload {
  cardId: string;
  cardTitle: string; // Add this
  category: CategoryName;
}
