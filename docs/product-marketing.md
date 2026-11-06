# Product Marketing Context

**Document version:** v1  
**Last updated:** 2026-11-06  
**Review status:** Repository-derived draft for owner review.

Core Values helps individuals reflect on what matters to them through a values card sort. Individual reflection is the primary audience; coaching and team conversations are secondary uses.

## Evidence and Scope

This context covers the public site at [core-values.me](https://core-values.me), not a separate in-house product. It is saved in `docs/` at the owner's request. Skills that look only in `.agents/product-marketing.md` must be pointed to this file.

Sources, in order of authority for this draft:

- [Approved public-site specification](../.scratch/public-editorial-site/spec.md): audience, positioning, proposed public copy and claim boundaries. This describes an accepted direction; it does not establish that every proposed feature has shipped.
- [Product context](../PRODUCT.md): purpose, principles and brand commitments.
- Current [Home](../src/app/HomeClient.tsx), [About](../src/personal/AboutPage.tsx), [help](../src/personal/HelpPage.tsx), [Privacy](../src/app/privacy/page.tsx) and [Contact](../src/personal/ContactPage.tsx): product behaviour, origin story and existing language.
- [README](../README.md): historical background only where consistent with current sources. Its claims about full privacy, GDPR compliance, team cohesion and its older framework description are not evidence for public promises.

No customer interviews, conversion studies, testimonials or competitor research were supplied. Audience motivations, objections and switching forces below are working hypotheses. Approved copy is labelled separately from current copy and customer language.

## Product Overview

**One-liner:** Sort value cards, make choices between priorities, and reflect on the values that matter to you.

**What it does:** Participants choose a personal or team-focused value set and a target count, then sort values by importance over successive rounds. The resulting set supports reflection and optional notes. Sessions are saved in the browser and can be resumed or reviewed through History, replayed, and exported as backups.

A separate behaviour reflection presents six situations and possible intentions and perspectives. These prompts offer ways to consider a response; they do not establish what another person thinks.

**Product category:** Values clarification and self-guided reflection tool. This is a descriptive category, not validated search-demand research.

**Product type:** Browser-based application with local storage and PWA support.

**Business model:** A publicly shared tool. No paid offer, subscription, checkout or commercial team tier is established in the reviewed public journey. Pricing strategy and revenue goals are unconfirmed; avoid inventing an offer or promising perpetual free access.

## Target Audience

**Primary audience:** Individuals considering their own priorities, especially around a decision, change or next step.

**Secondary audience:** People using the exercise alongside a coach, and people preparing for a conversation about priorities at work. The team-focused set remains an individual exercise.

**Target companies:** No company size, industry or buying segment is established.

**Decision-makers:** The individual chooses to use the tool. A coach or facilitator may introduce it; no organisational procurement or buying committee is evidenced.

**Primary use case:** Turn a broad question about what matters into a set of choices that can be considered and revisited.

**Jobs to be done:**

- Identify and prioritise values when several good things compete.
- Put priorities into words before a decision or conversation.
- Revisit an earlier reflection as circumstances change.

**Use-case hypotheses:** Considering a career change, weighing a difficult choice, preparing for a coaching conversation, or reflecting before a team discussion. These are suggested contexts, not documented customer stories or outcome claims.

## Personas

A B2B buying-persona model is not applicable to the current positioning. Keep the individual participant central. Coaches and facilitators are secondary introducers, not evidence of a separate commercial product.

## Problems & Pain Points

**Core problem:** It can be difficult to name priorities and decide which matter most when they compete. This is the working problem framing; customer wording has not been collected.

**Why alternatives may fall short:** The creator had to return a borrowed card deck and wanted something to revisit. Broader claims about the shortcomings of other tools remain untested.

**Possible cost:** Unresolved trade-offs and repeated reflection without a record to revisit. No time, money or productivity cost has been measured.

**Emotional tension:** Possible uncertainty about a decision or changing priorities. Use a calm invitation rather than amplifying anxiety or presenting ordinary uncertainty as a diagnosis.

## Competitive Landscape

The following are categories to research, not validated competitor comparisons.

| Relationship | Alternative | What is known / what to validate |
|---|---|---|
| Direct | Other digital values card sorts | No named products or feature comparisons have been researched. |
| Secondary | Physical values decks and coach-led exercises | A borrowed deck prompted this tool's creation. A physical deck or coach may suit someone better; no superiority claim is established. |
| Indirect | Journalling, informal discussion or unaided reflection | These address reflection differently. Their effectiveness and switching barriers have not been investigated. |

## Differentiation

**Supported product characteristics:** A repeatable card-sorting process, a configurable final count, optional notes, browser-local saved work, History, replay and backup support. Personal and team-focused sets are available within the same individual flow.

**Approach:** Participants make their own importance choices and narrow a set over rounds. The tool provides structure for reflection rather than assigning a personality profile.

**Potential benefit:** A concrete record of chosen priorities to consider later or discuss with someone else. This is the intended benefit, not a guaranteed improvement in decisions or wellbeing.

**Why people choose it:** Not yet established through customer evidence. Describe capabilities accurately without claiming they are unique or preferred over alternatives.

## Objections

These are anticipated questions, not objections recorded in sales or support research.

| Anticipated question | Supported response |
|---|---|
| Will this tell me who I really am or what decision to make? | It offers a structured reflection on your choices. It does not diagnose you or make a decision for you. |
| Who can see my answers, and can I move devices? | Exercise answers and notes stay in this browser. They do not sync automatically. Export a backup before clearing browser data or moving work; keep that file private. Optional Google Analytics loads only after consent. |
| Can my whole team use one shared exercise? | The team-focused set is an individual exercise that can support a later conversation. Shared Sessions and collective results are not available. |

**Poor fit:** Someone seeking a clinical assessment, a prescribed answer, automatic account syncing, or a collaborative workspace with aggregated team results.

## Switching Dynamics

Working hypotheses to validate:

- **Push:** A borrowed deck is unavailable, an earlier reflection needs revisiting, or competing priorities feel hard to express.
- **Pull:** A tangible card sort that can be revisited, with a personal record stored in the browser.
- **Habit:** Existing journalling, familiar worksheets, a physical deck or reliance on a coaching session.
- **Anxiety:** Whether a tool will judge the participant, how much effort it requires, and whether saved work will survive a browser or device change. Address effort honestly; no completion duration is established.

## Customer Language

**Verbatim customer descriptions of the problem:** Not collected.

**Verbatim customer descriptions of the product:** Not collected. Creator narrative and approved copy below must not be attributed to customers.

**Approved public messaging:**

- Headline: “Some things matter more. Which things matter to you?”
- Explanation: “Work through a set of values, make the difficult choices, and build a clearer picture of your priorities.”
- Primary action: “Find my core values”. Secondary action: “See how it works”.
- Process: “Sort. Narrow. Reflect.”
- Secondary behaviour proposition: “See your choices from another angle”.
- Storage summary: “Your reflections stay in this browser.” Pair this with the device, syncing, backup and optional-analytics explanation.

**Words to use:** values, priorities, choices, reflect, revisit, personal, team-focused, possible perspectives, optional notes, saved in this browser.

**Glossary:**

| Term | Meaning |
|---|---|
| Core Values | Product name; use “core values” in ordinary prose for a participant's chosen priorities. |
| Session | A locally saved values exercise, unfinished or completed. |
| Target count | The participant's chosen number of values to finish with; it is configurable. |
| History | Where participants access saved work, resume or review Sessions, replay rounds and manage backups. |
| Team-focused set | Values considered individually as preparation for a conversation about working together. |
| Behaviour reflection | A separate six-situation flow offering possible intentions and perspectives. |
| Example outcome | Clearly labelled synthetic content that illustrates a result, separate from a visitor's saved work. |

## Brand Voice

This is an inferred voice profile for owner review. Examples come from current About and Privacy copy; their performance has not been measured.

| Attribute | Means | Doesn't mean | Existing example |
|---|---|---|---|
| Personal and grounded | Explain the real reason the tool exists, in ordinary language. | Invented founder credentials, a dramatic transformation story or borrowed authority. | “The cards belonged to my coach, so I had to return them.” — About |
| Reflective | Invite consideration and leave the participant room to choose. | Judging an answer or declaring a personality type. | “I later decided to share the tool in case it could help others reflect on what matters to them.” — About |
| Practical | Explain what someone can do and how to retain their work. | Abstract self-improvement slogans. | “Use History to export a Session backup before clearing data or changing devices.” — Privacy |
| Candid | State limits alongside benefits. | Absolute privacy reassurance or hidden storage caveats. | “Rejecting or withdrawing consent stops further page views, but does not remove information already collected by Google.” — Privacy |

**Tone by context:**

- **Home and launches:** An inviting question followed by a concrete description and one clear next action. Describe released features accurately.
- **About:** Personal origin story, modest purpose and clear limits. Retain the borrowed-deck sequence; add personal details only when supplied.
- **Help and support:** Answer first, then give practical steps using the actual control names.
- **Errors:** State what failed and the next useful action. Avoid blame and guesses about saved-work safety.
- **Privacy:** Precise and calm; keep consent choices equally easy to understand and operate.
- **Sales:** No sales motion is established. For future outreach, use a factual invitation tied to an actual use case.
- **Social:** Conversational and reflective; preserve the same evidence standard as the site.

**Terms to use consistently:** Core Values, History, Session, personal set, team-focused set and behaviour reflection. These are product vocabulary, not a claim of exclusive ownership.

**Claim and language boundaries:**

- Describe possibilities and intended benefits. Avoid guaranteed clarity, team alignment, clinical validation, therapy and personality diagnosis: evidence for these claims is absent.
- Describe browser storage precisely. Avoid promises of anonymity, encrypted local storage, full privacy or regulatory compliance: local storage alone establishes none of these.
- Present team conversations as a secondary use. Avoid shared-workspace, collaboration and group-result claims: those capabilities are unavailable.
- Use the configured target and honest effort descriptions. Avoid fixed final counts or completion times: the count is configurable and duration is unmeasured.
- Label resources as further perspectives. James Clear, Brené Brown, Barrett Guillen and Larisa Halilović are referenced resources, not endorsers.
- Write direct sentences and concrete questions. Avoid “it's not X, it's Y” reveals, ornamental superlatives and generic transformation promises.

**Visual context:** Preserve the approved Plum & Rose palette and Core Values identity. The accepted public-site direction uses editorial Source Serif 4 headings, Inter body text, warm reading surfaces and real value-card compositions. This is design direction, not proof of implementation. See the specification for asset and accessibility requirements.

## Proof Points

**Metrics:** No verified usage, completion, conversion, retention or outcome figures supplied.

**Customers and logos:** None supplied or approved as proof.

**Testimonials:** None supplied. The creator's origin story is not a customer testimonial.

| Value theme | Available supporting evidence | Limit |
|---|---|---|
| A structured way to reflect | Existing sorting rounds, configurable target and optional notes. | Demonstrates the method, not a measured personal outcome. |
| Work that can be revisited | Local Session saving, History, replay and backups. | Browser data can be lost; there is no automatic cross-device sync. |
| A human reason for making it | About's coach, borrowed deck, return and reusable-tool story. | Personal experience, not product validation. |
| Control over optional analytics | Privacy notice and consent controls. | Consent withdrawal does not erase data already collected by Google. |

## Goals

**Product goal:** Help visitors understand the exercise and choose whether to begin, while preserving straightforward access to saved work.

**Business goal:** No revenue or growth target has been supplied.

**Primary conversion action:** “Find my core values” leads to exercise setup. The participant then chooses a set and target and explicitly selects “Start exercise” to create a Session. Treat entry and actual exercise start as distinct steps.

**Secondary actions:** Read How it works, revisit History, or choose the separate behaviour reflection. The proposed introductory sample is optional and must remain unsaved; it is not evidence of a completed exercise or a validated conversion event.

**Current metrics:** Unknown. No new tracking is authorised by this context document. Existing optional analytics must retain consent and exclude exercise values, choices, notes, Session query parameters and backup contents.

## Paid Ads

No paid advertising programme, budget, account access, CPA, ROAS or campaign evidence was supplied. Omit ad economics and campaign instructions until applicable.

## Learnings

No entries yet. Add evidence-backed findings or owner-approved decisions as they are recorded; include date, evidence, scope and status. Draft hypotheses above are not tested learnings.

## Open Questions for Owner Review

- What do participants say, in their own words, brought them to the exercise and made it useful?
- Is the tool intended to remain a personal sharing project, or is there a future business goal to record?
- Which audience scenarios have actually occurred, and which alternatives did those people use?
- Are there usage or outcome figures that can be substantiated and published with appropriate permission?
- Does the inferred voice match how you want to speak to participants?

## Changelog

- v1 (2026-11-06) — Initial context.
