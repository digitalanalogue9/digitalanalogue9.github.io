'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '@/lib/hooks/usePWA';
import { useMobile } from '@/lib/contexts/MobileContext';
import { getResponsiveTextStyles } from '@/lib/utils/styles/textStyles';
import { getLocalStorage, setLocalStorage } from '@/lib/utils/localStorage';
import { PromptType } from './types';

/**
 * PWAPrompt component handles the display of a prompt to the user for installing
 * the Progressive Web App (PWA) or updating it if a new version is available.
 */
export default function PWAPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptType, setPromptType] = useState<PromptType>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { needsUpdate, updateServiceWorker } = usePWA();
  const { isMobile } = useMobile();
  const styles = getResponsiveTextStyles(isMobile);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      const isDismissed = getLocalStorage('pwa-prompt-dismissed', false);
      if (!needsUpdate && !isDismissed) {
        setPromptType('install');
        setShowPrompt(true);
      }
    };

    if (needsUpdate) {
      setPromptType('update');
      setShowPrompt(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

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
      setLocalStorage('pwa-prompt-dismissed', true);
    }
  };

  if (!showPrompt) return null;

  const promptTitle = promptType === 'install' ? 'Install Core Values App' : 'Update Available';
  const promptDescription =
    promptType === 'install'
      ? 'Install our app for a better experience with offline access and faster loading times.'
      : 'A new version is available. Update now for the latest features and improvements.';

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          role="alertdialog"
          aria-labelledby="pwa-prompt-title"
          aria-describedby="pwa-prompt-description"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-4 left-0 right-0 z-50 mx-auto w-[calc(100%-2rem)] rounded-lg border border-gray-200 bg-white p-4 shadow-lg sm:w-96 ${isMobile ? 'max-w-[95%]' : ''} `}
        >
          <div className="flex flex-col">
            <div className="flex-1">
              <h2 id="pwa-prompt-title" className={`${styles.subheading} font-semibold text-black`}>
                {promptTitle}
              </h2>
              <p id="pwa-prompt-description" className={`${styles.paragraph} mt-1 text-black`}>
                {promptDescription}
              </p>
            </div>

            <div
              className={`mt-4 ${isMobile ? 'flex flex-col space-y-2' : 'flex flex-row space-x-3'} `}
              role="group"
              aria-label="PWA prompt actions"
            >
              <button
                onClick={promptType === 'install' ? handleInstallClick : handleUpdateClick}
                className={` ${isMobile ? 'w-full' : 'flex-1'} rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
                aria-label={promptType === 'install' ? 'Install application' : 'Update application'}
              >
                {promptType === 'install' ? 'Install' : 'Update Now'}
              </button>

              {promptType === 'install' && (
                <button
                  onClick={handleDismiss}
                  className={` ${isMobile ? 'w-full' : 'flex-1'} rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
                  aria-label="Dismiss installation prompt"
                >
                  Not Now
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
