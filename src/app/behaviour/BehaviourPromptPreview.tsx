import { useRef, useState } from 'react';

type PromptMode = 'conversation' | 'recurring';

type BehaviourPromptPreviewProps = {
  mode: PromptMode;
  prompt: string;
  isUpdating: boolean;
  error: string;
  canCopy: boolean;
  hasUnsavedReminderSettings: boolean;
  hasSelectedPossibility: boolean;
};

export function BehaviourPromptPreview({
  mode,
  prompt,
  isUpdating,
  error,
  canCopy,
  hasUnsavedReminderSettings,
  hasSelectedPossibility,
}: BehaviourPromptPreviewProps) {
  const previewRef = useRef<HTMLTextAreaElement>(null);
  const [copyStatus, setCopyStatus] = useState('');

  const selectForManualCopy = () => {
    previewRef.current?.focus();
    previewRef.current?.select();
    setCopyStatus('Prompt text selected. Copy it using your device’s copy command.');
  };

  const copyPrompt = async () => {
    setCopyStatus('');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(prompt);
      setCopyStatus(mode === 'recurring' ? 'Recurring prompt copied.' : 'Prompt copied.');
    } catch {
      setCopyStatus('We could not access your clipboard. The complete prompt is available below for manual copying.');
    }
  };

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-interface-title-2 text-sys-color-text-primary font-semibold">Exact prompt preview</h2>
          <p className="text-interface-base-small text-sys-color-text-primary mt-1">
            This full text is copied as shown. Review it before sharing.
          </p>
        </div>
        <button type="button" className="cv-button min-h-11" onClick={() => void copyPrompt()} disabled={!canCopy}>
          {mode === 'recurring' ? 'Copy recurring prompt' : 'Copy prompt'}
        </button>
      </div>
      <label className="sr-only" htmlFor="behaviour-prompt-preview">
        Prompt preview
      </label>
      <textarea
        ref={previewRef}
        id="behaviour-prompt-preview"
        aria-label="Prompt preview"
        readOnly
        rows={22}
        value={prompt}
        className="cv-field__control font-interface-base-small selection:bg-ref-color-brand-surface-primary min-h-[28rem] w-full resize-y leading-relaxed"
        spellCheck={false}
      />
      {mode === 'recurring' && !hasSelectedPossibility && (
        <p className="text-interface-base-small text-sys-color-text-primary" role="status">
          Choose at least one reflection possibility to create a behaviour-based recurring prompt.
        </p>
      )}
      {mode === 'recurring' && hasUnsavedReminderSettings && hasSelectedPossibility && (
        <p className="text-interface-base-small text-sys-color-text-primary" role="status">
          Save your recurring prompt preferences to update the preview.
        </p>
      )}
      {isUpdating && (
        <p className="text-interface-base-small text-sys-color-text-primary" role="status">
          Updating preview…
        </p>
      )}
      {error && (
        <p className="text-interface-base-small text-ref-color-rag-red-text" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3" aria-live="polite">
        {copyStatus && (
          <p role="status" className="text-interface-base-small text-sys-color-text-primary">
            {copyStatus}
          </p>
        )}
        {copyStatus.includes('could not access') && (
          <button
            type="button"
            className="cv-link min-h-11 underline underline-offset-4"
            onClick={selectForManualCopy}
            aria-label="Select prompt text for manual copying"
          >
            Select prompt text for manual copying
          </button>
        )}
      </div>
    </div>
  );
}
