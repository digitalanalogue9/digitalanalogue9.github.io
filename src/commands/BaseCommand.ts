import { Command } from '@/types/Command';
import { Position } from '@/types/Position';

export abstract class BaseCommand implements Command {
    public readonly timestamp: number;

    constructor(
        public readonly type: string,
        public readonly payload: unknown
    ) {
        this.timestamp = Date.now();
    }

    public sourcePosition?: Position;
    public targetPosition?: Position;

    setPositions(source?: Position, target?: Position): Command {
        this.sourcePosition = source;
        this.targetPosition = target;
        return this;
    }
}
