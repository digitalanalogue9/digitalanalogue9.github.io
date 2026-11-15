# 03: Implement the selected mobile home-page journey

**What to build:** Apply the owner's chosen mobile prototype so visitors can reach the personal and team values actions
near the top and explore the retained supporting sections in the selected way.

**Blocked by:** 01: Compare mobile home-page prototypes; 02: Preselect team-focused values from the team action.

**Status:** resolved

- [x] Implement the owner's selected navigation treatment and the agreed mobile heading, action and explanatory-copy
      hierarchy.
- [x] Retain the decision-scenario and reflection/storage sections, and use the tighter first-viewport top spacing
      without clipping content.
- [x] Both actions work end to end, including the team-focused setup selection; related links remain available.
- [x] Preserve the existing desktop composition and order, typefaces, visual identity and factual meaning, except for
      the corrected team action.
- [x] Reading order, keyboard focus and ordinary scrolling remain coherent on mobile and desktop; users can return to
      earlier content.
- [x] Use `impeccable`, `copywriting` and the relevant `react-vite-best-practices` guidance; perform the bounded visual
      review and run appropriate browser and project checks.
- [x] Report verification and any unresolved limitations. If implementation requires a material change to the agreed
      hierarchy or desktop scope, resolve it with the owner first.

## Comments

Implemented on `implement/mobile-homepage-journey` in commits `164f0f6` and `0d7cb68`. After dismissing the cookie
prompt, both sections fit at 375×667; at 320×568 the team section ends at approximately 645px. Body text and controls
remain readable. Targeted browser journeys, pnpm check, format check, production build, and Pages artifact validation
passed. One reflection journey failed once in a broader run and passed on isolated rerun.
