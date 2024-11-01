interface ServiceWorkerRegistration {
    sync: {
      register(tag: string): Promise<void>;
    };
  }
  
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  }
  