# Values Reflection Flow

Status: ready-for-agent

## Problem Statement

After choosing their core values, a person sees a page of optional reason text boxes and then a completed page that asks
them to do more reflection. The split interrupts the flow: the richer reflection arrives after the exercise already
appears complete, while the initial reason boxes duplicate its purpose. The completed page also hides
recurring-reflection setup behind an extra action, and its standard JSON export omits the person's reflection notes,
preventing a complete restore from that export.

## Solution

Offer one continuous journey: sort values, reflect on the selected values, then see the completed result. Replace the
existing reason text boxes with the current further-reflection experience, presented openly on the reflection page. All
answers are optional, and people can leave and return to a locally saved draft. Completing the exercise saves the
reflection and shows the selected core values and recurring-reflection setup, with a way back to edit the reflection.

Make the normal values-session JSON export a complete, importable backup of the saved session, including reflection
notes. Existing values backups remain importable. Keep the separate Putting Values into Practice feature and its feature
flag independent of this journey.

## User Stories

1. As a participant, I want to sort my values before reflecting, so that I can focus on the values I selected.
2. As a participant, I want to proceed from sorting to reflection, so that reflection is part of the exercise flow.
3. As a participant, I want the richer reflection prompts in place of the former reason text boxes, so that I have one
   coherent place to consider my values.
4. As a participant, I want to see the prompts for each selected value without expanding it, so that I can understand
   the full reflection at a glance.
5. As a participant, I want questions and possibilities appropriate to the exercise type, so that the prompts make sense
   for personal or team use.
6. As a participant, I want to record observations and practical actions for each value, so that I can connect my values
   to everyday choices.
7. As a participant, I want to respond to suggested possibilities, so that I can distinguish what I recognise, do not
   recognise, or am unsure about.
8. As a participant, I want to consider relationships between selected values, so that I can explore how they may
   complement or pull against one another.
9. As a participant, I want to record a session goal, so that I can identify something to work towards.
10. As a participant, I want to see a summary after the questions that updates with my answers, so that I can review my
    reflection in context.
11. As a participant, I want every reflection answer to be optional, so that I can complete the exercise without
    writing.
12. As a participant, I want my draft saved on this device while I reflect, so that leaving or refreshing does not
    discard my work.
13. As a participant, I want to return to an unfinished reflection, so that I can continue without completing the
    exercise first.
14. As a participant, I want to return to sorting and change my selected values, so that I can reconsider my choices.
15. As a participant, I want answers for values that remain selected to be retained after changing my selection, so that
    I do not have to repeat my work.
16. As a participant, I want answers for removed values excluded from the completed reflection, so that the result
    matches my final selection.
17. As a participant, I want one action to save my reflection and complete the exercise, so that I can move on without a
    separate save step.
18. As a participant, I want to remain on the reflection page with my entries if saving fails, so that I can retry.
19. As a participant, I want to see my core values on completion, so that I have a clear result.
20. As a participant, I want a Back to reflection action on completion, so that I can add or edit answers later.
21. As a participant returning to an older completed session, I want its saved reflection answers restored in the new
    editor, so that my previous work is preserved.
22. As a participant with previously saved reasons, I want those reasons retained with my values, so that the redesign
    does not erase or reinterpret them.
23. As a participant, I want recurring-reflection setup visible under its own heading on completion, so that I can find
    the next step without opening a separate panel.
24. As a participant, I want to choose Microsoft 365 Copilot, Claude Cowork or Codex, so that I see instructions for my
    preferred service.
25. As a participant, I want to choose which saved context to include in the recurring prompt, so that I control what I
    share with another service.
26. As a participant, I want to review the full prompt and copy it, so that I can inspect it before scheduling it
    elsewhere.
27. As a participant, I want the other completed-page actions to remain available, so that I can print, export, open
    History or replay my session.
28. As a participant, I want the standard JSON export to contain my saved reflection as well as my values and session,
    so that I can restore my work together.
29. As a participant, I want the same complete export from Completed and History, so that the backup does not depend on
    where I download it.
30. As a participant, I want existing backups to remain importable, so that this change does not strand earlier work.
31. As a participant importing a backup with an existing session ID, I want the existing local session preserved, so
    that importing does not silently overwrite it.
32. As a participant, I want clear wording that the JSON backup includes personal notes, so that I can handle the file
    appropriately.
33. As a participant, I want the separate Putting Values into Practice feature to retain its existing availability, so
    that changing this journey does not inadvertently enable or hide it.
34. As a keyboard or mobile user, I want the revised flow to remain usable with my device and assistive technology, so
    that I can complete and revisit my reflection.

## Implementation Decisions

