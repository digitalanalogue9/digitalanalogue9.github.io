// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AboutPage from '../src/personal/AboutPage';
import ContactPage from '../src/personal/ContactPage';
import HelpPage from '../src/personal/HelpPage';
import LinkedInShareButton from '../src/components/common/ShareButtons/LinkedInShareButton';
import PersonalShareButtons from '../src/personal/PersonalShareButtons';
import { getShareUrl, PERSONAL_SITE_URL } from '../src/personal/site';

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('personal site content', () => {
  it('shows the About content and its further reading links', () => {
    render(<AboutPage />);

    expect(screen.getByRole('heading', { name: 'Further perspectives' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'James Clear: Let Your Values Drive Your Choices' })).toHaveAttribute(
      'href',
      'https://jamesclear.com/values-choices'
    );
  });

  it('keeps the help page instruction preference on this device', () => {
    render(<HelpPage />);
    const preference = screen.getByRole('checkbox', { name: 'Show instructions when starting the exercise' });

    fireEvent.click(preference);
    expect(window.localStorage.getItem('show-instructions')).toBe('false');
    expect(screen.getByText('Instructions will not appear automatically.')).toBeInTheDocument();
  });

  it('provides the existing personal contact address and page metadata', async () => {
    render(<ContactPage />);

    expect(screen.getByRole('link', { name: 'corevaluesanalytics@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:corevaluesanalytics@gmail.com'
    );
    await waitFor(() => expect(document.title).toBe('Contact Core Values'));
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', `${PERSONAL_SITE_URL}/contact`);
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      `${PERSONAL_SITE_URL}/contact`
    );
  });

  it('builds share destinations on the personal canonical domain', () => {
    expect(getShareUrl()).toBe('https://core-values.me/');
    expect(getShareUrl('/about')).toBe('https://core-values.me/about');
  });

  it('uses a secure LinkedIn share action with the supplied personal URL', () => {
    const openWindow = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<LinkedInShareButton text="Core Values" url={getShareUrl()} fill="currentColor" />);

    fireEvent.click(screen.getByRole('button', { name: 'Share on LinkedIn' }));
    expect(openWindow).toHaveBeenCalledWith(
      'https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fcore-values.me%2F&title=Core%20Values&summary=Core%20Values',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('offers social share actions targeting the personal domain', () => {
    render(<PersonalShareButtons />);
    const openWindow = vi.spyOn(window, 'open').mockImplementation(() => null);

    fireEvent.click(screen.getByRole('button', { name: 'Share on X' }));
    expect(openWindow).toHaveBeenCalledWith(
      'https://x.com/intent/tweet?text=Check%20out%20Core%20Values!&url=https%3A%2F%2Fcore-values.me%2F',
      '_blank',
      'noopener,noreferrer'
    );
  });
});
