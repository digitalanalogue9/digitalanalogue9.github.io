// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Link, MemoryRouter } from 'react-router-dom';
import CookieBanner from '@/components/common/CookieBanner';
import GoogleAnalytics from '@/components/common/GoogleAnalytics';
import PrivacyPage from '@/app/privacy/page';

const consentKey = 'cookie-consent';

describe('privacy choices', () => {
  beforeEach(() => {
    localStorage.clear();
    delete window.gtag;
    delete window.dataLayer;
  });

  afterEach(() => cleanup());

  it('explains browser storage and backups and exposes the reviewed consent state', async () => {
    localStorage.setItem(
      consentKey,
      JSON.stringify({ analytics: 'denied', functional: 'pending', advertisement: 'denied', timestamp: 1 })
    );

    render(
      <MemoryRouter initialEntries={['/privacy']}>
        <PrivacyPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Your reflections stay in this browser.' })).toBeVisible();
    expect(
      screen.getByText(/Exercise answers and notes are stored on this device\. They don’t sync automatically\./)
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Saved exercises and preferences' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Backups you download' })).toBeVisible();
    expect(
      screen.getByText(/saves your values exercise without the additional notes from the completed exercise page/)
    ).toBeVisible();
    expect(screen.getByText(/creates a separate copy/)).toBeVisible();
    expect(screen.getByText(/replaces that saved reflection and may replace newer work/)).toBeVisible();
    expect(screen.getByText(/It doesn’t remove information Google has already collected\./)).toBeVisible();
    expect(screen.getByText('Rejected', { selector: 'strong' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Allow analytics' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Reject analytics' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('link', { name: 'Find my core values' })).toHaveAttribute('href', '/exercise');
  });

  it('lets visitors reject optional tracking and remembers that choice', async () => {
    const { unmount } = render(
      <MemoryRouter>
        <CookieBanner />
      </MemoryRouter>
    );

    const banner = await screen.findByRole('region', { name: 'Privacy preferences' });
    expect(banner).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Reject optional cookies' }));

    await waitFor(() => expect(screen.queryByRole('region', { name: 'Privacy preferences' })).not.toBeInTheDocument());
    expect(JSON.parse(localStorage.getItem(consentKey) ?? '{}')).toMatchObject({
      analytics: 'denied',
      functional: 'denied',
      advertisement: 'denied',
    });

    unmount();
    render(
      <MemoryRouter>
        <CookieBanner />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.queryByRole('region', { name: 'Privacy preferences' })).not.toBeInTheDocument());
  });

  it('does not request Google Analytics until the visitor grants consent', async () => {
    render(
      <MemoryRouter initialEntries={['/privacy']}>
        <CookieBanner />
        <GoogleAnalytics GA_MEASUREMENT_ID="G-JZPX5JCP5D" />
        <PrivacyPage />
        <Link to="/history">Open History</Link>
      </MemoryRouter>
    );

    expect(document.querySelector('script[src*="googletagmanager.com"]')).not.toBeInTheDocument();
    expect(window.gtag).toBeUndefined();
    const banner = await screen.findByRole('region', { name: 'Privacy preferences' });
    fireEvent.click(within(banner).getByRole('button', { name: 'Allow analytics' }));

    const script = await waitFor(() => {
      const element = document.querySelector<HTMLScriptElement>('script[src*="googletagmanager.com"]');
      expect(element).not.toBeNull();
      return element!;
    });
    expect(script.src).toContain('id=G-JZPX5JCP5D');

    script.dispatchEvent(new Event('load'));
    await waitFor(() => {
      expect(window.dataLayer?.some((call) => call[0] === 'event' && call[1] === 'page_view')).toBe(true);
    });

    fireEvent.click(screen.getByRole('link', { name: 'Open History' }));
    await waitFor(() => {
      expect(
        window.dataLayer?.some(
          (call) =>
            call[0] === 'event' &&
            call[1] === 'page_view' &&
            (call[2] as { page_path: string }).page_path === '/history'
        )
      ).toBe(true);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Reject analytics' }));
    await waitFor(() => expect(document.querySelector('script[src*="googletagmanager.com"]')).not.toBeInTheDocument());
    expect(window.gtag).toBeUndefined();
    expect(JSON.parse(localStorage.getItem(consentKey) ?? '{}').analytics).toBe('denied');
  });
});
