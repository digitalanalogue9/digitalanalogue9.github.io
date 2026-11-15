import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { RecurringReflectionControls } from '../../src/app/completed/RecurringReflectionControls';

afterEach(cleanup);

test('shows copy confirmation around the prompt and restarts it on another copy', () => {
  const { rerender } = render(
    <RecurringReflectionControls recurringPrompt="Prompt" onPromptChange={vi.fn()} copyConfirmationCount={1} />
  );
  const prompt = screen.getByRole('textbox', { name: 'Recurring prompt' });
  const firstFlash = prompt.parentElement?.querySelector('.copy-prompt-flash');
  expect(firstFlash).toBeInTheDocument();

  rerender(<RecurringReflectionControls recurringPrompt="Prompt" onPromptChange={vi.fn()} copyConfirmationCount={2} />);
  expect(prompt.parentElement?.querySelector('.copy-prompt-flash')).not.toBe(firstFlash);

  rerender(<RecurringReflectionControls recurringPrompt="Prompt" onPromptChange={vi.fn()} />);
  expect(prompt.parentElement?.querySelector('.copy-prompt-flash')).toBeNull();
});

test('shows setup guidance only after a service is selected', () => {
  render(<RecurringReflectionControls recurringPrompt="Prompt" onPromptChange={vi.fn()} />);

  const select = screen.getByRole('combobox', { name: 'Setup instructions' });
  expect(select).toHaveValue('');
  expect(select).toHaveDisplayValue('Show setup instructions for…');
  for (const name of ['Copilot', 'Claude', 'ChatGPT']) {
    expect(screen.queryByRole('heading', { name, exact: true })).not.toBeInTheDocument();
  }
  for (const name of ['Copilot', 'Claude', 'ChatGPT']) {
    fireEvent.change(select, { target: { value: screen.getByRole('option', { name }).getAttribute('value') } });
    expect(screen.getByRole('heading', { name, exact: true })).toBeVisible();
  }
});
