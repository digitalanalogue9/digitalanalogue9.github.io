import { ValueWithReason } from './ValueWithReason';

export interface CompletedSession {
    sessionId: string;
    finalValues: ValueWithReason[];
    timestamp: number;
}
