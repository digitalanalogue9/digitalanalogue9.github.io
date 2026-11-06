# 02: Launch the editorial home page and public navigation

**What to build:** First-time visitors encounter a distinctive editorial introduction showing what values sorting is, what an example outcome looks like and how to begin. Returning visitors can still reach History easily. Establish the public-page visual language through this complete home journey.

**Blocked by:** 01 — Restore reliable entry and separate exercise setup.

**Status:** ready-for-agent

Parent specification: [Public editorial site](../spec.md), especially Direction, Editorial visual system and Home composition.

- [x] Lead with “Some things matter more. Which things matter to you?” and the reviewed supporting copy in the Reviewed wording requirements below, “Find my core values” and “See how it works”. The primary action reaches existing exercise setup without creating a Session; the secondary reaches the existing help route.
- [x] The initial viewport includes a legible composition of actual catalogue value cards. Replace the exercise-menu opening and enclosing-panel composition with open editorial sections and clear hierarchy.
- [x] Include a labelled “Example outcome” using catalogue values and an illustrative note, relevant situations for reflection, “Sort. Narrow. Reflect.” explanation, secondary behaviour-reflection invitation and closing exercise invitation with accurate storage reassurance.
- [x] Use “See your choices from another angle” for behaviour reflection and explain that the six situations offer possibilities rather than other people's actual opinions. Keep its route working and secondary to values sorting.
- [x] Preserve the Core Values identity and Plum & Rose roles. Self-host Source Serif 4 for editorial display headings with its licence and readable fallback; retain Inter for body and controls. Keep generated tokens untouched and exercise surfaces unaffected by editorial styling.
- [x] Use fluid display typography, a spacious desktop text/product composition and a coherent mobile single column. Reuse approved SVG filenames and frame sections sparingly rather than repeating artwork behind nested panels.
- [x] Public navigation prioritises How it works, About, History and the exercise action. The brand links Home; Privacy and Contact remain persistent footer links, and Privacy remains reachable from consent controls. Existing routes remain unchanged.
- [x] Preserve existing social-share destinations and consent/PWA features. Returning visitors have clear History or resume access, without private values or notes appearing in promotional imagery.
- [x] Product illustrations contain synthetic, labelled content only. No invented duration, guaranteed result count, testimonial, professional endorsement, collaboration, price or medical/psychological claim is introduced.
- [x] Update Home title, description, canonical/social metadata and relevant shared metadata while preserving the existing domain and static-host route behaviour.
- [x] Visible content and actions survive font/image failure and reduced motion. Use at most one restrained card/narrowing motion treatment; avoid heavy animation dependencies and autoplay content.
- [x] Cover public navigation, primary/secondary actions, returning-user access, direct Home refresh and metadata through existing test boundaries. Review 1440px desktop, 390px mobile, 320px overflow, keyboard focus and pending-consent states; principal controls meet the specification's contrast and target-size requirements.
- [x] Relevant checks pass and the slice is demoable independently. Do not add a disabled sample placeholder: ticket 03 inserts the functional optional sample later.

## Reviewed wording requirements

Use the complete [Home draft](../copy-review.md#proposed-home-copy), [shared wording](../copy-review.md#shared-wording-and-adjacent-application-text) and [metadata](../copy-review.md#proposed-metadata), informed by [product marketing context](../../../docs/product-marketing.md). The recommended draft supersedes the specification's starting-point supporting copy; retain its functional and visual requirements. Alternative headlines and CTAs are not implementation instructions.

- [x] Opening heading: “Some things matter more. Which things matter to you?” Supporting copy: “Sort value cards to explore your priorities. Narrow your choices, then reflect on what your final set means to you.” Actions: “Find my core values” and “See how it works”. Returning-user link: “Resume an exercise in History”.
- [x] Use Learning, Independence and Helping others for the labelled Example outcome, with catalogue descriptions unchanged. Label the note “Illustrative note for Learning” and use “I want room to learn in whatever I do next.” State that the selection is an example and the visitor chooses their final count.
- [x] Use the reviewed situations section, “When a decision pulls you in different directions”, and the complete Sort/Narrow/Reflect descriptions. Describe possible uses, not attributed customer experiences or guaranteed outcomes.
- [x] Use the reviewed secondary behaviour invitation and closing section. Replace “What do others see that I don’t?” with “See your choices from another angle”; explicitly describe possible perspectives rather than knowledge of other people's thoughts.
- [x] Use warm, confident, natural British English. Explain reader benefits through the actual card sort and revisitable choices; avoid corporate phrasing, hype, clichés, formulaic marketing language and invented claims.
- [x] Implement the reviewed Home title and description, with matching social descriptions. Keep canonical URLs and existing share destinations.

## Comments

- This ticket establishes the reusable public-page composition used by tickets 04–06. It does not redesign the exercise board, History, results or replay.

- 2026-11-06 owner instruction: **Application editing is paused pending owner review of proposed wording.** Read [the copy review and proposal](../copy-review.md) before resuming. Use the reviewed Home copy, shared navigation and metadata from the proposal. Preserve the agreed visual direction and the existing no-premature-Session contract.


- 2026-11-06 follow-up: the owner reviewed the copy proposal, requested these wording requirements in the existing tickets, and authorised implement-spec to continue after the updates. This supersedes the earlier wording-review pause. Use the recommended draft in copy-review.md; alternative headlines and CTAs are not selected.

### Resolution evidence

- TDD red: the browser test failed on the former Home because the approved “Some things matter more. Which things matter to you?” heading was absent.
- TDD green: `pnpm exec playwright test --config playwright.editorial.config.ts tests/e2e/home-editorial.spec.ts tests/e2e/app-routing.spec.ts tests/e2e/exercise-session.spec.ts --grep "home introduces|visitor can reach|home and direct exercise|Analytics makes no network"` — 4 passed in 14.8s.
- `pnpm test -- tests/personal-content.test.tsx tests/personal-metadata-artifact.test.ts` — 2 files, 8 tests passed.
- `pnpm typecheck` — passed. `pnpm lint` — passed with 3 existing unused `testValue` warnings in `tests/components/Card.test.tsx`. `pnpm build` — passed.
- `impeccable.cmd detect --json src/app/HomeClient.tsx src/router.tsx src/styles/editorial.css src/styles.css` — `[]`.
- Reviewed desktop 1440px, mobile 390px, 320px, pending-consent, and keyboard-focus captures. At widths 390 and 320, document/body widths were 375 and 305 pixels; the first keyboard focus had a visible solid 3px outline. Captures: `C:\dev\agent-notes\editorial-02\`.
