import { BaseCommand } from './BaseCommand';
import { CategoryName, Value } from '@/types';
import { getCardPosition, getCategoryPosition } from '@/utils';
import { DropCommandPayload } from '@/types';

export class DropCommand extends BaseCommand {
    constructor(value: Value, category: CategoryName) {
        const payload: DropCommandPayload = { 
            cardId: value.id,
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
