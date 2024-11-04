import { Value } from './Value';

export interface CompletedSession {
    sessionId: string;
    finalValues: Value[];
    timestamp: number;
}
