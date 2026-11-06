# 06: Make Privacy clear and actionable

**What to build:** Visitors can understand the short version of the site's data behaviour, read precise details and manage optional analytics through an accessible, restrained Privacy page without losing existing choices.

**Blocked by:** 02 — Launch the editorial home page and public navigation.

**Status:** ready-for-agent

Parent specification: [Public editorial site](../spec.md), especially Privacy and Contact and Navigation/routing.

- [ ] Start with “Your reflections stay in this browser.” Follow with “Exercise answers and notes are stored on this device. They don’t sync automatically. Optional Google Analytics loads only if you allow it.”
- [ ] Use a quiet Read-mode layout with scannable sections and comfortable line length. Preserve the detailed notice rather than replacing it with promotional reassurance.
- [ ] Clearly distinguish local exercise storage, scenario reflections, site preferences, consent, exported backups and optional analytics. Keep the explanation accurate for current behaviour.
- [ ] Preserve warnings that clearing browser data can remove saved work, Sessions do not automatically sync, backups should be kept private and withdrawing consent does not remove information already collected by Google.
- [ ] Preserve the current analytics property and consent defaults. Optional analytics does not load before permission; query strings/fragments and exercise content remain excluded from the existing analytics event payloads.
- [ ] Existing accept/reject/withdraw controls, persisted choices, accessible current-state indication and saved feedback remain functional. Allow and reject remain easy to find; the visual treatment does not steer visitors toward consent.
- [ ] Retain the existing privacy-contact email, Privacy URL, canonical domain and updated page-specific metadata. Privacy remains reachable from all page footers and consent controls, with a clear path to the exercise.
- [ ] Add no absolute anonymity, encryption, regulatory-compliance or no-network-traffic claims, and no tracking vendor, storage model or consent-model change.
- [ ] Reuse and extend existing consent tests for rejection, remembered choices, granting and withdrawal; cover direct Privacy load/refresh and actual link/control behaviour at the browser boundary without duplicating all consent tests on every page.
- [ ] Verify mobile/desktop readability, keyboard operation, feedback announcements, contrast, 320px overflow and 200% zoom. Relevant checks pass.

## Comments

- The completed slice demonstrates both comprehension and working privacy controls. Legal/product claims remain tied to the existing implementation rather than historical aspirations.
