# Desktop and mobile review

Status: in progress Base: `9e3c9e501e25134979f5512fe8363163cb9b39c6` (local main)

## Scope and method

Chromium via Playwright MCP, at 320, 390, 768 and 1440 CSS pixels wide, 800–900 high. Navigated `/`, `/howtouse`,
`/about`, `/contact`, `/privacy`, `/history`, `/exercise`, `/replay`, `/completed`, `/reasoning` and a missing route.
Checked document overflow on each, and captured desktop and 320px full-page views of home, guide, about, contact,
history and exercise setup. Inspected home, guide and setup captures. Tested cookie rejection, exercise setup, opening
instructions, placing a card, opening a mobile category review, navigation, keyboard Escape and skip link. Direct
completed and reasoning routes were visited without completed session data; replay and history were visited in empty
states. These visits are not coverage of populated states.

Graphify structural extraction of `src` produced 1,068 nodes and 3,142 edges; CSS was unclassified, so the route and
style mapping was checked against source. `src/router.tsx` owns the shell and routes; `src/styles/editorial.css`,
`src/styles/globals.css`, `src/cv/` and feature styles define shared and feature treatments. The design uses plum, rose
and paper surfaces, DM Sans headings, Source Serif 4 body text and Source Sans 3 interface text. The documented fonts
agree with the implementation; `PRODUCT.md` contains no conflicting typography claim.

## Findings

| Severity | Finding and evidence                                                                                                                                                                                                              | Resolution                                                                                                                                    |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Medium   | On a 320px viewport, Escape left the open navigation expanded and focus inside it. `src/router.tsx`.                                                                                                                              | Escape closes the menu and returns focus to its toggle. Confirmed at 390px with Playwright; regression test added.                            |
| Medium   | Shared shell had no skip link, requiring keyboard users to traverse the navigation on every page. `src/router.tsx`, `src/styles/editorial.css`.                                                                                   | Added a visible-on-focus skip link and a focusable main target. Playwright confirmed Tab and Enter move focus to main; regression test added. |
| Decision | The guide shows instructions for a behaviour reflection reminder even with the behaviour route disabled; its existing test explicitly expects the section to remain visible when the link is absent. `src/personal/HelpPage.tsx`. | Left unchanged pending owner intent: are these instructions meant to be visible before the feature is enabled?                                |

No document-level horizontal overflow was detected on the visited routes at the four widths. This does not establish
that individual controls, text, or all states are free of clipping. The 320px instruction overlay was visible and
operable at 800px height; shorter screens and real touch gestures were not verified.

## Copy

The public copy uses an informal, reflective voice and concrete instructions. No substantive wording changes were made:
no reviewed passage warranted a meaning-changing rewrite. The guide's feature-flag question above is a content
availability decision, not evidence for changing a factual claim.

## Limitations and outstanding work

This is a partial review, not a complete audit of every layout and state. Populated history, completed results,
reflection, replay, errors, data import/export, consent customisation, reduced motion, contrast measurements,
synthesized touch and real-device/Safari behavior remain to be examined. The behaviour feature was disabled in the
running configuration. The full copy corpus and all screenshots were not individually reviewed. These gaps limit the
findings and require further work before calling the requested review complete.

## Verification

`pnpm check` passed (typecheck, lint and unit tests); `pnpm build` passed. The home navigation Playwright file passed
all four tests; the guide, routing and first-run selection passed 13 tests. The broader exercise, sorting, reflection
and functional-pages selection had one failure: `functional-pages.spec.ts:126` expects the copied Agent prompt to
include `Create a recurring reflection`, but the clipboard contains a different prompt. Retrying the failure reproduced
it. Neither the test nor prompt implementation was changed in this work; its intended wording needs investigation. The
failure prevented the remainder of that test from running.

Playwright MCP confirmed the new skip link focuses `main-content` and Escape closes the menu and restores focus. A
further confirmation pass across all affected layouts and the independent code review remain outstanding.
