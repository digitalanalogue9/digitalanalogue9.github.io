# Content library and session recommendation

Status: Accepted by the owner, 2026-11-08. Optional value-guided suggestions were also accepted in the subsequent discussion.

This records the numbers and selection rules accepted after the [original design interview](spec.md). The structure is an agreed product decision. Completion times remain design targets rather than measured findings or evidence of assessment validity.

## Recommended normal session

| Element | Recommendation | Reason |
| --- | --- | --- |
| Life context | One chosen context per sitting | Keeps situations relevant without asking the person to switch between unrelated roles. |
| Reflection areas | Two areas within that context | Gives useful breadth while allowing each area to be explored twice. |
| Situations | Four: two per area | Offers opportunities to notice similarities and differences across situations. |
| Prompts within each situation | Two: response, then motivation | Keeps the essential work clear. |
| Optional additions | Value connection and a real example | Adds depth without requiring more writing on every card. |
| Deeper reflection | Three prompts after the situations | Explores useful strengths and possible costs, outside perspectives, and an action to try. |
| Time | Aim for roughly 10–15 minutes | An initial design target to check with users; writing examples may take longer. |

This means **four situations, eight short situation prompts and three later reflection prompts: eleven core invitations in total**. Optional fields add further work if the person chooses them. Public wording should explain the four situations and later reflection rather than disguising the full exercise as “only four questions”. Do not promise a completion time before checking it with users.

Offer four as the default selection. Let the person finish early with a reflection on what they have explored, save and return, or choose two more situations after the initial summary. An extension can introduce a third area as a further pair. Finishing early must not force a recurring-theme result.

## Contexts and reflection areas

Keep the life context separate from the kind of choice being explored. A context answers “where does this happen?”; an area answers “what sort of situation am I thinking about?” These areas organise content and do not label the person.

Suggested life contexts:

1. Work and study.
2. Home and shared responsibilities.
3. Friends and close relationships.
4. Community and groups.

Suggested reflection areas:

| Area | Everyday choices to explore | Possible later reflection |
| --- | --- | --- |
| Offering support | Listening, advising, helping directly, leaving room for another person's choices | When is help welcome, and when might it feel like taking over? |
| Sharing responsibility | Stepping in, agreeing ownership, relying on others, following through | When does reliability help, and when might one person carry too much? |
| Speaking openly | Raising concerns, disagreeing, choosing timing, expressing a different preference | How can honesty, care and group momentum pull in different directions? |
| Working to a standard | Quality, detail, completion, accepting another person's approach | When does care improve the outcome, and when might it delay or constrain others? |
| Making room for your needs | Availability, limits, competing commitments, asking for help | How can caring for others and protecting capacity both matter? |
| Responding to uncertainty | Acting with incomplete information, asking questions, adjusting plans | When do speed, caution and flexibility help or hinder? |

Areas deliberately overlap in real life. Give each authored situation a primary area for selection and review; optional secondary editorial tags may describe overlap. Neither area membership nor the option chosen is sufficient to infer a behavioural pattern.

## Recommended library size

Author **48 situations** for the initial complete library:

**4 life contexts × 6 reflection areas × 2 distinct situations = 48.**

Each context would contain twelve situations, organised into six pairs. A normal session draws two pairs, not all twelve situations. The larger library supports relevance and repeat use without increasing the default session length.

The owner reviewed the [four-situation example session](content-library/relationships-pilot.md) before expansion. The [complete JSON library](content-library/library.json) now contains all 48 situations and their curated value links. Use the [reading copy](content-library/review.md) for editorial review and the [format guide](content-library/README.md) for authoring. The expanded content and mappings remain draft material to review before publication.

Two situations in an area must test different circumstances. A wording change or another character in the same dilemma is not enough. For example, offering support can involve a person seeking advice in one situation and practical help with a shared activity in another.

## Selection: structured variation

Use a consistent four-situation structure with variation in which content appears:

1. The person chooses a life context.
2. Offer two suggested reflection areas within it, with a way to change the selection. A person may also ask the feature to choose areas for them. If saved values are available, offer an optional value-guided route that uses curated value links to suggest relevant areas and situations, explains their relevance and allows the person to change them.
3. Select the two authored situations belonging to each area. Order them A1, B1, A2, B2 so related situations are separated.
4. Preserve the selected situations and their order once the reflection starts. Resuming or restoring it should return to the same material.
5. When a situation is skipped, allow the person to continue without it. Do not secretly treat a skipped situation as evidence. A future library with additional alternatives can offer a replacement from the same area.

