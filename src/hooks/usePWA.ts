import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAStatus {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  needsUpdate: boolean;
  registration: ServiceWorkerRegistration | null;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [status, setStatus] = useState<PWAStatus>({
    isInstallable: false,
    isInstalled: false,
    isOffline: false, // Default to false, will update on client side
    needsUpdate: false,
    registration: null,
  });

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      // Initial offline status
      setStatus(prev => ({ ...prev, isOffline: !navigator.onLine }));

      // Handle online/offline status
      const handleOnlineStatus = () => {
        setStatus(prev => ({ ...prev, isOffline: !navigator.onLine }));
      };

      window.addEventListener('online', handleOnlineStatus);
      window.addEventListener('offline', handleOnlineStatus);

      // Handle installation prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setStatus(prev => ({ ...prev, isInstallable: true }));
      });

      // Handle installed status
      window.addEventListener('appinstalled', () => {
        setDeferredPrompt(null);
        setStatus(prev => ({ ...prev, isInstalled: true, isInstallable: false }));
      });

      // Register service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            setStatus(prev => ({ ...prev, registration }));

            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    setStatus(prev => ({ ...prev, needsUpdate: true }));
                  }
                });
              }
            });
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      }

      return () => {
        window.removeEventListener('online', handleOnlineStatus);
        window.removeEventListener('offline', handleOnlineStatus);
      };
    }
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setDeferredPrompt(null);
          setStatus(prev => ({ ...prev, isInstalled: true, isInstallable: false }));
        }
      } catch (error) {
        console.error('Error installing PWA:', error);
      }
    }
  };

  const updateServiceWorker = async () => {
    if (status.registration) {
      await status.registration.update();
      window.location.reload();
    }
  };

  // Background sync registration
  const registerSync = async () => {
    if (status.registration && 'sync' in status.registration) {
      try {
        await status.registration.sync.register('syncGameState');
      } catch (error) {
        console.error('Error registering sync:', error);
      }
    }
  };

  return {
    ...status,
    installPWA,
    updateServiceWorker,
    registerSync,
  };
};
