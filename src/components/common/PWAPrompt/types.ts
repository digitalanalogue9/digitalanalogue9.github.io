/** Type of PWA prompt to show to the user */
export type PromptType = 'install' | 'update' | null;

/** Props returned by the PWAPrompt component */
export interface PWAPromptResult {
  showPrompt: boolean;
  promptType: PromptType;
  handleInstallClick: () => Promise<void>;
  handleUpdateClick: () => Promise<void>;
  handleDismiss: () => void;
}

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}
