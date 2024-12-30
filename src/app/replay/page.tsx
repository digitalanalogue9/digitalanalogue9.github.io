'use client';

import { Suspense } from 'react';
import ReplayClient from "@/components/features/Replay/components/ReplayClient";
import { useMobile } from '@/components/common/MobileProvider';

/**
 * ReplayPage component renders the session replay page.
 * 
 * This component uses React's Suspense to handle the loading state
 * while the ReplayClient component is being loaded. During the loading
 * state, it displays a loading message with appropriate accessibility
 * attributes.
 */
export default function ReplayPage() {
  const { isMobile } = useMobile();
      
  return <div className="flex-1">
      <Suspense fallback={<div role="status" aria-live="polite" className="flex items-center justify-center h-full">
            <span className="sr-only">Loading session replay...</span>
            <div className="text-black">Loading...</div>
          </div>}>
        <section className="h-full" aria-label="Session Replay">
          <h1 className="sr-only">Core Values Session Replay</h1>
          <ReplayClient />
        </section>
      </Suspense>
    </div>;
}