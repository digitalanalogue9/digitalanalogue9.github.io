# Public-site copy review and proposed wording

Status: accepted-for-implementation
Date: 2026-11-06

The owner reviewed this proposal, requested that its recommendations be incorporated into the existing tickets, and authorised implement-spec to continue after those updates. Use the recommended wording below as the implementation baseline. Alternatives are optional and are not selected. This supplements [the specification](spec.md); it does not replace its functional or visual requirements.

## Editorial judgement

**Diagnosis B: a real voice is present.** The borrowed-card story is personal and specific. The existing copy respects individual choice and speaks candidly about local storage. Preserve those qualities. Home's exercise menu and some generic explanatory passages need a clearer reader benefit.

Write as the person sharing a useful reflection tool: warm, direct, modest and practical. Use natural British English. The primary reader is someone thinking about their own priorities; coaching and team conversations remain secondary. The main action is **Find my core values**, leading to setup rather than immediately starting an exercise.

The copywriting draft was edited through clarity, voice, reader benefit, evidence, specificity, emotional relevance and barriers to action. Emotion comes from recognisable decisions and the real origin story. Evidence comes from the current product, rather than invented statistics or endorsements.

## What the current content gets right and where it needs work

| Surface | Current evidence | Proposed improvement and reason |
| --- | --- | --- |
| Home | “Choose what you want to explore” and “Choose a reflection that fits what you want to explore today.” | Explain the card sort and its relevance before presenting a choice of activities. These lines describe navigation rather than giving a reason to begin. |
| Home, values introduction | “Sort value cards by importance and narrow to a core set.” | Keep this concrete explanation, then connect the chosen set to a decision or conversation. The method is useful evidence and should stay visible. |
| Home, behaviour invitation | “What do others see that I don’t?” | Replace with the agreed “See your choices from another angle”. The current question implies access to other people's views; the product offers hypothetical perspectives. |
| About | “The cards belonged to my coach, so I had to return them.” | Retain this sentence. It explains the reason for making the tool more convincingly than a general mission statement. Bring the borrowed deck into the heading. |
| About | “Focus on what is within your control.” | Replace with a concrete explanation of sorting and reflecting. The advice introduces an unrelated argument and could belong to almost any wellbeing page. |
| About | “For teams” and “shared priorities” | Explain that each person completes their own exercise before a discussion. This avoids implying a shared workspace or a collective result. |
| Help | “Want a reminder when you play?” | Use “Show instructions next time”. It describes the actual preference without switching between game and reflection language. Keep control names aligned with the current exercise. |
| Privacy | An accurate notice, including IndexedDB, analytics configuration and withdrawal limits. | Keep the detail, but begin with the agreed short summary and separate long paragraphs into topics. Readers should understand the practical consequences before the storage terminology. |
| Contact | “For questions, feedback, or privacy requests, email…” | Keep the useful direct action and add the agreed human invitation. Avoid a response-time promise. |
| Consent and shared text | “Customize preferences”, “Allow Analytics”, “Read Privacy Policy”. | Use “Customise preferences”, “Allow analytics” and “Read the privacy notice”. These are small consistency edits, not a change to consent behaviour. |
| History/import | “Paste exported JSON envelope here”. | Use “Paste the contents of your backup file here”. Preserve JSON in the file/import label where it helps identify the supported format, and keep replacement warnings explicit. |

## Proposed Home copy

### Opening

**Heading**

Some things matter more. Which things matter to you?

**Introduction**

Sort value cards to explore your priorities. Narrow your choices, then reflect on what your final set means to you.

**Primary action:** Find my core values

**Secondary action:** See how it works

**Returning visitor link:** Resume an exercise in History

**Storage line:** Your progress is saved in this browser. It doesn’t sync automatically between devices.

**Rationale:** Keep the already agreed headline. It invites a personal response without promising an answer. The revised introduction names the cards and the activity immediately. The History link makes returning straightforward without exposing saved content on Home.

### Example outcome

**Heading:** Example outcome

**Introduction:** A final set gives you something concrete to reflect on. You can add a note about why each value matters to you.

Show **Learning**, **Independence** and **Helping others**, using the existing catalogue descriptions unchanged. These are an illustrative selection, not a prescribed final count.

**Label:** Illustrative note for Learning

“I want room to learn in whatever I do next.”

