import { Command } from './Command';

export class DropCommand extends Command {
  constructor(cardId, category) {
    super('DROP', { cardId, category });
  }
}