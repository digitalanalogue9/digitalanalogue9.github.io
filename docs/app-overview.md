# Core Values Application – Functional Overview

## 1. Purpose

The Core Values Application enables **individuals** and **teams** to distil a long list of personal or organisational values into a concise set of _core_ values through a card‑sorting game.  
It is designed for self‑reflection workshops, team‑building sessions, and organisational culture exercises.

---

## 2. Primary Flow (High Level)

1. **Choose Mode & Target Count**

   - _Individual_ or _Team_ mode.
   - Select target number of core values (default **10**).

2. **Play Rounds of Sorting**

   - Start with **35** value cards.
   - Sort each card into one of **five importance columns**.
   - End of round when **all cards** have been placed.

3. **Discard & Replay**

   - Cards in **“Not Important”** are discarded permanently.
   - Remaining cards are restacked; user can replay a **pre‑populate** variant that remembers the previous round’s positions.

4. **Reduce Columns Dynamically**

   - As card count drops, the number of columns shrinks to force sharper choices.  
     Example progression (illustrative):
     1. Round 1 – _Very Important · Quite Important · Important · Of Some Importance · Not Important_
     2. Round 2 – _Very Important · Important · Not Important_
     3. Round 3 – _Very Important · Not Important_

5. **Finish**
   - Game ends automatically when the **Most Important** column reaches the target count.
   - Player may also finish early if the top column already equals the target.

---

## 3. Detailed Game Mechanics

| Aspect                         | Behaviour                                                                                                                                                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Initial Columns**            | 5 fixed columns:<br>1. **Very Important**<br>2. **Quite Important**<br>3. **Important**<br>4. **Of Some Importance**<br>5. **Not Important**                                                                         |
| **Rounds**                     | A round ends once every card is placed. The next round begins with all surviving cards shuffled into a face‑down pile.                                                                                               |
| **Discard Rule**               | All cards in **Not Important** are removed from the game at round end.                                                                                                                                               |
| **Pre‑Populate Option**        | On replay, each card can auto‑appear in the same column as last round, allowing quick re‑evaluation.                                                                                                                 |
| **Column Reduction Algorithm** | Columns compress based on remaining card count:<br>- >25 cards → 5 columns<br>- 11–25 cards → 3 columns (_Very Important · Important · Not Important_)<br>- ≤10 cards → 2 columns (_Very Important · Not Important_) |
| **Progress Gate**              | If **Not Important** is empty _and_ total cards > target, user cannot proceed; they must move at least one card to Not Important.                                                                                    |
| **End Condition**              | Game ends when <br>• `Very Important` count **==** target **OR** <br>• total remaining cards **<=** target and user confirms finish.                                                                                 |

---

## 4. Configurable Parameters

| Setting             | Default             | Range / Options     |
| ------------------- | ------------------- | ------------------- |
| Starting card count | 35                  | Not applicable      |
| Target core values  | 10                  | 3–15                |
| Column labels       | See Initial Columns | Localisable strings |
| Pre‑populate replay | Enabled             | On / Off            |

---

## 5. Accessibility & UX Principles

- Keyboard‑first drag‑and‑drop (arrow keys + space/enter).
- ARIA roles: `list`, `listitem`, `button`, `status`.
- Visible focus ring and high‑contrast palette that meets **WCAG 2.1 AA**.
- Responsive: mobile portrait → desktop widescreen.
- Animations (Framer Motion) respect `prefers-reduced-motion`.

---

## 6. Data Handling

- **Local‑first**: session state saved to IndexedDB after each action.
- **Export / Import**: JSON blob containing card IDs, column, round number, timestamp.
- **Privacy**: no remote storage unless user opts in (future Supabase integration).

---

## 7. Future Enhancements (Out of Scope for MVP)

- Supabase sync for multi‑device continuity.
- Real‑time team mode with shared board.
- Organisation‑specific value sets and branding.
- Analytics dash for aggregated team insights.

---

## 8. Glossary

| Term       | Definition                                                          |
| ---------- | ------------------------------------------------------------------- |
| **Card**   | A single value (e.g., “Integrity”).                                 |
| **Pile**   | Face‑down stack of remaining cards at the start of a round.         |
| **Column** | A rating bucket representing how important a card feels this round. |
| **Target** | Desired final count of core values (user‑selectable).               |
