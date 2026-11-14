# 02: Save unfinished reflection drafts

**What to build:** A participant can leave an unfinished reflection, return to it and change their selected values
without losing the answers that still apply. Drafting stays on the device and does not complete the exercise.

**Blocked by:** 01 — Move reflection into the exercise flow.

**Status:** resolved

- [x] Save draft reflection answers locally as they change and restore them after leaving the page, refreshing or
      returning to the unfinished session; drafting alone does not complete it.
- [x] If saving a draft fails, communicate the failure rather than claiming the draft was saved, while retaining the
      visible entries for retry.
- [x] After returning to sorting and changing the final values, preserve answers for values still selected, the session
      goal and other applicable answers.
- [x] Exclude removed values and no-longer-applicable relationship answers from the completed reflection without
      assigning their content to different values.
- [x] Completing persists the applicable reflection with the session and leaves no stale draft that can overwrite a
      later completed edit. Preserve any draft data in a complete saved-session backup where applicable.
- [x] Verify the draft, changed-selection, refresh and completion journeys through existing browser and service/storage
      seams, including relevant failure and data-compatibility cases.
