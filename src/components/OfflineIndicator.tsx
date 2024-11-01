'use client';

import { usePWA } from '@/hooks/usePWA';

export default function OfflineIndicator() {
  const { isOffline } = usePWA();

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      You are offline. Some features may be limited.
    </div>
  );
}
