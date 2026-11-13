import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Session } from '@/lib/contracts/types';
import { historyButtonClassName } from './constants/buttonStyles';

type Props = {
  sessions: Session[];
  isWorking: boolean;
  copyCompletedValuesLoading: (id: string) => boolean;
  printCompletedValuesLoading: (id: string) => boolean;
  copyCompletedValuesSucceeded: (id: string) => boolean;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
  onExportLegacy: (id: string) => void;
  onCopyCompletedValues: (id: string) => void;
  onPrintCompletedValues: (id: string) => void;
};

function formatDate(value: number) {
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const secondaryActionClassName =
  'inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-sys-radius-button-sm border border-sys-color-border-strong px-2.5 py-1.5 text-xs font-semibold text-sys-color-text-primary hover:bg-sys-color-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ref-color-brand-primary disabled:cursor-not-allowed disabled:opacity-45';

export default function HistorySessionSelector(props: Props) {
  const [selectedId, setSelectedId] = useState(props.sessions[0]?.id ?? '');
  const selected = props.sessions.find((session) => session.id === selectedId) ?? props.sessions[0];

  useEffect(() => {
    if (!props.sessions.some((session) => session.id === selectedId)) {
      setSelectedId(props.sessions[0]?.id ?? '');
    }
  }, [props.sessions, selectedId]);

  if (!selected) return null;

  const completed = selected.status === 'completed';
  const sessionType = selected.exerciseType === 'team' ? 'Team values' : 'Personal values';
  const primaryAction = (
    <Link
      className={`${historyButtonClassName} bg-ref-color-brand-primary hover:bg-ref-color-brand-primary-hover focus-visible:outline-ref-color-brand-primary text-white focus-visible:outline-2 focus-visible:outline-offset-2`}
      to={`${completed ? '/reasoning' : '/exercise'}?sessionId=${encodeURIComponent(selected.id)}`}
    >
      Resume session
    </Link>
  );

  return (
    <div className="space-y-4">
      <div className="w-full">
        <label
          htmlFor="history-session-select"
          className="text-sys-color-text-primary mb-1 block text-sm font-semibold"
        >
          Choose a session
        </label>
        <select
          id="history-session-select"
          value={selected.id}
          onChange={(event) => setSelectedId(event.target.value)}
          className="rounded-sys-radius-button-sm border-sys-color-border-strong bg-sys-color-surface-default text-sys-color-text-primary focus-visible:outline-ref-color-brand-primary min-h-11 w-full border px-3 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {props.sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.id}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-sys-radius-card-sm border-sys-color-border-default border p-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-sys-color-text-primary text-base font-semibold">{sessionType} session</h3>
          <span className={`text-sm font-semibold ${completed ? 'text-green-800' : 'text-sys-color-text-secondary'}`}>
            {completed ? 'Completed' : 'In progress'}
          </span>
        </div>
        <p className="text-sys-color-text-secondary mt-1 text-sm">
          Round {selected.currentRoundNumber} · Started {formatDate(selected.createdAt)} · Updated{' '}
          {formatDate(selected.updatedAt)}
        </p>
      </div>

      <div
        className="flex flex-wrap items-center gap-2 xl:flex-nowrap"
        role="group"
        aria-label="Actions for selected session"
      >
        {primaryAction}
        <Link className={secondaryActionClassName} to={`/replay?sessionId=${encodeURIComponent(selected.id)}`}>
          Replay
        </Link>
        <button
          type="button"
          className={secondaryActionClassName}
          disabled={props.isWorking}
          onClick={() => props.onExport(selected.id)}
        >
          Export
        </button>
        <button
          type="button"
          className={secondaryActionClassName}
          disabled={props.isWorking}
          onClick={() => props.onExportLegacy(selected.id)}
        >
          Legacy backup
        </button>
        <button
          type="button"
          className={secondaryActionClassName}
          disabled={!completed || props.copyCompletedValuesLoading(selected.id)}
          title={!completed ? 'Available after the session is complete' : undefined}
          onClick={() => props.onCopyCompletedValues(selected.id)}
        >
          {props.copyCompletedValuesSucceeded(selected.id) ? 'Copied' : 'Copy values'}
        </button>
        <button
          type="button"
          className={secondaryActionClassName}
          disabled={!completed || props.printCompletedValuesLoading(selected.id)}
          title={!completed ? 'Available after the session is complete' : undefined}
          onClick={() => props.onPrintCompletedValues(selected.id)}
        >
          Print
        </button>
        <button
          type="button"
          className={`${secondaryActionClassName} text-ref-color-rag-red-text`}
          disabled={props.isWorking}
          onClick={() => props.onDelete(selected.id)}
        >
          Delete
        </button>
      </div>

      {!completed && (
        <p className="text-sys-color-text-secondary text-sm">
          Copy values and print become available when this session is complete.
        </p>
      )}
    </div>
  );
}
