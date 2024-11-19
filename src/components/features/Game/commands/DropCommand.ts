import { BaseCommand } from './BaseCommand';
import { CategoryName, Value } from "@/lib/types";
import { getCardPosition, getCategoryPosition } from "@/lib/utils";
import { DropCommandPayload } from "@/lib/types";
export class DropCommand extends BaseCommand {
  constructor(value: Value, category: CategoryName) {
    const payload: DropCommandPayload = {
      cardId: value.id,
      cardTitle: value.title,
      category
    };
    super('DROP', payload);

    // Capture positions when command is created
    const sourcePos = getCardPosition(value.id);
    const targetPos = getCategoryPosition(category);
    this.setPositions(sourcePos, targetPos);
  }
  getPayload(): DropCommandPayload {
    return this.payload as DropCommandPayload;
  }
}