Variation should happen between reflections, not while someone is answering. Prefer areas not recently used where that history is available; otherwise vary the suggested pair of areas. Keep selection history separate from interpretation: the confirmed design excludes summaries that combine answers from separate reflections.

With one authored pair per area in the initial library, randomising individual situations inside an area adds little. The meaningful variation is the choice of area pairs. Expand the alternatives within an area when repeat use shows a need, rather than adding duplicates just to claim a larger question bank.

### Why not unrestricted random selection?

Four random situations could all explore the same kind of choice or provide one example in each of four areas. The first narrows the experience accidentally; the second gives less opportunity to examine repetition. A consistent pair structure makes the session's coverage deliberate.

Two situations in the same area do **not** automatically establish a recurring theme. The responses and motivations might differ. The agreed minimum of two distinct situations is a condition for considering a theme, not proof that a theme exists. Theme recognition, especially for written answers, remains a separate implementation decision.

### Should saved values determine selection?

When saved values are available, offer to use them to suggest relevant situations. This optional route was accepted after the original proposal. Use the curated links in the library, retain the four-situation/two-area structure, explain why suggestions are relevant and let the person change them.

Values guide topic relevance, not expected answers. The same value can influence different choices for different people. A suggested situation need not establish that any response aligns with the value; the person still makes that connection afterwards. Links belong to situations and do not score response options.

Without a completed values exercise, use the context-and-area route. A person may still name a value during reflection. If a saved or custom value has no curated match within the chosen context, explain the gap and offer ordinary selection. Do not silently infer relevance from the value's title. See the [coverage report](content-library/value-coverage.md) for current gaps.

## Shared prompts

Use the same basic structure across authored situations so the library does not require a new questionnaire for every card.

### Within each situation

1. **What would you most likely do?** Offer three plausible responses, “Something else”, and a way to skip. A personal situation can use a response in the person's own words.
2. **What would matter most to you in choosing that response?** An optional supporting line can ask what they hope it would achieve. Do not prefill a motivation from the chosen option.

Then offer two optional additions:

- **Does this connect with a value that matters to you?** Offer saved values or a value they name, alongside no connection. Invite their own judgement about alignment, tension or uncertainty.
- **Does a real example come to mind?** Invite a short account of what actually happened and keep it distinguishable from the hypothetical choice.

Keep optional writing visibly optional and allow the person to leave a prompt unanswered. The summary must reflect what is actually available.

### After the situations

1. **What could be helpful about your approach, and when might it become less helpful?** Give access to optional examples, leaving room for none to fit.
2. **How might another person experience your response?** If relevant, invite feedback the person actually received and distinguish it from an imagined possibility.
3. **Is there something small you would like to try?** Offer examples as starting points and let the person choose, change or leave the action open.

These are draft content prompts, not final screen layouts. A deeper question can refer back to relevant answers, but should remain useful when there is insufficient evidence of a recurring theme.

## Authoring rules

- Use ordinary situations where reasonable priorities compete. Avoid a clearly virtuous option beside two caricatures.
- Give enough context to make the choice meaningful, including time or relationship constraints where relevant. Do not assume the person is a manager, parent, partner, homeowner or member of a particular culture.
- Keep options similar in length and specificity. Vary the order and substance of options across the library so a position does not consistently signal the socially approved answer.
- Provide a way to describe a different response, add context or skip. Three prepared responses cannot cover every life experience.
- Separate situation text and choices from optional later reflection examples. Do not announce a possible negative interpretation before the person answers.
- Write possible constructive effects as carefully as possible costs. Another person's disagreement or preference is not automatically evidence that the user's approach is wrong.
- Use the [source notes](source-notes.md) to inspire situations and prompts without presenting illustrative examples as claims established by the books.
- Use the individual-first, practical and reflective voice in [marketing context v1](../../docs/product-marketing.md). The agreed feature positioning is proposed product direction, not a claim that this experience has already shipped.

## Content review

Review the four-situation example with people using the intended life context, then use the full reading copy for editorial review of the expanded library. Look at completion, skipped prompts, confusing choices, effort spent writing and whether participants can identify a useful takeaway. Ask whether both situations in an area feel genuinely different, and review each value-relevance reason against its source value.

Check the proposed 10–15 minute target and eleven-prompt burden through use. Adjust the default number or prompt wording if people rush, choose an obviously approved answer, or abandon reflection. These are proposed review activities, not findings from completed research.
