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