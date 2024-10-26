import { Value } from '@/types';

let currentMockId = 1;

export const createMockValue = (overrides?: Partial<Value>): Value => {
  // Ensure ID stays within 1-35 range, cycling back to 1 if exceeded
  const id = overrides?.id ?? currentMockId;
  currentMockId = (currentMockId % 35) + 1;

  return {
    title: 'Mock Title',
    description: 'Mock Description',
    ...overrides,
    // Ensure id stays within valid range even if provided in overrides
    id: typeof overrides?.id === 'number' 
      ? Math.max(1, Math.min(35, overrides.id))
      : id
  };
};

// Reset the mock ID counter (useful between test suites)
export const resetMockIdCounter = () => {
  currentMockId = 1;
};