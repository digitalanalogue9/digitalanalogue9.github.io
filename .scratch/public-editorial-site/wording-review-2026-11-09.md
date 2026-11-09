# Public editorial site wording review

Reviewed: 2026-11-09  
Source revision: `9e13456`  
Scope: the implemented public-editorial-site specification and its adjacent exercise-entry, History, backup, consent and results wording.

## Assessment

The public pages have a coherent, grounded voice. Keep the approved opening, borrowed-deck story, concrete sorting explanation, neutral sample prompt and labelled example outcome. The copy avoids unsupported completion times, prescribed result counts, clinical claims and team collaboration promises.

Diagnosis B: a real voice is present. This is a clarity and consistency pass, not a new positioning exercise. Recommendations below preserve the individual-first audience, personal origin and candid account of browser storage.

Applied copy-editing's seven sweeps, copywriting's evidence and leave-it-alone checks, and Impeccable's clarify guidance. Emotional intensity should remain restrained for this reflective tool; sales guarantees, urgency and extra proof sections would be inappropriate.

## Findings and proposed changes

### 1. Explain the consent choice that currently has no observable effect

Priority: medium. Source: [CookieBanner](../../src/components/common/CookieBanner/index.tsx:88).

“Functional preferences” gives no explanation of what the checkbox controls. Source references show that its consent value is stored, but no consumer changes preference storage or another feature in response. The banner also says exercises are saved either way. A visitor cannot make an informed choice and may infer that rejecting this option prevents local preferences being retained.

Recommendation: resolve what this option actually controls before writing a benefit or consequence for it. If it has no optional function, remove the ineffective choice in a separate consent change. Keep the factual explanation: “Your exercises and preferences are saved in this browser. Optional Google Analytics stays off until you allow it.” Do not claim that the checkbox controls storage without a verified implementation.

This needs a behaviour decision, not a cosmetic relabelling. Preserve the existing consent contract until that decision is made.

### 2. Replace implementation jargon at the backup import field

Priority: medium. Source: [ImportSection](../../src/app/history/ImportSection.tsx:36).

Current placeholder: “Paste exported JSON envelope here”. “Envelope” is an implementation term, and the existing review baseline already recommended replacing it. The adjacent label and help also switch between session, scenario, reflection and attempt.

Proposed placeholder: “Paste the contents of your backup file here”.

Proposed label: “Backup file contents (JSON)”.

Proposed help: “Paste a values exercise backup or a behaviour reflection backup. Restoring a behaviour reflection backup with an existing ID replaces that saved reflection and may replace newer work.”

Retain the separate warning that a values backup with an existing Session ID creates a copy. Continue accepting behaviour backups in default-disabled builds; the import guidance must still explain them.

### 3. Correct the sequence described on exercise setup

Priority: medium. Source: [ExerciseSetup](../../src/app/exercise-flow/ExerciseSetup.tsx:49).

Current: “Sort value cards by importance, then choose how many values you would like to finish with.”

The participant chooses the target on this screen before sorting. The sentence reverses the actual journey.

Proposed: “Choose a value set and how many values you’d like to finish with. Then sort the cards by importance.”

Keep “Start exercise” for the explicit action that creates the saved exercise.

### 4. Match backup guidance to the visible export controls

Priority: medium. Sources: [HelpPage](../../src/personal/HelpPage.tsx:158), [Privacy](../../src/app/privacy/page.tsx:49), [SessionListItem](../../src/app/history/SessionListItem.tsx:86), [completed reflection guidance](../../src/app/completed/CompletedClient.tsx:333).

The help and privacy pages explain that the “standard values JSON export” omits additional reflection notes, but the actual button is simply “Export”. A visitor choosing among Export, Export legacy backup and Export reflection backup has to infer which warning applies. The completed-page guidance states the omission without directing the visitor to the option that includes the notes.

Proposed help/privacy wording: “In History, Export saves your values exercise without the additional notes from the completed exercise page. Choose Export reflection backup to include those notes.”

Proposed completed-page addition: “To back up these notes, choose Export reflection backup in History.” Link History where practical. Preserve the existing explicit-save and unsaved-changes messages; this addition must not imply that unsaved edits are exported.

