# Putting Values into Practice

Status: needs-triage
Design: Confirmed by the owner on 2026-11-08 after the grill-with-docs interview.
Scope of this document: Accepted product direction for rebuilding the existing behaviour reflection feature, with the subsequently accepted content structure and optional value-guided suggestions. The 48-situation content library is drafted; editorial review and implementation planning remain follow-up work.

## Purpose

Help individuals explore how their values show up in everyday choices, what matters to them when responding, and how their actions might affect others. The experience is reflective and tentative. It does not diagnose personality, assign trait scores or grade the person's values alignment.

The public feature name is **Putting Values into Practice**. This replaces the current behaviour-reflection positioning for the proposed experience. Core Values remains the product name.

See the [supporting notes on values, traits, behaviour and impact](source-notes.md#distinguishing-values-traits-behaviour-and-impact) for the conceptual distinctions behind this purpose. The supporting notes preserve useful examples from the owner's ChatGPT inputs; the agreed requirements are recorded in this specification.

## Starting point and reason for change

The existing feature uses six fixed workplace situations. Prepared responses lead to predefined possible intentions, perceptions and reflection questions. It already supports optional notes, connections to completed values exercises, browser-local storage and backup/restore.

The owner wants a larger selection of situations across everyday life, with work as one context. The redesign centres the person's explanation of their motivation and their judgement about values, while supporting tentative reflection on repeated responses.

Relevant current sources:

- [Situation content and response model](../../src/lib/domain/behaviourScenarios.ts).
- [Reflection service and value connections](../../src/lib/services/behaviourAttemptService.ts).
- [Browser-local persistence](../../src/lib/services/serviceSingleton.ts).
- [Backup and restore](../../src/lib/services/behaviourScenarioResults.ts).
- [Current About page and Further perspectives](../../src/personal/AboutPage.tsx).
- [Domain vocabulary](../../GLOSSARY.md).

This design intentionally changes the six-situation workplace proposition described in the earlier [public editorial site specification](../public-editorial-site/spec.md) and [marketing context](../../docs/product-marketing.md). Implementation should update the affected public descriptions together with the new experience.

## Agreed design tree

- Purpose: explore the relationship between values and everyday choices.
  - Audience: individuals across everyday life; work is one life context.
  - Claim: tentative reflection grounded in what the person reports.
  - Name: Putting Values into Practice.
- Entry: available independently of the values card sort.
  - Existing values: offer optional value-guided situation suggestions, and the person's saved values for optional connections after responding.
  - No completed sort: allow the person to name a value or continue without a connection.
- Exploration: a larger prepared situation library with an option to bring a personal situation.
  - Selection: choose one life context and two reflection areas, with four situations in total: two per area. Optional value-guided suggestions can help choose relevant content; the person can change them.
  - Response: prepared choices or a response in the person's own words; skipping is allowed.
  - Motivation: ask what mattered and what the person hoped to achieve.
  - Value connection: the person chooses it after reflecting on the response.
  - Experience: an optional real example, distinguished from a hypothetical answer.
- Deeper reflection: follows several situations.
  - Recurrence: at least two distinct situations support a possible recurring theme.
  - Overuse: invite consideration of when a useful strength could become counterproductive.
  - Perspective: invite consideration of how an action might land with others.
  - Feedback: optionally consider feedback the person actually received.
  - Next step: the person chooses a small action to try, with optional examples.
- Summary: concerns the current reflection only.
  - With recurrence: tentative themes with a clear connection to supporting responses.
  - Without recurrence: reflect back what was explored and invite further situations.
  - Persistence: browser-local saving and the existing backup/restore approach.

## Intended journey

1. Explain the purpose and allow entry whether or not a values exercise has been completed.
2. Let the person choose a life context: work and study, home and shared responsibilities, friends and close relationships, or community and groups. Guide them towards four situations across two reflection areas, with opportunities to skip situations or bring their own. When saved values are available, offer to use curated value links to suggest relevant content, explain why and allow changes. Otherwise use ordinary context-and-area selection. Preserve the same session structure through either route.
3. For each situation, offer prepared responses and a way to describe a different response. Ask what mattered to the person and what they hoped to achieve. Examples may help them answer, but a selected response must not automatically determine their motivation.
4. Invite an optional connection to a value after the response. Offer saved values when available, a way to name a value, and a valid no-connection option. The person judges whether the response feels aligned with the value, in tension with it or uncertain; the feature does not grade that relationship.
5. Allow an optional short real example. Preserve the distinction between what the person thinks they would do and what they report actually doing.
6. After several situations, invite deeper reflection on possible recurring themes, strengths that could become counterproductive, and how actions might be experienced by others. Optional examples support the person's thinking. These prompts must leave room for an interpretation not to fit.
7. Offer a tentative summary where supported, and invite the person to choose a small action to try. They can save their reflection and return later.

The full set of deeper reflection questions should not be repeated after every situation. Each situation focuses on the response, motivation and optional value connection or example; the later reflection brings the wider lenses together.

The default session has eight situation prompts (response and motivation for each of four situations) and three later reflection prompts. Value links and real examples are optional additions. Allow an early finish or a later two-situation extension without forcing a recurring theme. The [accepted content plan](content-plan.md) gives the full pacing and selection rules.

The supporting notes contain a [worked situation and prompt ideas](source-notes.md#worked-situation-and-reflection-prompts), a [same-action/different-motivation example](source-notes.md#same-action-different-motivations) and [everyday-life content seeds](source-notes.md#content-seeds-across-everyday-life) for developing this journey.

## Summary and evidence rules

- Describe a recurring theme only when a similar theme appears across at least two distinct situations in the same reflection. This is a product threshold for a tentative prompt, not evidence of scientific validation.
- Keep summaries within that reflection. Answers from separate saved reflections must not be combined into a stable personal pattern in this version.
- Make the supporting responses understandable to the person. Distinguish hypothetical choices from reported real experience.
- When there is insufficient recurrence, reflect back what the person explored, explain that there is not enough to suggest a recurring theme, and invite further situations.
- Use tentative language and reflection questions. Do not produce numerical trait scores, personality labels or automatic values-alignment grades.
- Ask the person to explain their motivation. A chosen action alone does not establish why they chose it.
- Keep imagined outside perspectives distinct from received feedback. A possible negative impression must not be represented as another person's actual view.
- Allow the person to decide what feels relevant and choose their own next action. Examples are optional starting points.

See the [illustrative taking-responsibility summary](source-notes.md#illustrative-summary-taking-responsibility) for a possible content structure. It illustrates tentative wording and optional actions; it does not define a theme-recognition algorithm.

## Influences and attribution

Use David Dotlich and Peter Cairo's *Why CEOs Fail* as inspiration for the question of when a useful strength becomes counterproductive. Use Jill Geisler's *Work Happy* and the evil-twin idea as inspiration for the gap between intended helpfulness and how an action might be experienced.

The frameworks remain in the design background during the exercise. The feature should not classify people against a derailer framework. Leadership Span is excluded from this design.

Add the two works to the About page's existing **Further perspectives** list, retaining its approach to attribution and endorsement. Verify the source titles, author details and destination links when preparing the public references.

Useful material from the owner's three ChatGPT conversation notes is preserved in [supporting notes](source-notes.md), including [provenance](source-notes.md#provenance-and-source-status), [Dotlich's lens and the Leadership Span distinction](source-notes.md#dotlich-when-useful-strengths-become-counterproductive), [Geisler's lens and illustrative examples](source-notes.md#geisler-helpful-intentions-and-an-unintended-impression), and [reference leads](source-notes.md#reference-leads-preserved-from-the-inputs). These are design inputs, not independently verified research evidence.

## Saving and returning

Save personal examples with the reflection so the person can return to them. Follow the existing browser-local storage and backup/restore approach for responses and notes. Include the new reflection data in that flow and keep the scope of each summary tied to its own reflection.

## Acceptance of the product direction

- A person can use the feature without completing a values card sort.
- A larger situation library supports everyday life contexts, with work as one context; the experience is not restricted to the existing six situations.
- People can choose prepared responses, describe their own response, skip situations and optionally bring a personal situation.
- Motivation comes from the person's account. Value connections and judgements about alignment are theirs to make.
- Real examples are optional and remain distinguishable from hypothetical answers.
- Deeper reflection follows several situations and incorporates overuse and possible outside perspectives as invitations to consider.
- A theme requires support across at least two distinct situations in the same reflection; a summary also works when no recurring theme is supported.
- Received feedback remains distinguishable from hypothetical outside perspectives.
- The person can choose a small action to try and return to their saved reflection.
- The feature is presented as Putting Values into Practice, with corresponding changes to descriptions of the old behaviour reflection.
- The About page references Dotlich and Cairo's work and Geisler's work; Leadership Span is not incorporated.

## Follow-up planning

The interview settled the product direction. The following details need content design or implementation planning before this is ready for autonomous implementation:

- Review the [48-situation JSON library](content-library/library.json), response choices, optional examples and curated value links. The owner accepted four contexts, six areas, two situations per context/area and a four-situation default session after the original interview. The expanded content and mappings remain editorial drafts.
- Implement optional value-guided suggestions using curated source-set/value-ID links, with transparent reasons, editable suggestions and fallback when no match is available. Ranking and tie-breaking remain to be specified; relevance must not be used to score answers or infer motivation.
- Define how a recurring theme is recognised, including responses written in the person's own words, and how supporting answers appear in a summary. No AI service, scoring algorithm or automated free-text interpretation was selected in the interview.
- Specify how bringing a personal situation enters the flow and how it contributes to reflection and any recurring theme.
- Plan storage/version changes, backup compatibility and treatment of existing saved six-situation reflections.
- Plan the UI and wording changes across the feature, its entry points, help and privacy information, marketing context and About references.
- Turn the design into implementation tickets using the local issue tracker conventions.

Use the [supporting content examples](source-notes.md#content-seeds-across-everyday-life) when authoring the library, while observing the [input suggestions superseded or left open](source-notes.md#input-suggestions-superseded-or-left-open). Suggestions in the original conversations must not silently override the confirmed design.

These follow-up details should preserve the agreed direction above. No application implementation was authorised by this design-documentation step.

### Accepted content plan and authoring format

The owner accepted the subsequent [content plan](content-plan.md): four situations across two reflection areas within one chosen life context, drawn from 48 situations across four contexts and six areas. The owner then accepted optional value-guided suggestions when saved values are available, while retaining ordinary selection for people without a completed values exercise.

The [library format guide](content-library/README.md) describes the authoritative JSON, schema, source-set/value-ID references and generated review documents. The [reading copy](content-library/review.md) contains all 48 drafted situations. The [original example session](content-library/relationships-pilot.md) remains available as a four-situation sequence, and the [coverage report](content-library/value-coverage.md) identifies values without curated links.
