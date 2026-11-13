# Finish Option Confirmation

## Summary

Replace the ambiguous early-finish action with a clearly explained **Finish** option. The person keeps the number of
values selected at the start; the app fills any missing places from the highest-ranked eligible categories and explains
the exact result before applying it.

## Eligibility

- All cards in the current round must be sorted before **Finish** is available.
- In round one, **Finish** is available when at least the selected target number of values is in **Very Important**.
- In round two and every later round, **Finish** is available when at least half of the target, rounded up, is in **Very
  Important**, and the non-**Not Important** categories together contain enough values to reach the target.
- When finishing, keep the current **Very Important** values, then fill any remaining places from the highest-ranked
  available categories in order: **Quite Important**, **Important**, **Of Some Importance**. Do not promote values from
  **Not Important**.
- Place every value outside the final selected set in **Not Important**. Complete with exactly the selected target
  count.

## Confirmation copy

### Title

**Finish now?**

### Body

Generate the body from the current category counts. State the target, the values already in **Very Important**, and each
category that will supply the remainder. Use this pattern:

> Your target is 10 values. You have 7 in Very Important. We’ll add the top 3 from Quite Important to reach 10. All
> other values will be in Not Important.

When the target is already in **Very Important**, use:

> Your target is 10 values. You already have 10 in Very Important. The remaining values will be in Not Important.

List each supplying category when the top-up spans multiple categories. Use the actual target and counts in place of the
example numbers. Avoid saying that values will be moved if they are already in **Not Important**.

### Actions and dismissal

- **Continue** confirms finishing and applies the stated category changes.
- **Cancel** closes the confirmation and leaves the exercise unchanged.
- A top-right close button, Escape, and clicking the backdrop have the same effect as **Cancel**.
- The exercise action is labeled **Finish**, styled as a secondary action distinct from **Next Round**. The modal uses
  **Continue** and **Cancel**.

## Layout and accessibility

- Support 320 × 568 and 375 × 667 CSS-pixel viewports, plus desktop monitor and laptop layouts.
- If the content does not fit vertically, allow the explanation to scroll while keeping **Continue** and **Cancel**
  reachable.
- Give the dialog an accessible name, label the close button, manage keyboard focus on open and close, and keep all
  actions keyboard operable.
- Confirming must run once; every dismissal path must leave card categories unchanged.

## History observation

The reported History behavior could not be tied to whether the session was opened before or after **Save Completed
Session**. In the current flow, an in-progress session resumes in the exercise, while a completed session resumes in
reasoning. Do not change History routing as part of this feature without confirming the observed case.