### 5. Use one public name for the existing secondary exercise

Priority: low. Sources: [Home invitation](../../src/app/HomeClient.tsx:191), [behaviour entry](../../src/app/behaviour/BehaviourReflectionClient.tsx:183), [page title](../../src/app/behaviour/page.tsx:8), [results](../../src/app/behaviour/BehaviourReflectionResults.tsx), and [History](../../src/app/history/HistoryClient.tsx:463).

The public invitation says “behaviour reflection”, but the destination says “Scenario reflection”, its start action says “Begin scenarios”, and History uses “Scenario reflections”. The help describes “situations”. This makes one flow sound like several activities.

For this specification, use “Behaviour reflection” for its page heading, title and History section; “Start reflection” for entry; and “Your reflections” for the results heading. Use “situation” for each item. Keep the helpful “Finish and see perspectives” action and the qualification that perspectives are possibilities.

Do not rename routes, stored formats or catalogue content. The later glossary's proposed “Putting Values into Practice” feature is a separate scope; this review does not apply that future name to the existing exercise.

### 6. Make the practical guide independent of its images

Priority: low. Source: [HelpPage](../../src/personal/HelpPage.tsx:134).

The prose asks readers to choose an “importance category” but does not list the available categories. The specification calls for practical category guidance, and the illustrations should supplement that explanation.

Proposed first sentence: “Place each card in Very Important, Quite Important, Important, Of Some Importance or Not Important.” Follow with the existing explanation that cards can be moved and that Not Important values are removed when advancing.

Keep the exact product labels and the existing image alternative text. This also helps readers when the images fail to load.

## Optional editorial refinements

These are minor clarity improvements, not release blockers.

| Location | Current | Suggested | Reason |
| --- | --- | --- | --- |
| Home example outcome | “This is an illustrative selection, not a prescribed final count. You choose how many values to keep.” | “These example values show what a final set can look like. You choose how many values to keep.” | Uses ordinary language and explains the example directly. |
| How it works, example introduction | “These composed views use sample values to show what each stage looks like.” | “These examples show each stage using sample values.” | Removes production terminology. |
| Home closing | “Your reflections stay in this browser.” | “Your reflections stay in this browser and don’t sync automatically. Use History to export a backup.” | Gives the storage consequence and next action beside the closing invitation. |
| Setup secondary action | “View history” | “View History” | Matches the named destination across public pages. |

## Copy to retain

- Home's approved headline and current concrete lede. The lede explains the method more clearly than a generic personal-development promise.
- “Find my core values” and “See how it works”. Their destinations and hierarchy are clear.
- “It started with a borrowed deck of cards.” and the personal About narrative. This is the strongest evidence of a human reason for making the tool.
- The explicit individual nature of the team-focused set and the absence of combined team results.
- The sample's unsaved-state notice and the identical neutral prompt after either selection.
- “Example outcome” and the illustrative Learning note. They clearly distinguish sample content from private saved work or testimonials.
- Privacy's precise separation of local data, downloaded files and optional analytics, including the limits of consent withdrawal.
- Contact's invitation, direct email link and lack of a response-time promise. Repeating the invitation in the following sentence is harmless; trimming it is a taste choice.
- Public navigation and the five pages' current titles and descriptions. No material wording issue found in the current metadata sources.

## Coverage and limits

Reviewed Home, About, How it works, Privacy, Contact, active shared navigation/footer, route metadata, sample states, setup, instruction text, consent, History/import/export guidance, completed-exercise notes guidance, and opt-in behaviour entry/results wording. Checked product claims against the approved specification and `docs/product-marketing.md`, and terminology against the current glossary while keeping the proposed later feature separate.

This is a source-based wording review. It does not establish desktop/mobile line fit, zoom behaviour, screen-reader announcements or runtime consent behaviour. No application code changed and no tests or new browser audit ran. Preserve the earlier implementation verification as historical evidence; check changed copy in context if these recommendations are implemented.

The existing `copy-review.md` remains the historical implementation baseline. This dated review records remaining issues rather than replacing that baseline or changing the specification.
