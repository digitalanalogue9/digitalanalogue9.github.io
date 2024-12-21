import { Categories } from "./Categories";
import { Command } from "./Command";
import { Value } from "./Value";


export interface Round {
    sessionId: string;
    roundNumber: number;
    commands: Command[];
    availableCategories: Categories; // Add this to store the calculated categories for the round
    timestamp: number;
}