**Caption:** An example only. You choose your own values and how many to finish with.

**Rationale:** Show the actual output and a recognisable use for notes. The invented note is explicitly illustrative, never a testimonial, saved result or attributed experience.

### Situations

**Heading:** When a decision pulls you in different directions

You might be considering a change of job, preparing for a conversation with a coach, or wondering what you want more of in your working life. Sorting the cards gives you a way to consider which priorities come first.

You can return to the exercise as your circumstances change.

**Rationale:** These are possible reasons to try the tool, not customer stories. They give “priorities” a recognisable setting without promising a better decision.

### Process

**Heading:** Sort. Narrow. Reflect.

**Sort:** Consider each value and choose how important it is to you.

**Narrow:** Work through further rounds to decide which values to keep. You choose how many to finish with.

**Reflect:** Add optional notes about your final values. Revisit your choices in History when you want to think them through again.

**Action:** See how it works

**Rationale:** Retain the agreed process heading and make each step a concrete action. Avoid a completion-time claim or a universal final count.

### Optional sample

**Heading:** When two good things compete, what comes first?

There’s no right answer. The interesting part is why.

**Choices:** Security / Independence

Use the existing catalogue descriptions verbatim:

- **Security:** It is important to know your work will always be there for you.
- **Independence:** You like being able to work in the way you want, without others telling you what to do.

**After either choice:** What makes that feel more important to you today?

**Invitation:** Explore the complete set and see which other values you want to keep.

**Persistent action:** Find my core values

**Reset action:** Reset sample

**Reassurance:** A sample only. Your choice isn’t saved.

**Rationale:** Keep the specification's sample wording and neutral response. The catalogue definitions are work-related; broadening Security into a new definition about personal safety would change the material being demonstrated.

### Secondary behaviour invitation

**Heading:** See your choices from another angle

Choose how you might respond to six everyday situations at work. Then consider possible intentions behind those choices and how someone else might experience them.

The perspectives are prompts for reflection. They don’t tell you what another person thinks.

**Action:** Explore behaviour reflection

**Rationale:** Explain the distinct activity and its limits together. Avoid suggesting the tool has observed the visitor or collected other people's opinions.

### Closing invitation

**Heading:** Take a closer look at your priorities

Start with the cards and see which values you want to keep. You can pause and return to your saved exercise through History.

**Action:** Find my core values

**Storage line:** Your answers and notes stay in this browser. Export a backup from History before clearing browser data or moving your work to another device.

**Link:** Read about storage and privacy

**Rationale:** End with the actual next step and useful reassurance. The detailed help and Privacy copy explain export limitations; this line does not promise that every export includes every note.

## Proposed About copy

### Opening and origin story

**Heading:** It started with a borrowed deck of cards.

I was working with a coach when she lent me a deck of cards to help me identify my core values. I found the exercise useful. It also gave me something I wanted to revisit as life changed.

The cards belonged to my coach, so I had to return them. I wanted a set of my own that I could come back to when I needed it. That was the starting point for Core Values.

I later decided to share the tool in case it could help others reflect on what matters to them.

**Rationale:** Preserve the first-person story and its factual sequence. Cut the general opening about being fortunate to work with a coach so the cards arrive sooner. Keep the modest reason for sharing it, rather than adding a founder mission or a dramatic personal outcome.

### What you can do here

Core Values gives you a set of cards to sort by importance. Over a series of rounds, you choose which values to keep. You can add notes about why they matter and come back to your choices later.

If you’re weighing a decision or thinking about a change, the exercise gives you a starting point for putting your priorities into words. What you take from it is yours to consider.

**Rationale:** Connect the tool to the reader after the origin story. Describe an available method and intended use without suggesting the exercise reveals a fixed identity or supplies a decision.

### A starting point for a conversation

You can use the exercise on your own or bring your chosen values to a conversation with a coach.

There’s also a team-focused set for thinking about what matters to you at work. Each person completes their own exercise. You can then discuss your choices together; the tool doesn’t combine them into a team result.

**Rationale:** Keep coaching and team uses, with individual reflection clearly first. State the collaboration boundary in ordinary language.

### Further perspectives

These articles, conversations and talks offer other ways to think about values and the choices we make.

Retain the existing link labels and destinations:

