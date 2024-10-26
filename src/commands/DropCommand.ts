import { Command } from './Command';

interface DropCommandPayload {
  cardId: string;
  category: string;
}

export class DropCommand extends Command {
  constructor(cardId: string, category: string) {
    super('DROP', { cardId, category });
  }

  getPayload(): DropCommandPayload {
    return this.payload as DropCommandPayload;
  }
}
