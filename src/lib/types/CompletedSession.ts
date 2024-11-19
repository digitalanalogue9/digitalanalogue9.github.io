import { Value } from './Value';

export interface ValueWithReason extends Value {
    reason?: string;
  }

export interface CompletedSession {
    sessionId: string;
    finalValues: ValueWithReason[];
    timestamp: number;
}
