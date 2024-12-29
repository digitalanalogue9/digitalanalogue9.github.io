import { Value } from "./Value";

/** Extends the base Value type to include user's reasoning for selecting it */
export interface ValueWithReason extends Value {
    /** User's explanation for why this value is important to them */
    reason?: string;
  }