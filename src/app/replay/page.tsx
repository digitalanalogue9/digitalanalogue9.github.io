// src/app/replay/page.tsx
import { Suspense } from 'react';
import ReplayClient from '@/components/Replay/ReplayClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Game Replay',
};

export default function ReplayPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReplayClient />
    </Suspense>
  );
}
