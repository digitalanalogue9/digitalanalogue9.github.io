import { render, screen, fireEvent } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Card from '../../src/components/Card';

const mockValue = {
  title: "TEST VALUE",
  description: "Test description"
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <DndProvider backend={HTML5Backend}>
    {children}
  </DndProvider>
);

describe('Card Component', () => {
  it('renders title and description', () => {
    render(
      <TestWrapper>
        <Card value={mockValue} />
      </TestWrapper>
    );
    
    expect(screen.getByText('TEST VALUE')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('toggles description visibility when title is clicked', () => {
    render(
      <TestWrapper>
        <Card value={mockValue} inCategory={true} />
      </TestWrapper>
    );
    
    const description = screen.getByText('Test description');
    const title = screen.getByText('TEST VALUE');
    
    expect(description).toBeInTheDocument();
    fireEvent.click(title);
    expect(description).not.toBeVisible();
  });
});
