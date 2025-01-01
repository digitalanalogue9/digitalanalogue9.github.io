import { Position } from '@/lib/types';
export class Command {
  type: string;
  payload: any;
  timestamp: number;
  sourcePosition?: Position;
  targetPosition?: Position;
  constructor(type: string, payload: any) {
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
