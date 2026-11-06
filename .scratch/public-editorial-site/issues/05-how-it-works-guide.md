# 05: Explain the exercise through How it works

**What to build:** Visitors can quickly see the sorting, narrowing and reflection process, then read accurate practical guidance before entering the existing exercise. Returning participants retain their saved instruction preference.

**Blocked by:** 02 — Launch the editorial home page and public navigation.

**Status:** ready-for-agent

Parent specification: [Public editorial site](../spec.md), especially How it works and Testing Decisions.

- [ ] Use “How it works” in the page and public navigation while preserving the existing help URL and direct-refresh behaviour.
- [ ] Lead with “Sort. Narrow. Reflect.” and three accurate product views showing value placement, narrowing through rounds and a final set with optional notes.
- [ ] Capture or compose views from the current application using synthetic example data, never saved user content. Supply concise captions, meaningful alternatives, intrinsic dimensions and lazy loading below the fold.
- [ ] Match real controls and current behaviour rather than inventing a different sorting interaction. Explain personal/team-focused sets, configurable target count, importance categories, rounds and removal of Not Important values when advancing.
- [ ] Preserve guidance about locally saved progress, optional notes, History, resume/review, replay and supported backups. Do not imply automatic cross-device syncing.
- [ ] Explicitly explain that the team-focused option is an individual exercise supporting later conversation, not a shared Session or group result.
- [ ] Preserve the instruction-preference control, its existing stored choice and its effect when starting the exercise. Do not replace or reset the preference as part of the visual redesign.
- [ ] Give behaviour reflection its own clearly distinguished explanation, retaining the six-situation description and possible-perspectives limitation.
- [ ] Provide working exercise and History actions, appropriate Read-mode hierarchy and updated title/description/social metadata. Ensure long captions and instructions remain legible without repeated decorative panels.
- [ ] Extend existing instruction-preference, content and browser-route tests to cover persistence, navigation and direct refresh. Assert behaviours and working destinations instead of image pixels or markup structure.
- [ ] Verify mobile image scaling, readable body measure, keyboard focus, image failure and 320px overflow. Relevant checks pass.

## Comments

- The completed slice is a working public guide with honest visuals and preserved instructions, not a standalone asset-production task.
