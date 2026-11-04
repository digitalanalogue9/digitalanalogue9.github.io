import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useConsent } from '@/lib/hooks/useConsent';
import type { GoogleAnalyticsProps } from './types';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[][];
  }
}

const DEFAULT_MEASUREMENT_ID = 'G-JZPX5JCP5D';

export default function GoogleAnalytics({ GA_MEASUREMENT_ID = DEFAULT_MEASUREMENT_ID }: GoogleAnalyticsProps) {
  const { consent, isInitialized } = useConsent();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const previousPageRef = useRef<string | null>(null);
  const page = `${location.pathname}${location.search}${location.hash}`;

  useEffect(() => {
    if (!isInitialized || consent.analytics !== 'granted' || !GA_MEASUREMENT_ID) {
      setIsReady(false);
      previousPageRef.current = null;
      scriptRef.current?.remove();
      scriptRef.current = null;
      delete window.gtag;
      delete window.dataLayer;
      return;
    }

    let active = true;
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[data-core-values-analytics="${GA_MEASUREMENT_ID}"]`
    );
    if (existingScript) {
      scriptRef.current = existingScript;
      if (window.gtag) {
        setIsReady(true);
      } else {
        existingScript.onload = () => {
          if (active) setIsReady(true);
        };
      }
    } else {
      window.dataLayer = [];
      window.gtag = (...args: unknown[]) => {
        window.dataLayer?.push(args);
      };
      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
      script.dataset.coreValuesAnalytics = GA_MEASUREMENT_ID;
      script.onload = () => {
        if (active) setIsReady(true);
      };
      script.onerror = () => {
        if (active) setIsReady(false);
      };
      scriptRef.current = script;
      document.head.append(script);
    }

    return () => {
      active = false;
    };
  }, [GA_MEASUREMENT_ID, consent.analytics, isInitialized]);

  useEffect(() => {
    if (!isReady || consent.analytics !== 'granted' || !window.gtag || previousPageRef.current === page) return;

    previousPageRef.current = page;
    window.gtag('event', 'page_view', { page_path: page });
  }, [consent.analytics, isReady, page]);

  return null;
}
