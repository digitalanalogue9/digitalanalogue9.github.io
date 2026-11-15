# Desktop and mobile experience review

Base: `9e3c9e501e25134979f5512fe8363163cb9b39c6` (local main). Review worktree: `review/desktop-mobile-quality`.

## Coverage and evidence

The first attempt used an unrelated server on port 5173; those original screenshots and browser-test results were
discarded as evidence. The follow-up used servers explicitly started in this worktree: default settings on port 5173 and
behaviour reflection enabled on port 4178.

Playwright MCP with Chromium inspected `/`, `/howtouse`, `/about`, `/contact`, `/privacy`, `/history`, `/exercise`,
`/replay`, `/completed`, `/reasoning`, an unknown route, and the enabled `/behaviour` flow. Layout and document overflow
were checked at 320, 390, 768 and 1440 CSS pixels wide, with 800px-high viewports. Full-page captures at 320 and 1440
were reviewed for the public pages, history, exercise setup and populated results, reasoning and replay. Mobile captures
included exercise instructions, sorting, category review, and the behaviour question, results and recurring prompt; the
enabled prompt was also inspected on desktop. A synthetic completed values backup supplied populated states.

Interactions included privacy consent changes, malformed backup import, exercise setup, instructions, placing and moving
a value, category review, menu, skip link, and all six behaviour questions followed by the recurring prompt. A separate
Chromium mobile-emulated context with touch enabled tapped through sorting, category review and moving a card. This is
not a physical device or Safari test. The malformed import produced an alert; privacy settings updated after consent was
changed. A reduced-motion emulation check confirmed the sampled home action has no transition.

## Findings and resolutions

| Severity         | Evidence                                                                                                                                                                                                                   | Resolution                                                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Medium           | The shared mobile menu did not respond to Escape.                                                                                                                                                                          | Escape now closes it and returns focus to its toggle. A Playwright regression test covers it.                                                |
| Medium           | The shared shell had no skip link.                                                                                                                                                                                         | Added a focus-visible link and focusable main target. Playwright checks Tab and Enter.                                                       |
| Medium           | The guide displayed behaviour reminder instructions even when the behaviour route was disabled. The owner confirmed those instructions should be hidden in that configuration.                                             | The entire reminder section now follows the feature flag; tests passed with the flag both off and on.                                        |
| Low              | At 320px, the two secondary home hero actions measured about 24px high.                                                                                                                                                    | Their interactive areas now have a 44px minimum height. Confirmation at 320, 390 and 1440 measured 48/44/44px across the three hero actions. |
| Test maintenance | Two existing browser tests expected an About-page action inside the main content and obsolete copied-prompt wording. The current action is in shared navigation and the current prompt begins with different instructions. | Updated the tests to exercise the actual mobile menu and check the current prompt while retaining their navigation and privacy assertions.   |

No document-level overflow was observed in the scanned pages or synthetic populated states. The home, guide and changed
shared styles were checked in one confirmation round at 320 and 1440, with measurements at 390 as well. Screen
dimensions alone do not prove every nested control is unclipped. Four representative palette combinations calculate to
contrast ratios of 12.33:1 (ink/paper), 8.31:1 (plum/paper), 8.96:1 (white/plum), and 6.20:1 (ink/rose); this is not an
exhaustive contrast audit, particularly over artwork and translucent surfaces.

## Copy and design

The reviewed public and exercise copy has a personal, reflective voice and clear descriptions of local storage. No
substantive text was changed: the feature-gated guidance is hidden only when its route is unavailable. No unsupported
claims or new proof were added. The full values-card dataset and every generated prompt variation were not individually
copy-edited.

The site keeps its existing plum, rose and paper palette, DM Sans headings, Source Serif 4 body copy and Source Sans 3
controls. `DESIGN.md` agrees with the implemented heading and body families. Shared shell and routes live in
`src/router.tsx`; editorial styles and tokens are in `src/styles/` and `src/cv/`. The earlier Graphify structural graph
mapped 1,068 nodes and 3,142 edges; CSS required direct source inspection.

## Verification and limitations

`pnpm check`, `pnpm build`, `pnpm format:check` and `pnpm validate:pages-artifact` passed. The default browser suite
excluding production-only PWA tests had 24 passes, one feature-disabled skip and one screenshot timeout during desktop
sorting; both sorting tests passed when rerun alone. The enabled guide and behaviour-reflection suite passed seven
tests. All four PWA tests passed separately against the production preview. The Impeccable detector returned no findings
for the changed page targets. Targeted flag tests passed in both configurations.

No physical-device testing, Safari/WebKit verification, exhaustive screen-reader testing, or exhaustive colour-contrast
scan was performed. The feature-enabled flow was exercised in Chromium using emulated viewport and input.

## Independent review and decisions

Independent standards and spec reviewers found no material defect or scope mismatch in the changes from the base commit.
The spec reviewer requested an explicit decision status; the behaviour-reminder decision is resolved as recorded above.
No other product decision was identified in this review. The testing limitations and unreviewed copy scope above remain.
