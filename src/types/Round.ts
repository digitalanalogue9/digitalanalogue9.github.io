import { Command } from "./Command";


export interface Round {
    sessionId: string;
    roundNumber: number;
    commands: Command[];
}
