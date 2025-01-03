import { BaseCommand } from './BaseCommand';
import { CategoryName, Value } from '@/lib/types';
import { getCardPosition, getCategoryPosition } from '@/lib/utils/dom';
import { MoveCommandPayload } from '@/lib/types';
export class MoveCommand extends BaseCommand {
  constructor(
    value: Value,
    fromCategory: CategoryName,
    toCategory: CategoryName,
    fromIndex?: number,
    toIndex?: number
  ) {
    const payload: MoveCommandPayload = {
      cardId: value.id,
      cardTitle: value.title,
      fromCategory,
      toCategory,
      fromIndex,
      toIndex,
    };
    super('MOVE', payload);

    // Capture positions when command is created
    const sourcePos = getCardPosition(value.id);
    const targetPos = getCategoryPosition(toCategory);
    this.setPositions(sourcePos, targetPos);
  }
  getPayload(): MoveCommandPayload {
    return this.payload as MoveCommandPayload;
  }
}
