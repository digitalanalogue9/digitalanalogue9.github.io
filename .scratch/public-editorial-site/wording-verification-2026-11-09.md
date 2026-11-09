# Wording implementation verification

Date: 2026-11-09

Implemented findings 2–6 and the optional clarity refinements from [the wording review](wording-review-2026-11-09.md). Finding 1, the Functional preferences consent decision, remains deferred. Consent controls and behaviour are unchanged.

- Replaced backup import jargon and aligned behaviour reflection terminology in the active flow, History, metadata and messages.
- Corrected setup sequencing and listed the actual importance categories in the guide.
- Matched backup guidance to the visible Export and Export reflection backup controls. Added a History link for backing up saved reflection notes; existing explicit-save guidance remains intact.
- Simplified example descriptions, added the storage consequence and backup action to Home's closing, and aligned View History capitalisation.
- Updated existing browser locators and the existing privacy assertion. Added no prose snapshots, new test seams or behaviour changes.

## Validation

- Typecheck passed, including after the review fix.
- Full unit suite: 22 files, 88 tests passed.
- Lint: no errors; three existing unused-variable warnings in `tests/components/Card.test.tsx`.
- Production builds and Pages artifact validation passed with behaviour reflection disabled and explicitly enabled.
- Browser journeys: 17 passed in the default build; 18 passed in the enabled build, including completion, return, History and backups for behaviour reflection.
- Bounded visual check of changed public pages and entry/History screens at 1440px and 390px. Final captures waited for route headings to replace lazy-loading placeholders. No horizontal overflow across Home, How it works, Privacy, setup, History and enabled behaviour entry at 1440px, 390px and 320px (18 checks). Existing browser coverage also checked sample operation, saved instructions and illustration failure.
- Standards review: no material findings. Spec review: one terminology omission in an export-error fallback, corrected to “Behaviour reflection export failed.”

Evidence logs and browser captures were moved outside the working tree to:

`C:/Users/DANIEL~1.HIB/AppData/Local/Temp/core-values-wording-01cf2ade051f4be2bdeb6b1f7f853c24/`

Review comparison starts at `9e13456fbfb8f348fea1b36df40e21059b70bda3`. No deployment or publication performed.
