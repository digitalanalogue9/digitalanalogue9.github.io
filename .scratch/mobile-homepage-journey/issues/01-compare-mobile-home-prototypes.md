# 01: Compare mobile home-page prototypes

**What to build:** Create a runnable, throwaway comparison that lets the owner experience three mobile home-page
approaches and choose how, if at all, visitors should be guided between sections. Use the feature spec for the agreed
content hierarchy and preserve the existing visual identity.

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] Provide interactive options for ordinary scrolling without added navigation, a subtle cue that more content
      follows, and compact section navigation that supports returning to earlier sections.
- [x] Keep the agreed personal and team entry points, supporting sections and tighter first-viewport spacing comparable
      across the options.
- [x] Preserve normal scrolling and keyboard access; show representative mobile layouts without changing the production
      desktop composition.
- [x] Use `copywriting` for the proposed wording, `impeccable` for design and bounded visual verification, and the UI
      branch of `prototype` for the comparison. Explain substantive copy changes and design trade-offs.
- [x] Present the options and record the owner's explicit selection before resolving this ticket. Do not implement a
      final layout or treat elapsed time as a choice.

## Comments

Owner selected option 1, ordinary scrolling, on 2026-11-15. Prototype: branch `prototype/mobile-homepage-journey`,
commit `e3ecd1d`. The owner requested tighter mobile spacing, no divider between personal and team sections, and
blending the how-it-works and resume links into the personal explanation. Aim to show both sections in the first iPhone
SE viewport.
