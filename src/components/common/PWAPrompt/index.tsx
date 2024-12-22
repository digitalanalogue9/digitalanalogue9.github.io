
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from "@/lib/hooks/usePWA";
type PromptType = 'install' | 'update' | null;

/**
 * PWAPrompt component handles the display of a prompt to the user for installing
 * the Progressive Web App (PWA) or updating it if a new version is available.
 * 
 * @component
 * @example
 * return (
 *   <PWAPrompt />
 * )
 * 
 * @returns {JSX.Element | null} The rendered component or null if in development mode or no prompt is needed.
 * 
 * @remarks
 * This component uses the `usePWA` hook to determine if an update is needed and handles the `beforeinstallprompt` event
 * to show the install prompt. It also manages the state for showing the prompt and the type of prompt (install or update).
 * 
 * @function
 * @name PWAPrompt
 * 
 * @hook
 * @name useEffect
 * @description Sets up event listeners for `beforeinstallprompt` and handles the prompt display logic.
 * 
 * @hook
 * @name useState
 * @description Manages the state for showing the prompt, the type of prompt, and the deferred prompt event.
 * 
 * @param {boolean} showPrompt - State to control the visibility of the prompt.
 * @param {PromptType | null} promptType - State to determine the type of prompt ('install' or 'update').
 * @param {any} deferredPrompt - State to store the deferred prompt event.
 * 
 * @event beforeinstallprompt
 * @description Prevents the default prompt and shows a custom prompt if no update is needed.
 * 
 * @function handleInstallClick
 * @description Handles the click event for the install button, triggers the install prompt, and logs the user's choice.
 * 
 * @function handleUpdateClick
 * @description Handles the click event for the update button, triggers the service worker update, and hides the prompt.
 * 
 * @function handleDismiss
 * @description Handles the click event for the dismiss button, hides the prompt, and stores the dismissal in local storage.
 * 
 * @returns {null} Returns null if in development mode or if no prompt is needed.
 */
export default function PWAPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptType, setPromptType] = useState<PromptType>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const {
    needsUpdate,
    updateServiceWorker
  } = usePWA();
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
    const {
      outcome
    } = await deferredPrompt.userChoice;
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
  const promptTitle = promptType === 'install' ? 'Install Core Values App' : 'Update Available';
  const promptDescription = promptType === 'install' ? 'Install our app for a better experience with offline access and faster loading times.' : 'A new version is available. Update now for the latest features and improvements.';
  return <AnimatePresence>
    {showPrompt && <motion.div role="alertdialog" aria-labelledby="pwa-prompt-title" aria-describedby="pwa-prompt-description" initial={{
      opacity: 0,
      y: 0
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: 0
    }} className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 sm:w-96 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 id="pwa-prompt-title" className="text-base font-semibold text-black">
            {promptTitle}
          </h2>
          <p id="pwa-prompt-description" className="mt-1 text-sm text-black">
            {promptDescription}
          </p>
          <div className="mt-4 flex space-x-3" role="group" aria-label="PWA prompt actions">
            <button onClick={promptType === 'install' ? handleInstallClick : handleUpdateClick}
              className="flex-1 bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              aria-label={promptType === 'install' ? 'Install application' : 'Update application'}>
              {promptType === 'install' ? 'Install' : 'Update Now'}
            </button>
            {promptType === 'install' && <button onClick={handleDismiss} className="flex-1 bg-white text-black px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600" aria-label="Dismiss installation prompt">
              Not Now
            </button>}
          </div>
        </div>
      </div>
    </motion.div>}
  </AnimatePresence>;
}