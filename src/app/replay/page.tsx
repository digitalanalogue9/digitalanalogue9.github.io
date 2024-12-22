// src/app/replay/page.tsx
'use client';

import { Suspense } from 'react';
import ReplayClient from "@/components/features/Replay/components/ReplayClient";
export default function ReplayPage() {
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