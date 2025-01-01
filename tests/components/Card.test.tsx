// in Card.test.tsx
import { createMockValue, resetMockIdCounter } from '../utils/mockData';

describe('Card Component', () => {
  beforeEach(() => {
    resetMockIdCounter(); // Optional: reset ID counter before each test
  });

  it('renders card content correctly', () => {
    const testValue = createMockValue({
      title: 'Test Title',
      description: 'Test Description',
    });
    // testValue.id will be 1
    // ... rest of the test
  });

  it('other test case', () => {
    const testValue = createMockValue({
      title: 'Another Title',
      description: 'Another Description',
    });
    // testValue.id will be 2
    // ... rest of the test
  });

  it('can override id if needed', () => {
    const testValue = createMockValue({
      id: 'test-card-id',
      title: 'Specific ID Test',
      description: 'Test Description',
    });
    // testValue.id will be 35
  });
});