- The exercise continues to lead to the existing reasoning step. Replace its optional reason editors with the current
  further-reflection content: per-value questions, possibility responses, observations and actions; applicable value
  relationships with their notes; and the optional session goal. Preserve the existing personal and team variants.
- Render each selected value's reflection content openly, without per-value expand and close controls. Place the
  generated reflection summary after the questions and update it as answers change.
- Use the approved **A — Guided journal** prototype as the layout direction: a single reading column, the session goal
  and applicable value relationships first, then each selected value's open reflection content, a live summary and the
  completion action. Preserve the site's existing responsive editorial design. The prototype is a visual reference, not
  production code or a specification of example content.
- Reflection is optional. One completion action saves the session and current reflection before showing Completed. A
  failed save must not navigate to a successful result or discard the person's entries; provide a clear error and retry.
- Persist unfinished reflection drafts on the device and restore them after navigation away, refresh or return to the
  session. A draft must not mark the exercise completed. Surface storage failures rather than suggesting a draft was
  saved when it was not.
- When selected values change, retain answers associated with values still selected. Exclude removed values and
  no-longer-applicable relationship answers from the completed reflection, without assigning them to other values.
  Preserve the session goal and other applicable answers.
- Previously completed sessions must load their existing reflection for editing. Preserve previously saved reason text
  and its existing display and recurring-prompt availability; do not transform it into another reflection field or
  provide the old reason editors for new sessions.
- Completed shows core values followed by a visible **Set up recurring reflection** heading, service selection,
  selected-service instructions and copy action. Keep optional context and full-prompt preview expandable; preserve
  explicit choice of optional context. The app produces a prompt for a separate service and does not schedule or send
  it.
- Keep completed-page actions, replacing the misleading **Edit final values** label with **Back to reflection**. That
  action opens the saved reflection, including for a person who originally skipped it.
- Standard values-session JSON exports from Completed and History include the complete saved session, including
  reflection notes. Remove the now-duplicate reflection-backup action from History. Retain import compatibility with
  earlier standard exports, reflection backups and supported legacy backups, including existing collision handling and
  input validation. Update export and privacy wording to accurately explain the included personal data. Preserve
  separately defined behaviour-reflection export privacy choices.
- Use the existing session, reflection, storage and backup boundaries where practical; extend their contracts and
  validation as needed for drafts and complete backups. Preserve saved data and compatibility through any storage or
  format evolution. Keep personal data on-device except when a person explicitly exports or copies it.
- The behaviour-reflection feature flag controls the separate Putting Values into Practice feature; it does not gate
  this values-exercise flow or its recurring-reflection setup. Preserve its current behaviour for both enabled and
  disabled builds.
- Preserve accessible labels, keyboard operation, responsive layouts, direct navigation, refresh and offline behaviour.
  Do not introduce a new dependency or change scheduling providers as part of this work.

## Testing Decisions

- Test observable behaviour through public interfaces, not component internals or implementation details. Cover failure
  and compatibility cases with independently meaningful assertions.
- **Browser journey seam:** extend the existing exercise-session journey to cover open reflection fields, optional
  completion, a saved draft after leaving and returning, selected-value changes, a failed save and retry, completed-page
  setup and returning to saved reflection. Check personal and team variants where their content differs, and use
  existing browser coverage as prior art.
- **Session service and backup seam:** extend existing reflection-backup and service tests to cover complete
  export/import, existing backup formats, collision behaviour, preserved legacy reasons, filtering removed values and
  invalid reflection references. Include unfinished-draft persistence and completion consistency at the appropriate
  existing service/storage boundary. Update prior tests that explicitly expect standard exports to omit reflection.
- Verify the completed experience with the separate behaviour-reflection feature flag enabled and disabled. Run
  repository-required checks, including the relevant browser journeys and production artifact validation.

## Out of Scope

- Redesigning or changing the availability, data model or exports of the separate Putting Values into Practice feature.
- Automatically scheduling or sending recurring reflections, adding services, or changing the external providers'
  products.
- Changing the core value-sorting rules or replacing previously saved reasons with new interpretations.
- Synchronising personal data between devices or adding server-side storage.

## Further Notes

- Prototype verdict: option A, **Guided journal**, was selected to answer how the reflection journey should be laid out.
  The full throwaway comparison is preserved on branch `prototype/values-reflection-flow` at commit `f536dad`; rewrite
  the selected design for production rather than promoting the prototype code.
- The word “reflection” in this spec refers to reflecting on selected core values in the values exercise. The glossary
  also defines a separate Reflection within Putting Values into Practice; the two flows must remain distinct.
- Older standard exports may legitimately have no reflection notes because those notes were not included when the file
  was created. Import should preserve what the file actually contains.
- Reflection notes and reasons can contain personal information. A complete JSON backup is a user-controlled file, and
  the interface should make its contents clear before export.
