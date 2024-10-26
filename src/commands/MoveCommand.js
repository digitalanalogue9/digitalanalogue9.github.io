import { Command } from './Command';

export class MoveCommand extends Command {
  constructor(cardId, fromCategory, toCategory) {
    super('MOVE', { cardId, fromCategory, toCategory });
  }
}