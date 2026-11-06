# Issue tracker: Local Markdown

Issues and specs for this repo live as markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- Spec: `.scratch/<feature-slug>/spec.md`
- Implementation issues: one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`; don't combine tickets into one file.
- Record triage state in a `Status:` line near the top of the issue file (see `triage-labels.md` for role strings).
- Append comments and conversation history at the bottom under `## Comments`.

## When a skill says "publish to the issue tracker"

Create a file under `.scratch/<feature-slug>/`, creating the directory if needed.

## When a skill says "fetch the relevant ticket"

Read the referenced file. The user will normally provide its path or issue number.

## Wayfinding operations

Used by `/wayfinder`. The map is one file with one child file per ticket.

- **Map**: `.scratch/<effort>/map.md` (the Notes / Decisions-so-far / Fog body).
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records ticket type (`research`/`prototype`/`grilling`/`task`); `Status:` records `claimed`/`resolved`.
- **Blocking**: `Blocked by: NN, NN` line near the top. A ticket is unblocked when all listed files have `Status: resolved`.
- **Frontier**: scan `.scratch/<effort>/issues/` for open, unblocked, unclaimed files; the first by number wins.
- **Claim**: set `Status: claimed` and save before work.
- **Resolve**: append the answer under `## Answer`, set `Status: resolved`, then append a context pointer (gist + link) to `map.md` under Decisions-so-far.
