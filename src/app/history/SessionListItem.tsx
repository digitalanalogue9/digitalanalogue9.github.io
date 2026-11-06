import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { historyButtonClassName } from '@/app/history/constants/buttonStyles';

interface SessionListItemSession {
  id: string;
  status: 'active' | 'completed';
  currentRoundNumber: number;
  updatedAt: number;
  [key: string]: unknown;
}

interface SessionListItemProps {
  session: SessionListItemSession;
  isWorking: boolean;
  copyCompletedValuesLoading: boolean;
  printCompletedValuesLoading: boolean;
  copyCompletedValuesSucceeded: boolean;
  onDelete: (sessionId: string) => void;
  onExport: (sessionId: string) => void;
  onExportLegacy: (sessionId: string) => void;
  onExportReflectionBackup: (sessionId: string) => void;
  onCopyCompletedValues: (sessionId: string) => void;
  onPrintCompletedValues: (sessionId: string) => void;
}

export default function SessionListItem({
  session,
  isWorking,
  copyCompletedValuesLoading,
  printCompletedValuesLoading,
  copyCompletedValuesSucceeded,
  onDelete,
  onExport,
  onExportLegacy,
  onExportReflectionBackup,
  onCopyCompletedValues,
  onPrintCompletedValues,
}: SessionListItemProps) {
  const sessionReference = session.id;
  const updatedDate = new Date(session.updatedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <li className="rounded-sys-radius-button-sm border-sys-color-border-default border p-3">
      <p className="text-interface-base-small text-sys-color-text-primary font-semibold">
        {sessionReference} &middot; Round {session.currentRoundNumber}
      </p>
      <p className="text-interface-base-small text-sys-color-text-secondary">
        Status: {session.status} | Updated: {updatedDate},{' '}
        {new Date(session.updatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
      </p>
      {session.status === 'completed' && (
        <p className="text-interface-base-small text-sys-color-text-secondary mt-1">
          Review saved values, copy them, or open a printer-friendly summary.
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        <Link
          to={{
            pathname: session.status === 'completed' ? '/completed' : '/exercise',
            search: `?${new URLSearchParams({ sessionId: session.id }).toString()}`,
          }}
          className={`apc-button ${historyButtonClassName} text-sys-color-text-inverse`}
        >
          {session.status === 'completed' ? 'View results' : 'Resume'}
        </Link>
        <Link
          to={{
            pathname: '/replay',
            search: `?${new URLSearchParams({ sessionId: session.id }).toString()}`,
          }}
          className={`${historyButtonClassName} border-sys-color-border-strong text-sys-color-text-primary hover:bg-sys-color-surface-subtle border`}
        >
          Replay
        </Link>
        <button
          type="button"
          className={`${historyButtonClassName} border-sys-color-border-strong text-sys-color-text-primary hover:bg-sys-color-surface-subtle border disabled:opacity-60`}
          onClick={() => onExport(session.id)}
          disabled={isWorking}
        >
          Export
        </button>
        <button
          type="button"
          className={`${historyButtonClassName} border-sys-color-border-strong border`}
          disabled={isWorking}
          onClick={() => onExportLegacy(session.id)}
        >
          Export legacy backup
        </button>
        {session.status === 'completed' && (
          <>
            <button
              type="button"
              className={`${historyButtonClassName} border-sys-color-border-strong text-sys-color-text-primary hover:bg-sys-color-surface-subtle border disabled:opacity-60`}
              onClick={() => onCopyCompletedValues(session.id)}
              disabled={copyCompletedValuesLoading}
            >
              {copyCompletedValuesSucceeded && <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
              {copyCompletedValuesSucceeded ? 'Copied' : 'Copy to clipboard'}
            </button>
            <button
              type="button"
              className={`${historyButtonClassName} border-sys-color-border-strong text-sys-color-text-primary hover:bg-sys-color-surface-subtle border disabled:opacity-60`}
              onClick={() => onExportReflectionBackup(session.id)}
              disabled={isWorking}
            >
              Export reflection backup
            </button>
            <button
              type="button"
              className={`${historyButtonClassName} border-sys-color-border-strong text-sys-color-text-primary hover:bg-sys-color-surface-subtle border disabled:opacity-60`}
              onClick={() => onPrintCompletedValues(session.id)}
              disabled={printCompletedValuesLoading}
            >
              Print
            </button>
          </>
        )}
        <button
          type="button"
          className={`${historyButtonClassName} border-sys-color-border-strong text-ref-color-rag-red-text hover:bg-ref-color-rag-red-light border disabled:opacity-60`}
          onClick={() => onDelete(session.id)}
          disabled={isWorking}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
