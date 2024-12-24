"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { pageview } from "@/lib/utils/gtagHelper";
import { GoogleAnalyticsProps } from "./types";
import { initializeGtag, isGtagDefined } from "@/lib/utils/gtagHelper/gtagWrapper";

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: GoogleAnalyticsProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isInitialized || !isGtagDefined()) return;
    
    try {
      const url = pathname + searchParams.toString();
      pageview(GA_MEASUREMENT_ID, url);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send pageview'));
      console.error('Analytics error:', err);
    }
  }, [pathname, searchParams, GA_MEASUREMENT_ID, isInitialized]);

  const handleScriptLoad = () => {
    try {
      initializeGtag(GA_MEASUREMENT_ID);
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
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={handleScriptLoad}
        onError={() => setError(new Error('Failed to load analytics script'))}
      />
    </>
  );
}
