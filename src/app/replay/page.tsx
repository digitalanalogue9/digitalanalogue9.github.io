/**
 * ReplayPage component renders the session replay page.
 *
 * This component uses React's Suspense to handle the loading state
 * while the ReplayClient component is being loaded. During the loading
 * state, it displays a loading message with appropriate accessibility
 * attributes.
 *
 * @returns {JSX.Element} The rendered ReplayPage component.
 */
// src/app/replay/page.tsx
'use client';

import { Suspense, useEffect } from 'react';
import ReplayClient from '@/components/features/Replay/components/ReplayClient';
export default function ReplayPage() {
  useEffect(() => {
    document.title = 'Core Values - Replay';
  }, []);

  return (
    <div className="flex-1">
      <Suspense
        fallback={
          <div role="status" aria-live="polite" className="flex h-full items-center justify-center">
            <span className="sr-only">Loading session replay...</span>
            <div className="text-black">Loading...</div>
          </div>
        }
      >
        <section className="h-full" aria-label="Session Replay">
          <h1 className="sr-only">Core Values Session Replay</h1>
          <ReplayClient />
        </section>
      </Suspense>
    </div>
  );
}
