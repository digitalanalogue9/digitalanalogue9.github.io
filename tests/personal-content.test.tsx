// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
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
  it('shows the About story, further perspectives, and an exercise route', async () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'It started with a borrowed deck of cards.' })).toBeInTheDocument();
    expect(screen.getByText(/The cards belonged to my coach, so I had to return them/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What you can do here' })).toBeInTheDocument();
    expect(screen.getByText(/Each person completes their own exercise/)).toBeInTheDocument();
    expect(screen.getByText(/doesn’t combine them into a team result/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Further perspectives' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'James Clear: Let Your Values Drive Your Choices' })).toHaveAttribute(
      'href',
      'https://jamesclear.com/values-choices'
    );
    expect(
      screen.getByRole('link', { name: 'Brené Brown and Barrett Guillen: Living Into Our Values' })
    ).toHaveAttribute('href', 'https://brenebrown.com/podcast/living-into-our-values/');
    expect(screen.getByRole('link', { name: 'Larisa Halilović: Core Values - Your Inner Compass' })).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=mL4l75rMIiQ'
    );
    expect(screen.getByText(/don’t imply an endorsement of Core Values/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Find my core values' })).toHaveAttribute('href', '/exercise');
    await waitFor(() => expect(document.title).toBe('About Core Values · A borrowed deck of cards'));
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'A borrowed deck of cards led to Core Values, a tool for sorting values and returning to the priorities you choose.'
    );
    expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute(
      'content',
      'A borrowed deck of cards led to Core Values, a tool for sorting values and returning to the priorities you choose.'
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
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'corevaluesanalytics@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:corevaluesanalytics@gmail.com'
    );
    expect(
      screen.getByRole('heading', { name: 'A question, an idea, or something that didn’t work?' })
    ).toBeInTheDocument();
    expect(screen.getByText(/I’d like to hear from you/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Find my core values' })).toHaveAttribute('href', '/exercise');
    await waitFor(() => expect(document.title).toBe('Contact · Core Values'));
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Ask a question, share an idea or report a problem with Core Values. Find the email address for feedback and privacy requests.'
    );
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