- [James Clear: Let Your Values Drive Your Choices](https://jamesclear.com/values-choices)
- [Brené Brown and Barrett Guillen: Living Into Our Values](https://brenebrown.com/podcast/living-into-our-values/)
- [Larisa Halilović: Core Values - Your Inner Compass](https://www.youtube.com/watch?v=mL4l75rMIiQ)

These links are provided for further reading and listening. They don’t imply an endorsement of Core Values.

**Closing action:** Find my core values

**Rationale:** Preserve the resources as useful reading rather than borrowed proof. The original resource titles remain intact even where their punctuation differs from the site's editorial style.

## Proposed How it works copy

**Page label:** How it works

**Heading:** Sort. Narrow. Reflect.

Choose how important each value is to you, narrow the set over further rounds, then reflect on the values you keep.

**Product-view captions:**

1. **Sort the cards.** Place each value in an importance category. You can move it if you change your mind.
2. **Narrow your choices.** Values in Not Important are removed when you move to the next round.
3. **Reflect on your final set.** Add an optional note about why each value matters to you.

Label the composition **Example exercise**. Use actual category/control labels and synthetic data. Alternative text should describe the visible stage rather than repeat the caption.

**Choose your set and target**

Choose personal values or the team-focused set, then decide how many values you want to finish with. The team-focused set is an individual exercise you can use before a conversation about working together.

**Sort and narrow**

Choose an importance category for each card. You can move cards between categories if you change your mind. When you advance, the values in Not Important are removed. Continue sorting the remaining cards until you reach your chosen number.

**Reflect and return**

You can add a note about why each final value matters. Use History to resume an unfinished exercise, review a completed one or replay its rounds.

**Keep a backup**

Your progress is saved in this browser. It won’t automatically appear on another device. Before clearing browser data or moving your work, export a backup from History and keep the file private.

Check what your chosen export includes. The standard values JSON export doesn’t include the additional reflection notes you add on the completed exercise page. Choose **Export reflection backup** in History to include them.

**Show instructions next time**

Control label: Show instructions when starting the exercise

Enabled feedback: Instructions will appear at the start of each new exercise.

Disabled feedback: Instructions will not appear automatically.

**A separate reflection on behaviour**

Choose how you might respond to six everyday situations at work. You can choose “It depends” or skip a situation. When you finish, you can consider possible intentions and perspectives on your choices. These prompts don’t establish what someone else thinks or feels.

Your choices and notes are saved in this browser.

**Actions:** Find my core values / View History / Explore behaviour reflection

**Rationale:** Separate the quick explanation from the practical guidance. Retain the saved preference and precise mechanics. Explain backup limits rather than promising that every downloaded file preserves every kind of note. “Export reflection backup” is the existing History control, backed by `exportSession(sessionId, { includeReflection: true })`.

## Proposed Privacy copy

**Page label:** Privacy

**Heading:** Your reflections stay in this browser.

Exercise answers and notes are stored on this device. They don’t sync automatically. Optional Google Analytics loads only if you allow it.

**Saved exercises and preferences**

Your values exercises are saved in this browser’s IndexedDB storage. Behaviour reflection choices and notes, display preferences and your consent choice are also stored in browser storage on this device.

The app doesn’t send your exercise values, choices or notes to a server. Saved work doesn’t sync between browsers or devices. Clearing this site’s browser data can remove it, along with your preferences.

**Backups you download**

Use History to export a backup before clearing browser data or moving your work. The standard values JSON export omits additional completed-exercise reflection notes. Choose **Export reflection backup** to include them.

Backup files are saved wherever your browser downloads files. Keep them private and delete them when you no longer need them. Imported values backups are added to History in this browser. Importing a values backup with an existing Session ID creates a separate copy. Restoring a behaviour reflection backup with an existing ID replaces that saved reflection and may replace newer work.

**Optional Google Analytics**

If you allow analytics, this site loads Google Analytics property G-JZPX5JCP5D and sends page views. Page URLs and referrers omit query strings and fragments, so Session identifiers in links aren’t included.

Exercise values, choices, notes and imported or exported backup contents aren’t sent. Google may process standard browser and device information under its own privacy terms. It may also use cookies or similar technologies after you consent.

Analytics doesn’t load before consent. Advertising features and Google Signals are disabled. Rejecting or withdrawing consent stops further page views. It doesn’t remove information Google has already collected.

**Your analytics choice**

Your current choice is [Not set / Allowed / Rejected]. You can change it at any time.

Actions: Allow analytics / Reject analytics

Saved feedback: Your analytics preference has been saved.

**Questions or privacy requests**

Email [corevaluesanalytics@gmail.com](mailto:corevaluesanalytics@gmail.com) with a question about this notice or a privacy request.

**Exercise action:** Find my core values

**Rationale:** Keep the existing notice's material facts, analytics property and withdrawal limitation. Break technical detail into readable sections and explain download/import consequences. This is an editorial proposal, not a new claim of legal compliance or a change to data handling.

## Proposed Contact copy

**Heading:** A question, an idea, or something that didn’t work?

If you have a question about the exercise, an idea to share or a problem to report, I’d like to hear from you.

Email [corevaluesanalytics@gmail.com](mailto:corevaluesanalytics@gmail.com). You can use the same address for privacy questions and requests.

**Exercise action:** Find my core values

**Rationale:** Make the invitation personal and easy to act on. Keep the existing address and avoid promising a response time.

## Shared wording and adjacent application text

These are proposed text edits only. Exercise mechanics, value/scenario content, saved data, preferences and consent behaviour stay governed by the specification. Application editing still requires the owner's wording review.

| Location | Proposed wording | Reason |
| --- | --- | --- |
| Main navigation | How it works · About · History · Find my core values | Matches the agreed public journey; the brand links Home. |
| Footer | Privacy · Contact | Keep practical links available on every page. |
| Consent summary | Optional Google Analytics helps me understand visits to this site. It stays off until you allow it. Your exercises are saved in this browser either way. | Explains purpose and choice using the personal site's voice, without weakening consent. |
| Consent links and controls | Read the privacy notice / Allow analytics / Reject optional cookies / Customise preferences / Save preferences | Use British spelling and sentence case. Preserve the broader rejection label because that control also rejects the functional preference consent. |
| Consent advanced label | Functional preferences | Keep pending a behaviour check. The current label doesn't explain its effect; don't invent an explanation or alter the consent model as part of copy editing. |
| Values setup heading | Set up your values exercise | Makes the transition from public introduction clear. |
| Set choices | Personal values / Team-focused values | Already useful and specific; retain. |
| Team choice explanation | The team-focused set is an individual exercise about what matters to you at work. You can use your choices to start a conversation with others. | Explains its relevance and individual nature. |
| Target label | How many values would you like to finish with? | Ask the existing practical question directly; retain validation and configurable limits. |
| Setup action | Start exercise | Retain the explicit start boundary. |
| Behaviour entry heading | Behaviour reflection | Consistent with the public invitation and distinct from the card sort. |
| Behaviour entry explanation | Consider six everyday situations at work and choose how you might respond. When you finish, you can explore possible intentions and perspectives on your choices. | Concrete description; no observation or diagnosis claim. |
| Behaviour entry detail | You can choose “It depends” or skip any situation. The perspectives are prompts for reflection, not other people's actual opinions. | Sets expectations and preserves choice. |
| Behaviour entry action | Begin reflection | More natural than “Begin scenarios”; only changes the label. |
| Behaviour return link | Back to Home | The destination becomes a public introduction, so “Back to exercises” would be misleading. |
| Behaviour results introduction | Consider these possible intentions and perspectives alongside your own experience. They don’t tell you what another person thinks. | Keep the useful limitation, expressed directly. |
| History heading | Exercise history | Describes the saved work without relying on “Session” as a term a new visitor must learn. Session remains the internal domain concept. |
| History introduction | Resume an unfinished exercise or revisit your earlier choices. The exercises shown here are saved in this browser. | Give the page's purpose before the import tools. |
| Values History empty state | Your saved values exercises will appear here. | A calm factual empty state; no promotional detour. |
| Backup input label | Values exercise or behaviour reflection backup (JSON) | Keep the supported format explicit and use familiar activity names. |
| Backup input placeholder | Paste the contents of your backup file here | Removes “JSON envelope” from instructions to participants. |
| Import warning | Importing a values backup creates a separate copy if it has the same ID as an exercise already saved here. Restoring a behaviour reflection backup with the same ID replaces that reflection and may replace newer work. | Preserve the different behaviours instead of hiding consequences behind a friendlier label. |
| Final values heading | Your core values | Keep the existing straightforward heading; sentence case only. |
| Notes heading and explanation | Reflect on your choices / You can add a short note about why each final value matters to you. These notes are optional and saved with the completed exercise in this browser. | Existing wording works; only replace the technical “session” in running prose. |
| Additional completed reflection notice | These reflections are optional and saved with this exercise on your device. The standard JSON export doesn’t include these notes. | Preserve the current export warning and distinguish these notes from value reasons. |

Do not rewrite catalogue definitions, scenario responses, generated prompt templates or technical error diagnostics as marketing copy. These carry product meaning or operational detail. This review covers their surrounding introductions and guidance, not a new content catalogue or engine change.

## Proposed metadata

Use the same descriptions for the relevant social previews. Keep canonical URLs and current routes.

| Page | Title | Description |
| --- | --- | --- |
| Home | Core Values · Explore what matters to you | Sort value cards, choose what matters most to you and reflect on your priorities. Save your exercise in this browser and return to it later. |
| About | About Core Values · A borrowed deck of cards | A borrowed deck of cards led to Core Values, a tool for sorting values and returning to the priorities you choose. |
| How it works | How Core Values works | See how to sort value cards, narrow your choices and reflect on your final set. Find guidance on saved exercises, History and backups. |
| Privacy | Privacy · Core Values | Understand what Core Values saves in your browser, how backups work and how to allow or reject optional Google Analytics. |
| Contact | Contact · Core Values | Ask a question, share an idea or report a problem with Core Values. Find the email address for feedback and privacy requests. |
| Behaviour | Behaviour reflection · Core Values | Consider six situations at work and explore possible intentions and perspectives on your choices. |
| History | Exercise history · Core Values | Resume or review exercises saved in this browser, replay earlier rounds and manage your backups. |

## Alternatives for the main editorial choices

The recommended headline and CTA preserve the specification. These alternatives are for owner choice, not a request to reopen the design direction.

| Element | Alternative | Trade-off |
| --- | --- | --- |
| Home headline | Which values matter most to you? | More immediate and compact; loses some of the warmth and rhythm of the agreed opening. |
| Home headline | Make room to think about what matters to you. | A gentler invitation, but less explicit about choosing between values. |
| Main action | Explore my values | Lower pressure, but less precise about reaching a chosen final set than “Find my core values”. |
| Main action | Start a values exercise | Very clear about the activity, but could imply an immediate start when the next page is setup. |
| About headline | Why I made Core Values | Plain and personal, but less memorable than the borrowed deck. |
| About headline | A values exercise I wanted to come back to | Emphasises revisiting, but takes longer to reach the specific story. |

## Review checks and implementation handoff

- Claims were checked against [product marketing context](../../docs/product-marketing.md), the specification, active route components and catalogue entries. Audience scenarios are invitations, not attributed customer evidence.
- The existing borrowed-deck facts, resource destinations, public email and analytics property are preserved. No additional capability, testimonial, duration, fixed result count or measured outcome is proposed.
- A final editorial pass checked clarity, natural British English, sentence rhythm, unsupported claims and formulaic marketing patterns. The agreed “Sort. Narrow. Reflect.” is an intentional process label.
- The recommendation uses the existing design direction. It adds no research, tracking, service or data requirement.
- No application files were changed for this review. No browser or test verification is claimed for proposed wording.
- Owner review is complete: the recommended drafts are accepted; none of the alternative headlines or CTAs has been selected. Tickets 02–06 consume the reviewed copy; ticket 07 checks cross-page consistency. Ticket 01 takes the reviewed setup wording without changing its functional scope. The owner has explicitly authorised implementation to resume once these task updates are complete.
- Minor adjacent application text edits above belong to ticket 07. Avoid changing the sorting engine, operational diagnostics or export semantics to fit the prose. The functional-consent field is stored, but the reviewed source does not establish a separate feature it controls; retain its label and flag this limitation rather than inventing an explanation.


## Public feature availability

The reviewed behaviour-reflection copy remains approved for builds where VITE_ENABLE_BEHAVIOUR_REFLECTION=true. Public builds hide the Home and How it works invitations and /behaviour route when the flag is unset or false. This changes visibility only; do not change the tool behaviour, saved data, or backup/import contracts.

The disabled build still accepts scenario reflection backup files. Keep the existing backup/import warning visible and accurate; hiding the active tool must not imply that these files are unsupported.
