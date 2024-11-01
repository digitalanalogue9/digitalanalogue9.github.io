'use client';

import { usePWA } from '@/hooks/usePWA';

export default function UpdateNotification() {
  const { needsUpdate, updateServiceWorker } = usePWA();

  if (!needsUpdate) return null;

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 max-w-sm border border-gray-200">
      <h3 className="font-bold mb-2">Update Available</h3>
      <p className="text-sm text-gray-600 mb-4">
        A new version is available. Update now for the latest features.
      </p>
      <button
        onClick={updateServiceWorker}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Update Now
      </button>
    </div>
  );
}
