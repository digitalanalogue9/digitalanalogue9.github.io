/** Type for status */
export type StatusType = 'info' | 'warning' | 'success';

/** Interface for status */
export interface Status {
  /** Status text */
  text: string;
  /** Status type */
  type: StatusType;
  /** Flag indicating if it is end game */
  isEndGame?: boolean;
}
