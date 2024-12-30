import { Command } from "../../../../lib/types/Command";
import { Position } from "../../../../lib/types/Position";
/**
 * Abstract base class for commands.
 * 
 * @implements {Command}
 */
export abstract class BaseCommand implements Command {
  /**
   * The timestamp when the command was created.
   * @readonly
   */
  public readonly timestamp: number;

  /**
   * Creates an instance of BaseCommand.
   * 
   * @param {string} type - The type of the command.
   * @param {unknown} payload - The payload of the command.
   */
  constructor(public readonly type: string, public readonly payload: unknown) {
    this.timestamp = Date.now();
  }

  /**
   * The source position of the command.
   */
  public sourcePosition?: Position;

  /**
   * The target position of the command.
   */
  public targetPosition?: Position;

  /**
   * Sets the source and target positions for the command.
   * 
   * @param {Position} [source] - The source position.
   * @param {Position} [target] - The target position.
   * @returns {Command} The command instance.
   */
  setPositions(source?: Position, target?: Position): Command {
    this.sourcePosition = source;
    this.targetPosition = target;
    return this;
  }
}