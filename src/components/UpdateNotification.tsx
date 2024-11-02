'use client';

import { usePWA } from '@/hooks/usePWA';

export default function UpdateNotification() {
  const { needsUpdate, updateServiceWorker } = usePWA();

  if (!needsUpdate) return null;

  return (
    <div className="fixed top-2 sm:top-4 right-2 sm:right-4 bg-white p-3 sm:p-4 rounded-lg shadow-lg z-50 max-w-[calc(100%-1rem)] sm:max-w-sm border border-gray-200">
      <h3 className="font-bold text-sm sm:text-base mb-1 sm:mb-2">Update Available</h3>
      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
        A new version is available. Update now for the latest features.
      </p>
      <button
        onClick={updateServiceWorker}
        className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white text-xs sm:text-sm rounded hover:bg-blue-600"
      >
        Update Now
      </button>
    </div>
  );
}
