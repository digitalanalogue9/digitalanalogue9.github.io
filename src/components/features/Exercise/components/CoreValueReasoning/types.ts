import { Value, ValueWithReason } from "../../../../../lib/types";

/** Props for the component where users provide reasoning for their core value selections */
export interface CoreValueReasoningProps {
    /** Array of values that the user selected as most important */
    values: Value[];
    /** Callback function called when user completes adding reasons for their values */
    onComplete: (valuesWithReasons: ValueWithReason[]) => void;
  }