import { Value } from '@/types';

export const getRandomValues = (values: Value[]): Value[] => {
  const shuffled = [...values].sort(() => Math.random() - 0.5);
  return shuffled;
};