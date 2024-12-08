import { Value, CategoryName } from "@/lib/types";

export interface ResultsProps {
  sessionId?: string;
  values?: Value[];
}

export interface CoreValueReasoningProps {
  values: Value[];
  onComplete: (valuesWithReasons: ValueWithReason[]) => void;
}

export interface ValueWithReason extends Value {
  reason?: string;
}