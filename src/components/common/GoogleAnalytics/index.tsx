"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { pageview } from "../../../lib/utils/gtagHelper";
import { GoogleAnalyticsProps } from "./types";
import { initializeGtag, isGtagDefined } from "../../../lib/utils/gtagHelper/gtagWrapper";
import { useConsent } from "../../../lib/hooks/useConsent";

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: GoogleAnalyticsProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { consent } = useConsent();

  useEffect(() => {
    if (!isInitialized || !isGtagDefined() || consent.analytics !== 'granted') return;

    try {
      const url = pathname + searchParams.toString();
      pageview(GA_MEASUREMENT_ID, url);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send pageview'));
      console.error('Analytics error:', err);
    }
  }, [pathname, searchParams, GA_MEASUREMENT_ID, isInitialized, consent.analytics]);

  const handleScriptLoad = () => {
    try {
      initializeGtag(GA_MEASUREMENT_ID,consent);
      setIsInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize analytics'));
      console.error('Analytics initialization error:', err);
    }
  };

  if (error) {
    // Fail silently in production
    return null;
  }

  return (
    <>
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={handleScriptLoad}
        onError={() => {
          console.error('Failed to load analytics script');
          setError(new Error('Failed to load analytics script'));
        }}
      />
    </>
  );
}