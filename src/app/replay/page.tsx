'use client'
// src/app/replay/page.tsx
import { Suspense } from 'react';
import ReplayClient from '@/components/Replay/ReplayClient';
import { Metadata } from 'next';

export default function ReplayPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReplayClient />
    </Suspense>
  );
}
