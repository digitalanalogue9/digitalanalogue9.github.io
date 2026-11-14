# 01: Move reflection into the exercise flow

**What to build:** After sorting core values, the participant can reflect in a single guided-journal page, complete the
exercise and return to their saved reflection. Use approved prototype A as the visual direction, while retaining all
applicable reflection content and existing saved work.

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] Replace the optional reason text boxes with open reflection content for all selected values, including applicable
      questions, possibilities, observations and actions, value relationships and a session goal, with personal and team
      variants.
- [x] Follow the approved guided-journal order: session goal, applicable value relationships, each selected value's
      reflection, live summary and completion action. Keep per-value content open and the layout responsive and keyboard
      accessible.
- [x] All reflection answers are optional. Completing saves the session and reflection together; on failure, stay on the
      page with entries intact and offer retry.
- [x] Completed shows the core values and retains its existing actions. **Back to reflection** returns to saved answers,
      including for a previously completed session or a person who initially skipped reflection.
- [x] Preserve existing reason text with its completed values and as optional recurring-prompt context, without
      transforming it or reintroducing the old editors.
- [x] The separate behaviour-reflection feature flag does not change this journey. Verify the relevant browser journey
      and service behaviour, including both flag settings and existing completed-session compatibility.

**Prototype:** Option A, Guided journal, was selected. The throwaway comparison is preserved on branch
`prototype/values-reflection-flow` at commit `f536dad`; use it as a visual reference and implement the result afresh.
The full feature spec is the parent document for this ticket.
