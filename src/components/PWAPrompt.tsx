'use client';

import { usePWA } from '@/hooks/usePWA';
import { useState } from 'react';

export default function PWAPrompt() {
  const { isInstallable, installPWA } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 max-w-sm border border-gray-200">
      <h3 className="font-bold mb-2">Install Core Values App</h3>
      <p className="text-sm text-gray-600 mb-4">
        Install our app for a better experience and offline access.
      </p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setDismissed(true)}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
        >
          Not now
        </button>
        <button
          onClick={installPWA}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Install
        </button>
      </div>
    </div>
  );
}
