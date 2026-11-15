# 02: Preselect team-focused values from the team action

**What to build:** When a visitor starts a team values conversation from the home page, open exercise setup with
Team-focused values selected and let the visitor start an exercise using the team-focused cards.

**Blocked by:** 01: Compare mobile home-page prototypes. This preserves the owner's requested prototype-first sequence.

**Status:** resolved

- [x] The team action opens setup with Team-focused values selected, and the visitor can switch sets before starting.
- [x] Starting with Team-focused values creates a Session using the team-focused card set; opening setup alone creates
      no Session.
- [x] The personal action and a direct setup visit continue to default to Personal values.
- [x] Saved-session and resume navigation continue to open the intended Session without being overridden by the new
      default.
- [x] Browser-level tests cover the entry points, switching, team Session creation, direct setup and saved-session
      navigation.
- [x] Apply the relevant `react-vite-best-practices` guidance and run appropriate checks.

## Comments

Implemented in commit `921c545` on `implement/mobile-homepage-journey`. Three browser journeys, pnpm check and
format:check passed.
