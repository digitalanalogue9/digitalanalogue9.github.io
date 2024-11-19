import { Position } from './Position';

export interface BaseCommand {
  sourcePosition?: Position;
  targetPosition?: Position;
}
