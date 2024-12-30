import { BaseCommand } from './BaseCommand';
import { CategoryName, Value } from "../../../../lib/types";
import { getCardPosition, getCategoryPosition } from "../../../../lib/utils";
import { DropCommandPayload } from "../../../../lib/types";
/**
 * Represents a command to drop a card into a category.
 * Extends the BaseCommand class.
 *
 * @class DropCommand
 * @extends {BaseCommand}
 * 
 * @param {Value} value - The value object containing card details.
 * @param {CategoryName} category - The name of the category where the card is to be dropped.
 * 
 * @property {DropCommandPayload} payload - The payload containing card ID, card title, and category.
 * 
 * @method getPayload - Returns the payload of the drop command.
 */
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