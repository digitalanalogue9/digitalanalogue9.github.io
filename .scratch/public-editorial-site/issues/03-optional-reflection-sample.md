# 03: Add the optional reflection sample

**What to build:** Visitors can try a short, non-diagnostic choice between two existing values on Home, change or reset their choice, and enter the full exercise at any point. Trying the sample leaves no saved answer, Session or network submission.

**Blocked by:** 02 — Launch the editorial home page and public navigation.

**Status:** ready-for-agent

Parent specification: [Public editorial site](../spec.md), especially Optional sample interaction contract.

- [ ] Place the sample after the main introduction and process explanation, before the secondary behaviour invitation. It is optional and never a full-screen gate or prerequisite for the main action.
- [ ] Use the existing SECURITY and INDEPENDENCE catalogue values, displayed as Security and Independence, preserving their meaning. Introduce them with “When two good things compete, what comes first?” and “There’s no right answer. The interesting part is why.”
- [ ] Support no choice, Security selected and Independence selected. Either selection reveals the same neutral prompt: “What makes that feel more important to you today?” and an invitation to explore the complete set.
- [ ] Visitors can change selection and use “Reset sample”. Native labelled controls expose selection beyond colour; adjacent feedback is accessible without unexpected focus movement or a keyboard trap.
- [ ] Show “A sample only. Your choice isn’t saved.” Keep a direct full-exercise action available before and after selection.
- [ ] Sample state exists only in the current page's memory, resets on leaving/reloading and does not transfer into exercise setup. Add no free-text field, personality interpretation, score, ranking or generated advice.
- [ ] Choosing/resetting creates no Session or scenario attempt, changes no existing record and submits no answer through analytics, requests, query strings or any other persistence channel. Do not load exercise services solely for the sample.
- [ ] Browser tests cover initial state, both choices, changing/resetting, reload/navigation reset, keyboard operation, neutral feedback and exercise handoff. Verify saved-work isolation through existing browser-visible storage/test capabilities rather than a new abstraction.
- [ ] Intercept requests in a representative journey to confirm no sample answer is transmitted and optional analytics remains off before consent/after rejection. Reuse existing consent tests for detailed consent transitions.
- [ ] Sample controls and feedback work on mobile and with reduced motion, with visible focus, sufficient contrast and principal targets at least 44px high. Relevant tests and checks pass.

## Reviewed wording requirements

Use the [optional sample draft](../copy-review.md#optional-sample) as part of the reviewed Home copy. Keep all isolation and accessibility criteria above.

- [ ] Retain the exact catalogue descriptions: Security — “It is important to know your work will always be there for you.” Independence — “You like being able to work in the way you want, without others telling you what to do.” Do not broaden these into different concepts.
- [ ] After either selection, use the same neutral question specified above and the invitation “Explore the complete set and see which other values you want to keep.”
- [ ] Use “Find my core values” for the persistent full-exercise action, “Reset sample” for reset, and “A sample only. Your choice isn’t saved.” for reassurance. Add no interpretation, score or answer-dependent persuasion.

## Comments

- This sample demonstrates reflection, not the exercise engine. Its choices must not be mistaken for results or used to seed a Session.

- 2026-11-06 owner instruction: **Application editing is paused pending owner review of proposed wording.** Read [the copy review and proposal](../copy-review.md) before resuming. Keep the sample wording, exact catalogue meanings and neutral feedback in the proposal. Review approval does not authorise persistence or sample analytics.


- 2026-11-06 follow-up: the owner reviewed the copy proposal, requested these wording requirements in the existing tickets, and authorised implement-spec to continue after the updates. This supersedes the earlier wording-review pause. Use the recommended draft in copy-review.md; alternative headlines and CTAs are not selected.
