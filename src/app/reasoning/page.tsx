'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReasoningClient from './ReasoningClient';

export default function ReasoningPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId') ?? '';

  useEffect(() => {
    document.title = 'Core Values - Reasoning';
  }, []);

  return <ReasoningClient sessionId={sessionId} />;
}
