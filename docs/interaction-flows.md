# Interaction Flows

## 1 – Landing / Setup

1. User selects **Individual** or **Team** mode.
2. Chooses target core value count (default 10).
3. Reads short how‑to tooltip.

## 2 – Sorting Round

1. Pile of cards appears face‑down.
2. User drags a card -> column:
   - Drag by mouse or touch.
   - Or keyboard: `Tab` focuses next card, `1‑5` keys place in column.
3. UI updates card count per column in real time.
4. When pile empty, **“Next Round”** button activates.

## 3 – End‑of‑Round Dialog

- Shows summary counts.
- Explains that **Not Important** cards will be removed.
- Offers **Replay** toggle (pre‑populate).

## 4 – Column Reduction

- After discarding, algorithm decides new column set.
- UI animates columns shrinking or merging.

## 5 – Finish

- Auto‑finish if `Very Important == target`.
- Manual finish option always visible once top column ≥ target.

## Accessibility Path

- All drag actions mirrored with keyboard shortcuts.
- `aria-live="polite"` region announces card moves and column merges.
