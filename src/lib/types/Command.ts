import { Position } from './Position';

export interface Command {
  type: string;
  payload: unknown;
  timestamp: number;
  sourcePosition?: Position;
  targetPosition?: Position;
  setPositions(source?: Position, target?: Position): Command;
}
