'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '@/hooks/usePWA';

type PromptType = 'install' | 'update' | null;

export default function PWAPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptType, setPromptType] = useState<PromptType>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { needsUpdate, updateServiceWorker } = usePWA();

  useEffect(() => {
    // Handle installation prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show install prompt if there's no update needed
      if (!needsUpdate) {
        setPromptType('install');
        setShowPrompt(true);
      }
    };

    // Handle update availability
    if (needsUpdate) {
      setPromptType('update');
      setShowPrompt(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Hide prompts if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [needsUpdate]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setShowPrompt(false);

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  const handleUpdateClick = async () => {
    await updateServiceWorker();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (promptType === 'install') {
      localStorage.setItem('pwa-prompt-dismissed', 'true');
    }
  };

  // Don't render anything in development
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 sm:w-96 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-50"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900">
                {promptType === 'install' ? 'Install Core Values App' : 'Update Available'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {promptType === 'install'
                  ? 'Install our app for a better experience with offline access and faster loading times.'
                  : 'A new version is available. Update now for the latest features and improvements.'}
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={promptType === 'install' ? handleInstallClick : handleUpdateClick}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {promptType === 'install' ? 'Install' : 'Update Now'}
                </button>
                {promptType === 'install' && (
                  <button
                    onClick={handleDismiss}
                    className="flex-1 bg-white text-gray-700 px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Not Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
