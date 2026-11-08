# 03: Add the optional reflection sample

**What to build:** Visitors can try a short, non-diagnostic choice between two existing values on Home, change or reset
their choice, and enter the full exercise at any point. Trying the sample leaves no saved answer, Session or network
submission.

**Blocked by:** 02 — Launch the editorial home page and public navigation.

**Status:** resolved

Parent specification: [Public editorial site](../spec.md), especially Optional sample interaction contract.

- [x] Place the sample after the main introduction and process explanation, before the secondary behaviour invitation.
      It is optional and never a full-screen gate or prerequisite for the main action.
- [x] Use the existing SECURITY and INDEPENDENCE catalogue values, displayed as Security and Independence, preserving
      their meaning. Introduce them with “When two good things compete, what comes first?” and “There’s no right answer.
      The interesting part is why.”
- [x] Support no choice, Security selected and Independence selected. Either selection reveals the same neutral prompt:
      “What makes that feel more important to you today?” and an invitation to explore the complete set.
- [x] Visitors can change selection and use “Reset sample”. Native labelled controls expose selection beyond colour;
      adjacent feedback is accessible without unexpected focus movement or a keyboard trap.
- [x] Show “A sample only. Your choice isn’t saved.” Keep a direct full-exercise action available before and after
      selection.
- [x] Sample state exists only in the current page's memory, resets on leaving/reloading and does not transfer into
      exercise setup. Add no free-text field, personality interpretation, score, ranking or generated advice.
- [x] Choosing/resetting creates no Session or scenario attempt, changes no existing record and submits no answer
      through analytics, requests, query strings or any other persistence channel. Do not load exercise services solely
      for the sample.
- [x] Browser tests cover initial state, both choices, changing/resetting, reload/navigation reset, keyboard operation,
      neutral feedback and exercise handoff. Verify saved-work isolation through existing browser-visible storage/test
      capabilities rather than a new abstraction.
- [x] Intercept requests in a representative journey to confirm no sample answer is transmitted and optional analytics
      remains off before consent/after rejection. Reuse existing consent tests for detailed consent transitions.
- [x] Sample controls and feedback work on mobile and with reduced motion, with visible focus, sufficient contrast and
      principal targets at least 44px high. Relevant tests and checks pass.
- [x] Home shows the secondary behaviour invitation only when `VITE_ENABLE_BEHAVIOUR_REFLECTION` is explicitly true; the
      optional sample remains available whether behaviour reflection is enabled or disabled.

## Reviewed wording requirements

Use the [optional sample draft](../copy-review.md#optional-sample) as part of the reviewed Home copy. Keep all isolation
and accessibility criteria above.

- [x] Retain the exact catalogue descriptions: Security — “It is important to know your work will always be there for
      you.” Independence — “You like being able to work in the way you want, without others telling you what to do.” Do
      not broaden these into different concepts.
- [x] After either selection, use the same neutral question specified above and the invitation “Explore the complete set
      and see which other values you want to keep.”
- [x] Use “Find my core values” for the persistent full-exercise action, “Reset sample” for reset, and “A sample only.
      Your choice isn’t saved.” for reassurance. Add no interpretation, score or answer-dependent persuasion.

## Comments

- This sample demonstrates reflection, not the exercise engine. Its choices must not be mistaken for results or used to
  seed a Session.

- 2026-11-06 owner instruction: **Application editing is paused pending owner review of proposed wording.** Read
  [the copy review and proposal](../copy-review.md) before resuming. Keep the sample wording, exact catalogue meanings
  and neutral feedback in the proposal. Review approval does not authorise persistence or sample analytics.

- 2026-11-06 follow-up: the owner reviewed the copy proposal, requested these wording requirements in the existing
  tickets, and authorised implement-spec to continue after the updates. This supersedes the earlier wording-review
  pause. Use the recommended draft in copy-review.md; alternative headlines and CTAs are not selected.

- 2026-11-08 implementation handoff: Added the optional two-value sample as page-memory state on Home, with native
  radios, neutral live feedback, reset, persistent exercise links, and no exercise-service or analytics integration.
  Tuned Home section spacing and mobile layout. The section order carries the user-approved process-before-Example
  outcome edit.
- TDD red:
  `pnpm exec playwright test --config playwright.ticket03.config.ts --grep "optional sample|sample is usable" --reporter=line`
  failed against the pre-feature Home because the Security radio was absent.
- TDD green: the complete Home browser spec passed (4/4) with the flag unset; explicit false and true feature-gate cases
  each passed (1/1). The saved-work sample test passed (1/1) with a stored Session and identical IndexedDB records
  before and after. Also passed `pnpm typecheck`,
  `pnpm exec eslint src/app/HomeClient.tsx tests/e2e/home-editorial.spec.ts`, and
  `pnpm exec prettier --check src/app/HomeClient.tsx src/styles/editorial.css tests/e2e/home-editorial.spec.ts .scratch/public-editorial-site/issues/03-optional-reflection-sample.md`.
- Browser checks ran in `C:\dev\worktrees\editorial-03-sample` using dedicated port 5174 with server reuse disabled; no
  integration checkout files or port-5173 process were changed.
- 2026-11-08 follow-up: the owner approved the public-default behaviour feature gate. Home now reuses the existing
  `isBehaviourReflectionEnabled()` helper for the secondary invitation. Its default-disabled and explicit-enabled
  browser cases are added; unset, false, and true flag checks now pass at staging tip f2ca980.
- Saved-work isolation was strengthened after review: the browser test creates a Session through the public exercise
  flow and compares every IndexedDB object-store record before and after the sample journey.

- TDD red for the Home flag: the new invitation case failed while the baseline helper returned true with the flag unset.
- 2026-11-08 orchestration update: integrated on the staging branch; sample isolation and both public feature-flag states are verified, with typecheck, focused lint, formatting and diff checks passing.
