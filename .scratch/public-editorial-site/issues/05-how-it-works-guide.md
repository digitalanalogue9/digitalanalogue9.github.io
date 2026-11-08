# 05: Explain the exercise through How it works

**What to build:** Visitors can quickly see the sorting, narrowing and reflection process, then read accurate practical guidance before entering the existing exercise. Returning participants retain their saved instruction preference.

**Blocked by:** 02 — Launch the editorial home page and public navigation.

**Status:** ready-for-human

Parent specification: [Public editorial site](../spec.md), especially How it works and Testing Decisions.

- [x] Use “How it works” in the page and public navigation while preserving the existing help URL and direct-refresh behaviour.
- [x] Lead with “Sort. Narrow. Reflect.” and three accurate product views showing value placement, narrowing through rounds and a final set with optional notes.
- [x] Capture or compose views from the current application using synthetic example data, never saved user content. Supply concise captions, meaningful alternatives, intrinsic dimensions and lazy loading below the fold.
- [x] Match real controls and current behaviour rather than inventing a different sorting interaction. Explain personal/team-focused sets, configurable target count, importance categories, rounds and removal of Not Important values when advancing.
- [x] Preserve guidance about locally saved progress, optional notes, History, resume/review, replay and supported backups. Do not imply automatic cross-device syncing.
- [x] Explicitly explain that the team-focused option is an individual exercise supporting later conversation, not a shared Session or group result.
- [x] Preserve the instruction-preference control, its existing stored choice and its effect when starting the exercise. Do not replace or reset the preference as part of the visual redesign.
- [x] When VITE_ENABLE_BEHAVIOUR_REFLECTION=true, give behaviour reflection its own clearly distinguished explanation and action, retaining the six-situation description and possible-perspectives limitation. When unset or false, hide that section and action.
- [x] Provide working exercise and History actions, appropriate Read-mode hierarchy and updated title/description/social metadata. Ensure long captions and instructions remain legible without repeated decorative panels.
- [x] Extend existing instruction-preference, content and browser-route tests to cover persistence, navigation and direct refresh. Assert behaviours and working destinations instead of image pixels or markup structure. Cover both feature-flag states for the behaviour section/action and route.
- [x] Verify mobile image scaling, readable body measure, keyboard focus, image failure and 320px overflow. Relevant checks pass.

## Reviewed wording requirements

Implement the [How it works draft](../copy-review.md#proposed-how-it-works-copy) and corresponding [metadata](../copy-review.md#proposed-metadata). Keep practical language aligned with current controls and mechanics.

- [x] Use the reviewed opening and three product-view captions: “Sort the cards”, “Narrow your choices” and “Reflect on your final set”. Label the synthetic composition “Example exercise”; alternative text must describe the actual illustrated stage.
- [x] Follow with the reviewed set/target, sorting, reflection, backup and separate behaviour sections. Explain the individual nature of team-focused use and the six-situation flow without adding capabilities or changing catalogue content.
- [x] Explain that the standard values JSON export omits additional reflection notes added on the completed exercise page, and point to the existing “Export reflection backup” action in History to include them. Do not imply every export preserves every note or alter export semantics.
- [x] Use “Show instructions next time” for the preference section. Preserve “Show instructions when starting the exercise”, its existing feedback and saved state.
- [x] Use the reviewed exercise and History actions in every build. Show the reviewed behaviour action and section only when VITE_ENABLE_BEHAVIOUR_REFLECTION=true. Keep Read-mode prose direct and useful; avoid promotional language in detailed guidance.

## Comments

- The completed slice is a working public guide with honest visuals and preserved instructions, not a standalone asset-production task.
- 2026-11-08 owner-approved update: behaviour reflection is opt-in in public builds. The reviewed explanation/action is visible only when VITE_ENABLE_BEHAVIOUR_REFLECTION=true; unset/false hides it. Existing tool, local data and backup semantics remain unchanged.

- 2026-11-06 owner instruction: **Application editing is paused pending owner review of proposed wording.** Read [the copy review and proposal](../copy-review.md) before resuming. Use the reviewed guide, captions and backup guidance. Explain the existing Export reflection backup option and preserve instruction-preference behaviour.


- 2026-11-06 follow-up: the owner reviewed the copy proposal, requested these wording requirements in the existing tickets, and authorised implement-spec to continue after the updates. This supersedes the earlier wording-review pause. Use the recommended draft in copy-review.md; alternative headlines and CTAs are not selected.

- 2026-11-06 implementation: built the Read-mode guide at the existing `/howtouse` route with three labelled synthetic product views, local instruction preference, working exercise/History/behaviour actions and reviewed storage/backup guidance. Playwright guide suite passed 5/5 on isolated Vite port 5195; it covers direct route/refresh, metadata, navigation, preference persistence, broken illustrations, keyboard focus and 320px responsive layout. Captured and reviewed desktop and 390px full-page screenshots. TypeScript, scoped ESLint, Prettier and production build passed.
- 2026-11-08 ticket 05 feature-visibility acceptance: How it works now asserts the behaviour-reflection section and its action are present only when `VITE_ENABLE_BEHAVIOUR_REFLECTION=true`. The guide suite and explicit false/true runs passed against staging `b4ef051`; the same new assertion failed with the flag unset and false against pre-gate `08cbdbf`. Guide suite: 6/6 (unset); targeted visibility test: 1/1 (false) and 1/1 (true). Typecheck, scoped ESLint, Prettier and `git diff --check` passed. No production code changed.
