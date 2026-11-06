'use client';

import { useEffect } from 'react';
import HistoryClient from './HistoryClient';

export default function HistoryPage() {
  useEffect(() => {
    document.title = 'Core Values - History';
  }, []);

  return <HistoryClient />;
}
