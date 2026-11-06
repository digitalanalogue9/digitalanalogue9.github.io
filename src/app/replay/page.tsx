'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReplayClient from './ReplayClient';

export default function ReplayPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId') ?? '';

  useEffect(() => {
    document.title = 'Core Values - Replay';
  }, []);

  return <ReplayClient sessionId={sessionId} />;
}
