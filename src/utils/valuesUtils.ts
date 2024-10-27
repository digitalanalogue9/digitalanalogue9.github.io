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
    const maxCards = getEnvNumber('maxCards', 15);
    const shuffledValues = shuffleArray(values.values);
    const slicedShuffledValues =  shuffledValues.slice(0, maxCards);
    console.log('getInitialRandomValues maxCards:', maxCards, ' values length', values.values.length, ' slicedShuffledValues length', slicedShuffledValues.length);
    return slicedShuffledValues;
};

export const getRandomValues = (currentValues: Value[]): Value[] => {
    console.log('getRandomValues input length:', currentValues.length);
    var shuffledValues = shuffleArray(currentValues);
    console.log('getRandomValues shuffled length:', shuffledValues.length);
    return shuffledValues;
};