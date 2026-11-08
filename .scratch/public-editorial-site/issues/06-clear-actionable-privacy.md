# 06: Make Privacy clear and actionable

**What to build:** Visitors can understand the short version of the site's data behaviour, read precise details and manage optional analytics through an accessible, restrained Privacy page without losing existing choices.

**Blocked by:** 02 — Launch the editorial home page and public navigation.

**Status:** resolved

Parent specification: [Public editorial site](../spec.md), especially Privacy and Contact and Navigation/routing.

- [x] Start with “Your reflections stay in this browser.” Follow with “Exercise answers and notes are stored on this device. They don’t sync automatically. Optional Google Analytics loads only if you allow it.”
- [x] Use a quiet Read-mode layout with scannable sections and comfortable line length. Preserve the detailed notice rather than replacing it with promotional reassurance.
- [x] Clearly distinguish local exercise storage, scenario reflections, site preferences, consent, exported backups and optional analytics. Keep the explanation accurate for current behaviour.
- [x] Preserve warnings that clearing browser data can remove saved work, Sessions do not automatically sync, backups should be kept private and withdrawing consent does not remove information already collected by Google.
- [x] Preserve the current analytics property and consent defaults. Optional analytics does not load before permission; query strings/fragments and exercise content remain excluded from the existing analytics event payloads.
- [x] Existing accept/reject/withdraw controls, persisted choices, accessible current-state indication and saved feedback remain functional. Allow and reject remain easy to find; the visual treatment does not steer visitors toward consent.
- [x] Retain the existing privacy-contact email, Privacy URL, canonical domain and updated page-specific metadata. Privacy remains reachable from all page footers and consent controls, with a clear path to the exercise.
- [x] Add no absolute anonymity, encryption, regulatory-compliance or no-network-traffic claims, and no tracking vendor, storage model or consent-model change.
- [x] Reuse and extend existing consent tests for rejection, remembered choices, granting and withdrawal; cover direct Privacy load/refresh and actual link/control behaviour at the browser boundary without duplicating all consent tests on every page.
- [x] Verify mobile/desktop readability, keyboard operation, feedback announcements, contrast, 320px overflow and 200% zoom. Relevant checks pass.

## Reviewed wording requirements

Implement the complete [Privacy draft](../copy-review.md#proposed-privacy-copy), relevant [shared consent wording](../copy-review.md#shared-wording-and-adjacent-application-text) and [metadata](../copy-review.md#proposed-metadata). Preserve all existing data-handling and consent contracts.

- [x] Retain the agreed short introduction and the full reviewed sections on browser storage, downloaded backups, optional Google Analytics, current consent and privacy contact. Keep technical details available without leading with them.
- [x] Explain “Export reflection backup” and the standard export's additional-reflection-note omission. Preserve the distinction between values imports creating a separate copy for an existing ID and behaviour imports replacing a saved reflection with the same ID.
- [x] Use sentence-case “Allow analytics”, “Reject analytics” and “Your analytics preference has been saved.” Map current-state wording to “Not set”, “Allowed” or “Rejected” without changing stored consent values.
- [x] Use the reviewed consent-banner wording and British “Customise preferences”. Retain “Reject optional cookies” where the action also rejects functional preference consent. Preserve the “Functional preferences” label unless actual behaviour supports a more specific explanation; invent no effect for that field.
- [x] Retain property G-JZPX5JCP5D, query/fragment omission, optional loading, advertising/Signals settings, withdrawal limits and the existing contact address. Friendly language must not weaken these material details.

## Comments

- The completed slice demonstrates both comprehension and working privacy controls. Legal/product claims remain tied to the existing implementation rather than historical aspirations.

- 2026-11-06 owner instruction: **Application editing is paused pending owner review of proposed wording.** Read [the copy review and proposal](../copy-review.md) before resuming. Use the reviewed short introduction and complete detailed notice. Preserve analytics configuration, consent behaviour and the difference between values and behaviour backup imports.


- 2026-11-06 follow-up: the owner reviewed the copy proposal, requested these wording requirements in the existing tickets, and authorised implement-spec to continue after the updates. This supersedes the earlier wording-review pause. Use the recommended draft in copy-review.md; alternative headlines and CTAs are not selected.

- 2026-11-08 implementation complete on implement/editorial-06-fresh; implementation commit 3f967de plus integration sync cd57257 (latest tip 08cbdbf). Targeted consent tests, typecheck, lint and five app-routing browser tests pass. Privacy copy, metadata and controls retain the existing consent and analytics contracts.
- 2026-11-08 orchestration update: integrated on staging at 374f19e; default-disabled and enabled browser checks passed 7/7 each, Home flag visibility 1/1 each, consent/behaviour-attempt/reflection-backup tests 26/26, typecheck, targeted lint, formatting, build and diff checks passed. Scenario backup import remains supported in both states.
