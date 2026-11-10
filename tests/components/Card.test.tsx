// in Card.test.tsx
import { createMockValue, resetMockIdCounter } from '../utils/mockData';

describe('Card Component', () => {
  beforeEach(() => {
    resetMockIdCounter(); // Optional: reset ID counter before each test
  });

  it('renders card content correctly', () => {
    createMockValue({
      title: 'Test Title',
      description: 'Test Description',
    });

    // ... rest of the test
  });

  it('other test case', () => {
    createMockValue({
      title: 'Another Title',
      description: 'Another Description',
    });

    // ... rest of the test
  });

  it('can override id if needed', () => {
    createMockValue({
      id: 'test-card-id',
      title: 'Specific ID Test',
      description: 'Test Description',
    });
  });
});
