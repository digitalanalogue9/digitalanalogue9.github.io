import { useEffect, useId, useRef, type MouseEvent, type SyntheticEvent } from 'react';
import type { CategoryName, RoundSnapshot } from '@/lib/contracts/types';
import { getFinishSelectionByCategory } from '@/lib/domain/roundEngine';

type Props = {
  open: boolean;
  round: RoundSnapshot;
  working: boolean;
  onContinue: () => void;
  onCancel: () => void;
  onNextRound?: () => void;
};

const topUpPriority: CategoryName[] = ['Quite Important', 'Important', 'Of Some Importance'];

function formatTopUp(round: RoundSnapshot): string {
  if (round.categories['Very Important'].length > round.targetCoreValues) {
    const target = round.targetCoreValues;
    const nextCategory = round.activeCategories.find((category) => category !== 'Very Important') ?? 'Not Important';
    return `If you finish now, only the top ${target} ${target === 1 ? 'value' : 'values'} in Very Important will be used. The remaining values will move to the top of ${nextCategory}.`;
  }
  const selectedByCategory = getFinishSelectionByCategory(round);
  const additions = topUpPriority.flatMap((category) => {
    const count = selectedByCategory[category]?.length ?? 0;
    return count === 0 ? [] : [`the top ${count} ${count === 1 ? 'value' : 'values'} from ${category}`];
  });

  if (additions.length === 0) return 'The target is already met in Very Important.';

  const additionText =
    additions.length === 1
      ? additions[0]
      : `${additions.slice(0, -1).join(', ')} and ${additions[additions.length - 1]}`;

  return `To reach ${round.targetCoreValues}, we’ll add ${additionText}.`;
}

export default function FinishConfirmationDialog({ open, round, working, onContinue, onCancel, onNextRound }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      headingRef.current?.focus();
    }

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    onCancel();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) onCancel();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={headingId}
      className="cv-dialog m-auto max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-lg overflow-hidden shadow-lg sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)]"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className="flex max-h-[calc(100dvh-3.5rem)] min-h-0 flex-col sm:max-h-[calc(100dvh-4.5rem)]">
        <header className="border-sys-color-border-default flex shrink-0 items-start justify-between gap-4 border-b pb-3">
          <h2 ref={headingRef} id={headingId} tabIndex={-1} className="text-interface-title-2 font-semibold">
            Finish now?
          </h2>
          <button
            type="button"
            aria-label="Close finish confirmation"
            className="cv-dialog__close rounded-sys-radius-button-sm hover:bg-sys-color-surface-subtle -mt-2 -mr-2 inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center text-2xl leading-none"
            onClick={onCancel}
            disabled={working}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-3">
          <p className="text-interface-base-default leading-relaxed">
            Your target is {round.targetCoreValues} {round.targetCoreValues === 1 ? 'value' : 'values'}. You have{' '}
            {round.categories['Very Important'].length} in Very Important. {formatTopUp(round)} Other values will remain
            outside your core values.
          </p>
          {onNextRound && <p>Would you like to finish now or continue to the next round?</p>}
        </div>

        <footer className="border-sys-color-border-default grid shrink-0 grid-cols-2 gap-2 border-t pt-3 sm:flex sm:justify-end">
          <button
            type="button"
            className="border-sys-color-border-strong text-sys-color-text-primary hover:bg-sys-color-surface-subtle focus-visible:ring-sys-color-focus-ring rounded-sys-radius-button-sm min-h-11 border px-4 py-2 font-medium focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45"
            onClick={onCancel}
            disabled={working}
          >
            Cancel
          </button>
          {onNextRound && (
            <button
              type="button"
              className="cv-button cv-button--secondary min-h-11"
              onClick={onNextRound}
              disabled={working}
            >
              Next Round
            </button>
          )}
          <button type="button" className="cv-button min-h-11" onClick={onContinue} disabled={working}>
            {onNextRound ? 'Finish now' : 'Continue'}
          </button>
        </footer>
      </div>
    </dialog>
  );
}
