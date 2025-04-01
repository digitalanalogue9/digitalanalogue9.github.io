import { Position } from '@/lib/types';
export class Command {
  type: string;
  payload: unknown;
  timestamp: number;
  sourcePosition?: Position;
  targetPosition?: Position;
  constructor(type: string, payload: unknown) {
    this.type = type;
    this.payload = payload;
    this.timestamp = Date.now();
  }
  setPositions(source?: Position, target?: Position) {
    this.sourcePosition = source;
    this.targetPosition = target;
    return this;
  }
}
