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

## Comments

- This sample demonstrates reflection, not the exercise engine. Its choices must not be mistaken for results or used to seed a Session.
