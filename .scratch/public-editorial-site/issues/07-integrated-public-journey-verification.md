# 07: Verify the complete public-site journey

**What to build:** Deliver an integrated, production-build-verifiable public site whose five pages, optional sample and exercise handoff work together across devices while preserving saved Sessions, consent, direct links and supported offline behaviour. Fix defects found in the combined review.

**Blocked by:** 03 — Add the optional reflection sample; 04 — Tell the origin story and improve Contact; 05 — Explain the exercise through How it works; 06 — Make Privacy clear and actionable.

**Status:** ready-for-agent

Parent specification: [Public editorial site](../spec.md), especially Accessibility and completion criteria and Testing Decisions.

- [ ] Run the complete public journey against the actual production build: directly open/refresh each of the five public pages, follow navigation and footer links, use both Home actions, and reach exercise setup without premature Session creation. Build with VITE_ENABLE_BEHAVIOUR_REFLECTION unset/false and confirm the Home/How it works behaviour invitations are hidden and /behaviour resolves to not-found; build with it set to true and confirm both invitations and the existing route work.
- [ ] Confirm both exercise value sets and target configuration remain usable and that an existing unfinished Session can be resumed. Preserve results/replay links, backups, social-share destinations, installation and existing supported offline behaviour.
- [ ] Confirm the optional sample is skippable, resettable, non-diagnostic, keyboard-operable and isolated from persisted Sessions, scenario attempts, query strings and outbound answer data.
- [ ] Verify consent pending/rejected/granted/withdrawn behaviour using the existing tests and a representative integrated browser journey. Exercise work and consent preferences survive the redesign, with no new tracking introduced.
- [ ] Check each public page's title, description, canonical/social metadata and generated static-host route metadata. The existing public domain and direct application links remain correct in both flag states; the behaviour page metadata is available when enabled.
- [ ] Perform one batched visual review of all five pages at 1440px desktop and 390px mobile, plus a 320px overflow check and 200% zoom. Include no-choice/selected sample, pending consent, reduced motion, focus, font failure and image failure states.
- [ ] Verify meaningful primary headings and landmarks, accessible names and feedback, principal targets at least 44px high, body contrast at least 4.5:1 and large-text/control/focus contrast at least 3:1. Selection must remain understandable without colour.
- [ ] Confirm editorial styling does not spill into the exercise board, History, results or replay, and SVG filenames remain stable. Product imagery uses synthetic, labelled data and no private saved content.
- [ ] Fix review defects in one batch and use at most one confirmation round. Run the design detector as a supplement to visual/keyboard checks; record concrete remaining limitations rather than silently ignoring them or changing baselines to conceal failures.
- [ ] Run existing type, lint, relevant test, production-build and static-host artifact checks. Each earlier ticket must already have passed its own relevant checks; this ticket adds integration evidence rather than deferring all testing to the end.
- [ ] Record a concise verification outcome with reviewed viewports/states, check results and any residual limitations. Resolve defects that prevent the parent specification's acceptance criteria from passing.
- [ ] Do not deploy, publish the site, change the parent specification or expand into new product capabilities as part of verification.

- [ ] In a disabled build, hide active behaviour-reflection presentation in History while preserving saved records; scenario reflection backups remain accepted and retain their existing import/export semantics.
- [ ] Confirm the flag changes visibility only: no changes to behaviour engine, stored Sessions/attempts, or backup formats and contracts.

## Reviewed wording requirements

Use [the reviewed copy baseline](../copy-review.md), especially [shared wording and adjacent application text](../copy-review.md#shared-wording-and-adjacent-application-text), [metadata](../copy-review.md#proposed-metadata) and [product marketing context](../../../docs/product-marketing.md). This adds a copy consistency check and bounded interface text edits to the existing integrated review.

- [ ] Check the five public pages together for warm, confident, audience-focused British English. Preserve the personal About story and the recommended Home opening; verify concrete explanations of the exercise, its relevance and next actions.
- [ ] Check that hypothetical outcomes and notes are labelled, team use remains individual, and, when enabled, behaviour prompts offer possibilities. Verify storage/export wording accurately describes current behaviour in both flag states. Add no claims, testimonials, completion durations or fixed result counts.
- [ ] Apply the reviewed adjacent interface text for behaviour entry/results, History/introduction/empty state, backup input/warnings and final-values/notes guidance. Coordinate consent wording with ticket 06 and setup wording with ticket 01 rather than implementing those twice.
- [ ] Preserve catalogue definitions, scenario responses, generated prompt templates, operational diagnostics, engine behaviour, data contracts and export semantics. This is a bounded wording pass, not a new feature or content catalogue.
- [ ] Use copywriting to check any necessary new marketing lines and copy-editing for the final clarity, voice, benefit, evidence, specificity and friction passes. Remove hype, corporate language, clichés and formulaic AI phrasing without flattening the genuine voice.
- [ ] Check reviewed titles/descriptions and social previews against built route metadata. Protect visible behaviour and factual links through existing tests; do not add prose or DOM snapshots just to mirror the copy.

## Comments

- Tickets 01 and 02 are transitive prerequisites through tickets 03–06; they are deliberately not duplicated in the blocking list. The final demo is the whole public-site-to-exercise journey in the built static application.

- 2026-11-06 owner instruction: **Application editing is paused pending owner review of proposed wording.** Read [the copy review and proposal](../copy-review.md) before resuming. Include a cross-page copy check against the reviewed proposal, natural British English and accurate metadata. Apply only the reviewed adjacent interface text edits; catalogue definitions, scenario responses, prompt templates and engine behaviour remain outside this copy pass.


- 2026-11-06 follow-up: the owner reviewed the copy proposal, requested these wording requirements in the existing tickets, and authorised implement-spec to continue after the updates. This supersedes the earlier wording-review pause. Use the recommended draft in copy-review.md; alternative headlines and CTAs are not selected.
