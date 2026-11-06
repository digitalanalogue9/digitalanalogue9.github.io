# 01: Restore reliable entry and separate exercise setup

**What to build:** Visitors can open the public home page and enter the existing exercise setup reliably in development and the production build. Separate public landing content from exercise setup before redesigning either, preserving existing choices and saved Sessions.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

Parent specification: [Public editorial site](../spec.md), especially Home composition, Navigation/routing and Testing Decisions.

- [ ] Home and direct exercise entry load and refresh without the observed Node-only configuration-global runtime error. Preserve supported configuration intent and existing defaults using the project's browser-compatible configuration approach.
- [ ] Exercise setup is independently renderable and no longer depends on a marketing-page mode flag. Keep the existing public introduction usable until ticket 02 replaces it.
- [ ] Personal and team-focused sets, configurable target count, validation, loading/error feedback and the explicit Start exercise action remain available.
- [ ] The team-focused option remains an individual exercise; no collaboration or shared results are implied.
- [ ] Opening Home or exercise setup creates no Session. Only the explicit Start exercise action creates one through the existing service boundary, without duplicated creation logic.
- [ ] Existing Session query links and direct results, replay and History routes continue to work. An existing unfinished Session remains resumable with its saved progress intact.
- [ ] No storage schema, backup format, catalogue, sorting-rule or consent change is introduced.
- [ ] Extend the existing browser-level route and exercise journeys to cover runtime errors, direct entry/refresh and explicit start/save/resume behaviour. Assert visible behaviour rather than component structure.
- [ ] Relevant existing tests, type checking, lint and the production build pass. Keep this prefactor bounded; unrelated configuration cleanup is excluded.

## Reviewed wording requirements

Use [Shared wording and adjacent application text](../copy-review.md#shared-wording-and-adjacent-application-text) in the owner-reviewed copy proposal and [product marketing context](../../../docs/product-marketing.md). This updates wording only; preserve the functional acceptance criteria above and the existing worker checkpoint.

- [ ] Use “Set up your values exercise” for the setup heading, “Personal values” and “Team-focused values” for the choices, and “How many values would you like to finish with?” for the target label.
- [ ] Explain: “The team-focused set is an individual exercise about what matters to you at work. You can use your choices to start a conversation with others.”
- [ ] Retain “Start exercise” as the explicit Session-creation action. Use ordinary participant language in surrounding prose without renaming domain contracts or changing validation, loading or error behaviour.

## Comments

- This is the first frontier ticket. Its completed demo is reliable navigation from the current home page into setup and a Session that can be saved and resumed.

- 2026-11-06 owner instruction: **Application editing is paused pending owner review of proposed wording.** Read [the copy review and proposal](../copy-review.md) before resuming. Preserve the paused worker checkpoint and functional acceptance criteria. After wording review, use the reviewed setup wording without widening this prefactor.


- 2026-11-06 follow-up: the owner reviewed the copy proposal, requested these wording requirements in the existing tickets, and authorised implement-spec to continue after the updates. This supersedes the earlier wording-review pause. Use the recommended draft in copy-review.md; alternative headlines and CTAs are not selected.
