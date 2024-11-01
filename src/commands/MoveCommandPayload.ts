import { CategoryName } from '../types/CategoryName';

export interface MoveCommandPayload {
  cardId: string;
  fromCategory: CategoryName;
  toCategory: CategoryName;
  fromIndex?: number;
  toIndex?: number;
}
