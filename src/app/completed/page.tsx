'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CompletedClient from './CompletedClient';

export default function CompletedPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId') ?? '';

  useEffect(() => {
    document.title = 'Core Values - Completed';
  }, []);

  return <CompletedClient sessionId={sessionId} />;
}
