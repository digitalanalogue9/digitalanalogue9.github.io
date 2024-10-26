import { Command } from './Command';

interface MoveCommandPayload {
  cardId: string;
  fromCategory: string;
  toCategory: string;
}

export class MoveCommand extends Command {
  constructor(cardId: string, fromCategory: string, toCategory: string) {
    super('MOVE', { cardId, fromCategory, toCategory });
  }

  getPayload(): MoveCommandPayload {
    return this.payload as MoveCommandPayload;
  }
}
