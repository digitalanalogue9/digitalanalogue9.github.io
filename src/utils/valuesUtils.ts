import { Value } from '@/types/Value';
import values from '../data/values.json';
import { getEnvNumber } from './envUtils';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Get initial random values for first round
export const getInitialRandomValues = (): Value[] => {
    const maxCards = getEnvNumber('MAX_CARDS', values.values.length);
    const shuffledValues = shuffleArray(values.values);
    return shuffledValues.slice(0, maxCards);
};

export const getRandomValues = (currentValues: Value[]): Value[] => {
    return shuffleArray(currentValues);
};
