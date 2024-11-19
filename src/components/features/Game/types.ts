import { Value, CategoryName } from "@/lib/types";

export interface StartScreenProps {
  onStart: () => void;
}

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

export interface CoreValueReasoningProps {
  values: Value[];
  onComplete: (valuesWithReasons: ValueWithReason[]) => void;
}