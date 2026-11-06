# 07: Verify the complete public-site journey

**What to build:** Deliver an integrated, production-build-verifiable public site whose five pages, optional sample and exercise handoff work together across devices while preserving saved Sessions, consent, direct links and supported offline behaviour. Fix defects found in the combined review.

**Blocked by:** 03 — Add the optional reflection sample; 04 — Tell the origin story and improve Contact; 05 — Explain the exercise through How it works; 06 — Make Privacy clear and actionable.

**Status:** ready-for-agent

Parent specification: [Public editorial site](../spec.md), especially Accessibility and completion criteria and Testing Decisions.

- [ ] Run the complete public journey against the actual production build: directly open/refresh each of the five public pages, follow navigation and footer links, use both home actions and secondary behaviour entry, and reach exercise setup without premature Session creation.
- [ ] Confirm both exercise value sets and target configuration remain usable and that an existing unfinished Session can be resumed. Preserve results/replay links, backups, social-share destinations, installation and existing supported offline behaviour.
- [ ] Confirm the optional sample is skippable, resettable, non-diagnostic, keyboard-operable and isolated from persisted Sessions, scenario attempts, query strings and outbound answer data.
- [ ] Verify consent pending/rejected/granted/withdrawn behaviour using the existing tests and a representative integrated browser journey. Exercise work and consent preferences survive the redesign, with no new tracking introduced.
- [ ] Check each public page's title, description, canonical/social metadata and generated static-host route metadata. The existing public domain and direct application links remain correct.
- [ ] Perform one batched visual review of all five pages at 1440px desktop and 390px mobile, plus a 320px overflow check and 200% zoom. Include no-choice/selected sample, pending consent, reduced motion, focus, font failure and image failure states.
- [ ] Verify meaningful primary headings and landmarks, accessible names and feedback, principal targets at least 44px high, body contrast at least 4.5:1 and large-text/control/focus contrast at least 3:1. Selection must remain understandable without colour.
- [ ] Confirm editorial styling does not spill into the exercise board, History, results or replay, and SVG filenames remain stable. Product imagery uses synthetic, labelled data and no private saved content.
- [ ] Fix review defects in one batch and use at most one confirmation round. Run the design detector as a supplement to visual/keyboard checks; record concrete remaining limitations rather than silently ignoring them or changing baselines to conceal failures.
- [ ] Run existing type, lint, relevant test, production-build and static-host artifact checks. Each earlier ticket must already have passed its own relevant checks; this ticket adds integration evidence rather than deferring all testing to the end.
- [ ] Record a concise verification outcome with reviewed viewports/states, check results and any residual limitations. Resolve defects that prevent the parent specification's acceptance criteria from passing.
- [ ] Do not deploy, publish the site, change the parent specification or expand into new product capabilities as part of verification.

## Comments

- Tickets 01 and 02 are transitive prerequisites through tickets 03–06; they are deliberately not duplicated in the blocking list. The final demo is the whole public-site-to-exercise journey in the built static application.
