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

## Comments

- This is the first frontier ticket. Its completed demo is reliable navigation from the current home page into setup and a Session that can be saved and resumed.
