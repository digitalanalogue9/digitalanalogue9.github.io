import { Value } from "@/lib/types";

/** Props for displaying the final results of a values exercise session */
export interface ResultsProps {
    /** Unique identifier for the exercise session */
    sessionId?: string;
    /** Array of selected values from the exercise */
    values?: Value[];
}