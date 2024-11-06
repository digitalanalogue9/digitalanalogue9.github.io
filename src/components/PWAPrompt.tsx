import React, { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';

export const PWAPrompt: React.FC = () => {
  const { 
    isInstallable, 
    isInstalled, 
    isOffline, 
    needsUpdate,
    installPWA,
    updateServiceWorker,
    checkForUpdates
  } = usePWA();

  useEffect(() => {
    checkForUpdates();
  }, [checkForUpdates]);

  if (!isInstallable && !needsUpdate && !isOffline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-2">
      {isInstallable && (
        <div className="rounded-lg bg-blue-600 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg 
                className="h-6 w-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span className="font-semibold">Install App</span>
            </div>
            <button
              onClick={installPWA}
              className="rounded bg-white px-4 py-2 text-blue-600 transition hover:bg-blue-50"
            >
              Install
            </button>
          </div>
        </div>
      )}

      {needsUpdate && (
        <div className="rounded-lg bg-green-600 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg 
                className="h-6 w-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="font-semibold">Update Available</span>
            </div>
            <button
              onClick={updateServiceWorker}
              className="rounded bg-white px-4 py-2 text-green-600 transition hover:bg-green-50"
            >
              Update
            </button>
          </div>
        </div>
      )}

      {isOffline && (
        <div className="rounded-lg bg-yellow-500 p-4 text-white shadow-lg">
          <div className="flex items-center space-x-2">
            <svg 
              className="h-6 w-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold">You are currently offline</span>
          </div>
        </div>
      )}

      {isInstalled && (
        <div 
          className="rounded-lg bg-gray-800 p-4 text-white shadow-lg"
          role="alert"
        >
          <div className="flex items-center space-x-2">
            <svg 
              className="h-6 w-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-semibold">App successfully installed</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PWAPrompt;
