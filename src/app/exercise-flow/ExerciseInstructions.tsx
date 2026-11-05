import { useEffect, useRef, useState } from 'react';

export function ExerciseInstructions() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  useEffect(() => {
    const modal = dialog.current;
    let show = true;
    try {
      show = localStorage.getItem('show-instructions') !== 'false';
    } catch {
      /* Instructions remain available without storage. */
    }
    if (show) modal?.showModal();
    return () => {
      if (modal?.open) modal.close();
    };
  }, []);
  function close() {
    if (dontShowAgain) {
      try {
        localStorage.setItem('show-instructions', 'false');
      } catch {
        /* Sorting remains available without storage. */
      }
    }
    dialog.current?.close();
  }
  return (
    <dialog
      ref={dialog}
      aria-labelledby="instructions-heading"
      className="m-auto max-w-xl rounded-lg border bg-white p-6 backdrop:bg-black/40"
    >
      <h2 id="instructions-heading">How to use Core Values</h2>
      <p>
        Sort each value card by how important it is to you. Choose a category and place the card. You can move placed
        cards between categories.
      </p>
      <p>
        Your target is the number of core values you want to finish with. Keep at least that many active values and
        place some in Not Important to start another round.
      </p>
      <button type="button" onClick={close}>
        Start sorting
      </button>
      <label>
        <input type="checkbox" checked={dontShowAgain} onChange={(event) => setDontShowAgain(event.target.checked)} />
        Don't show again
      </label>
    </dialog>
  );
}
