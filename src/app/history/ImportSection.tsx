import { ChangeEvent, useRef } from 'react';
import { historyButtonClassName } from '@/app/history/constants/buttonStyles';

interface ImportSectionProps {
  importText: string;
  onImportTextChange: (text: string) => void;
  onImportFromText: () => void;
  onImportFile: (event: ChangeEvent<HTMLInputElement>) => void;
  isWorking: boolean;
  hasError?: boolean;
}

export default function ImportSection({
  importText,
  onImportTextChange,
  onImportFromText,
  onImportFile,
  isWorking,
  hasError = false,
}: ImportSectionProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <section className="space-y-4">
      <h2 className="page-section-heading text-sys-color-text-primary text-3xl sm:text-4xl">Import saved work</h2>
      <div className="mt-3 space-y-3">
        <label
          htmlFor="session-json-import"
          className="text-interface-base-small text-sys-color-text-primary block font-semibold"
        >
          Backup file contents (JSON)
        </label>
        <textarea
          className="cv-field__control h-28 w-full"
          id="session-json-import"
          placeholder="Paste the contents of your backup file here"
          aria-describedby={`session-json-import-help session-json-import-replacement${hasError ? ' history-action-error' : ''}`}
          aria-invalid={hasError}
          value={importText}
          onChange={(event) => onImportTextChange(event.target.value)}
        />
        <p id="session-json-import-help" className="text-interface-base-small text-sys-color-text-secondary">
          Paste a values exercise backup or a behaviour reflection backup. Restoring a behaviour reflection backup with
          an existing ID replaces that saved reflection and may replace newer work.
        </p>
        <p id="session-json-import-replacement" className="text-interface-base-small text-sys-color-text-secondary">
          Values session imports keep existing local work: a backup with an existing session ID is restored as a
          separate copy. Reflection notes are included only when they are present in the backup.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className={`${historyButtonClassName} border-sys-color-border-strong bg-sys-color-surface-subtle text-sys-color-text-primary hover:bg-sys-color-surface-subtle-hover border disabled:opacity-60`}
            onClick={onImportFromText}
            disabled={isWorking || importText.trim().length === 0}
          >
            Import from text
          </button>
          <button
            type="button"
            className={`${historyButtonClassName} border-sys-color-border-strong bg-sys-color-surface-subtle text-sys-color-text-primary hover:bg-sys-color-surface-subtle-hover border disabled:opacity-60`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isWorking}
          >
            Import JSON file
          </button>
          <input
            placeholder="Upload file"
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={onImportFile}
            disabled={isWorking}
          />
        </div>
      </div>
    </section>
  );
}
