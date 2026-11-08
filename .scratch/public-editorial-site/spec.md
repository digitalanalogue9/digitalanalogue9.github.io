# Give the public Core Values site an editorial identity and a clear route into reflection

Status: ready-for-agent

## Problem Statement

A first-time visitor to the public Core Values site encounters an exercise menu and setup choices before understanding why the product might be useful or what they will take away. The wording describes functionality, while similar panels, centred headings and interface-sized typography give the static pages little hierarchy or character. The product's strongest material—the act of choosing between values, its personal origin story and its browser-local storage model—is not expressed as a coherent introduction.

The public site needs to earn attention and explain the product without overstating what an exercise can reveal. It must remain easy to enter and revisit, preserve saved work, and accurately distinguish an individual team-focused exercise from multi-user collaboration. Privacy and help pages must remain useful reading surfaces rather than become promotional decoration.

## Solution

Create an editorial public site that combines the recommended reflective brand direction with straightforward product messaging and a small optional sample interaction. Preserve the approved Plum & Rose palette and existing background SVG filenames. Use real value cards and an honestly labelled example outcome to demonstrate the product. Keep a direct route into the complete exercise at all times.

Lead with individuals considering their own priorities. Present coaching and team conversations as secondary uses, without introducing a separate commercial product, a paid offer or collaborative functionality. This is the working audience decision synthesized from the accepted recommendation; the historical product requirements describe broader aspirations that must not become unsupported public claims.

The change covers Home, About, How it works, Privacy, Contact, their shared public navigation/footer and corresponding metadata. The public site becomes more expressive; exercise mechanics and saved Session behaviour remain authoritative and unchanged.

## User Stories

1. As a first-time visitor, I want to understand the product's purpose immediately, so that I can decide whether it is relevant to me.
2. As a first-time visitor, I want to see that the activity involves sorting value cards, so that the proposition is tangible rather than abstract.
3. As a visitor considering a change or difficult choice, I want examples of when reflection may be useful, so that I can relate the product to my own situation.
4. As a visitor, I want one obvious action to explore my values, so that I do not have to compare several equally prominent journeys before starting.
5. As a visitor, I want to understand what I can leave with, so that I know what the exercise produces.
6. As a visitor, I want example results clearly labelled, so that I do not mistake illustrative content for my own results or a customer testimonial.
7. As a curious visitor, I want an optional sample choice, so that I can experience the nature of reflection before starting a full exercise.
8. As a sample participant, I want a neutral prompt after either choice, so that the sample does not label my personality or imply that one answer is better.
9. As a sample participant, I want to change or reset my choice, so that exploration remains low commitment.
10. As a sample participant, I want my introductory choice to remain unsaved, so that trying the sample does not create a Session or alter existing work.
11. As a visitor who does not want a sample, I want to start the full exercise directly, so that the introduction is never a gate.
12. As a participant, I want setup choices after entering the exercise journey, so that the public home page does not ask me to configure an activity before understanding it.
13. As a participant, I want personal and team-focused value sets to remain available, so that the new introduction preserves the existing choices.
14. As a team facilitator, I want the team-focused option clearly described as an individual exercise, so that I do not expect a shared workspace or aggregated team results.
15. As a visitor interested in behaviour reflection, I want a distinct secondary route when the site owner enables it, so that I can find it without confusing it with values sorting.
16. As a behaviour-reflection participant, I want the wording to describe possible perspectives, so that I do not mistake prompts for other people's actual opinions.
17. As a returning visitor, I want History and a clear resume route, so that a more promotional home page does not impede access to saved Sessions.
18. As a returning visitor, I want an existing unfinished Session to survive the redesign, so that my progress is preserved.
19. As a visitor, I want the About page to explain the real borrowed-card origin story, so that I can understand who made the tool and why.
20. As a reader, I want external resources identified as further perspectives, so that I do not interpret them as endorsements or validation of this product.
21. As a new participant, I want a concise visual explanation of sorting, narrowing and reflecting, so that I know what to expect before starting.
22. As a participant needing detail, I want instructions about categories, rounds, saving and backups, so that I can use the actual product successfully.
23. As a participant, I want the existing instruction preference retained, so that the new help page respects my choice.
24. As a privacy-minded visitor, I want a short accurate storage summary near relevant actions, so that I understand what happens to my exercise answers.
25. As a privacy-minded visitor, I want precise details about browser storage and optional analytics, so that reassurance does not hide material limitations.
26. As a visitor, I want to accept, reject and later change optional analytics consent, so that the public redesign preserves my control.
27. As a participant changing devices or clearing browser data, I want a clear warning and backup guidance, so that I do not lose saved work unexpectedly.
28. As a visitor with a question, I want a human contact invitation and a working email link, so that I can contact the site owner without creating an account.
29. As a keyboard user, I want to reach every link, sample choice and control with visible focus, so that the expressive design remains usable.
30. As a screen-reader user, I want clear landmarks, headings and sample feedback, so that the structure and interaction make sense without seeing the artwork.
31. As a mobile visitor, I want legible typography and controls without horizontal scrolling, so that I can understand and use the public pages on a small screen.
32. As a visitor who reduces motion, I want the full message and interaction without animation, so that motion is optional rather than necessary for comprehension.
33. As a visitor opening a shared link, I want the intended page, title and description, so that the public introduction works outside the site's navigation.
34. As a participant, I want existing exercise, results, replay and History links to remain valid, so that the redesign does not break established journeys.
35. As the site owner, I want reusable public-page styling separated from exercise styling and generated tokens, so that future editorial changes do not unexpectedly alter the application.
36. As a site owner, I want a working home page in development and production, so that visual improvements are not delivered on top of a runtime failure.

## Implementation Decisions

### Direction and scope

- Implement the accepted recommendation: an editorial reflection brand, clear benefit-led messaging, real product demonstration and an optional sample. Do not reopen palette selection or run a new concept tournament.
- Preserve the Core Values name, Plum & Rose roles, existing domain, routes, static hosting, PWA support and browser-local application model. This specification targets the personal public repository; it does not change the separate in-house product or add a public/in-house theme switch.
- Home and About use Impeccable's Persuade mode. How it works and Privacy use Read mode. Contact is a concise practical reading/action page. Exercise screens continue to use Operate conventions.
- Establish shared editorial typography, spacing, reading widths, navigation and public-page composition without globally restyling the exercise board, results, History or replay. Keep generated token outputs untouched; extend the existing hand-written site theme layer.

### Editorial visual system

- Retain Inter for body copy and controls. Use self-hosted Source Serif 4 for public editorial display headings, regular and semibold only as needed, with a robust serif fallback. Retain the font's licence and avoid runtime font-CDN requests. A font-loading failure must leave readable, usable pages.
- Aim for a fluid desktop home display size around 64–80px and a mobile size around 40–48px; supporting page titles are smaller. Balance the actual copy instead of forcing fixed line counts. Display tracking must not be tighter than -0.04em.
- Use open sections and deliberate changes in scale and density rather than enclosing each page or paragraph in repeated rounded cards. Use a broad text/product composition on desktop and a coherent single column on mobile. Privacy should be a restrained reading surface, not another hero treatment.
- Preserve warm pale reading surfaces and deliberate deep-plum regions with appropriate inverse text. Keep rose as an accent and selection colour. Do not introduce a competing palette, gradient text, ornamental badges, invented metrics or generic feature-icon tiles.
- Real cards and their narrowing into an example final set are the primary visual material. Reuse current value titles and descriptions. Present demonstration notes as illustrative and use no private saved content, customer logos, testimonials or implied endorsements.
- Use the approved geometric SVG artwork sparingly to frame or connect public sections. Reuse existing filenames if an asset needs adjustment; do not repeat the full background behind every nested section or change asset URLs unnecessarily. Decorative artwork must not carry meaning or enter the accessibility reading order.
- Provide one restrained card-choice/narrowing motion treatment. Content starts visible, no scroll-jacking or autoplay carousel, and reduced-motion users receive the complete static composition and immediate feedback.

### Home composition and wording

- The initial viewport contains the benefit-led headline, concise explanation, primary action and a legible product-specific card composition. It must not open with a purpose-picker, target-count form or a large generic enclosing panel.
- Use this agreed-direction opening copy as the implementation starting point:
  - Heading: “Some things matter more. Which things matter to you?”
  - Supporting copy: “Work through a set of values, make the difficult choices, and build a clearer picture of your priorities.”
  - Primary action: “Find my core values”.
  - Secondary action: “See how it works”.
- Below the opening, sequence: a labelled example outcome; short situations in which someone might use the exercise; “Sort. Narrow. Reflect.” process explanation; optional sample; and a grounded closing invitation with storage reassurance. Show the secondary behaviour-reflection invitation only when VITE_ENABLE_BEHAVIOUR_REFLECTION=true; it is hidden by default.
- Show an example final set using actual catalogue values and one clearly illustrative note. Label it “Example outcome”; it must not resemble the visitor's saved result. Do not promise a fixed final count or duration: target count remains configurable and duration has not been established.
- Use “See your choices from another angle” for the secondary behaviour-reflection proposition. Explain that the six situations offer possible intentions and perspectives, not facts about other people's thoughts. Keep the route available without making it an equally dominant home hero.
- The primary action goes to the existing exercise entry route. The full target-count and personal/team-focused setup remain there, followed by the existing explicit Start exercise action. Clicking a marketing link or using a sample does not itself start a Session.
- Separate the public landing composition from the exercise setup so the exercise entry no longer renders the marketing page through a mode flag. Reuse existing setup behaviour and service boundaries; do not duplicate Session creation logic.
- Returning visitors retain an obvious “History” or “Resume an exercise” link. Do not enumerate private saved value titles or notes in promotional previews. Detailed saved-work management remains in History.

### Optional sample interaction contract

- The sample is below the main introduction, never a blocking full-screen entry experience. Provide a persistent nearby route to the full exercise before and after interaction.
- Use the existing personal catalogue values SECURITY and INDEPENDENCE, displayed in readable title case while retaining their catalogue meaning. Introduce them with “When two good things compete, what comes first?” and “There’s no right answer. The interesting part is why.”
- The sample has three local states: no choice, Security selected, Independence selected. Either choice produces the same neutral prompt: “What makes that feel more important to you today?” and an invitation to explore the complete set. Do not infer a profile, generate a score, rank choices or provide psychological interpretation.
- Selection is changeable. A “Reset sample” action returns to no choice. Use labelled native controls with selection semantics and an accessible feedback region; no drag-only interaction or keyboard trap. Keep feedback adjacent and do not unexpectedly move focus.
- Display “A sample only. Your choice isn’t saved.” No free-text field, persistence, query-string state, Session creation, analytics choice events or network submission. Sample state resets on leaving/reloading the page and is not transferred into the full exercise.

### About

- Lead with “It started with a borrowed deck of cards.” Retell the existing factual story: an exercise with a coach, returning the borrowed deck, wanting something to revisit, and sharing the resulting tool.
- Follow with what the tool offers now, its limits, and personal reflection/team-conversation use cases. End with “Find my core values”. Do not add a creator name, portrait, professional credential or personal detail that is not supplied.
- Retain the existing further-reading resources and destinations, identified as additional perspectives. Do not use author portraits or logos as social proof or imply the authors endorse the app.

### How it works

- Change the public label from “How to use” to “How it works” while retaining the existing route for bookmarks and direct links.
- Lead with “Sort. Narrow. Reflect.” Show three accurately labelled product views: placing values; narrowing across rounds; and the final set with optional notes. Generate or compose these from the current application with synthetic example data, never a user's saved Session. Provide concise explanatory captions and meaningful alternative text where the image adds information.
- Follow the overview with the existing practical details: personal versus team-focused sets, configurable target, categories, rounds, removal of Not Important values when advancing, local progress saving, optional notes, History, replay and supported backups. Keep the explanation aligned with actual controls and existing terminology.
- Preserve the existing instruction preference and its saved state. When VITE_ENABLE_BEHAVIOUR_REFLECTION=true, give behaviour reflection a separate explanatory section and clearly distinguish its flow from values sorting. When the flag is unset or false, hide that section and its action.
- Explain that the team-focused exercise is individual and supports a later conversation; it does not create shared Sessions or collective results.

### Privacy and Contact

- Privacy starts with “Your reflections stay in this browser.” Follow with: “Exercise answers and notes are stored on this device. They don’t sync automatically. Optional Google Analytics loads only if you allow it.”
- Retain the full accurate notice, consent controls and feedback. Distinguish locally stored exercise data, site preferences, optional page-view analytics and exported backup files. Preserve warnings that clearing browser data can remove work, backups require care, and withdrawing consent does not erase information Google already collected.
- Retain the current analytics property, consent defaults and query/fragment omission. Do not add tracking as part of this redesign. Keep reject and allow choices easy to find and operable; marketing prominence must not favour consenting.
- Contact uses the human invitation “A question, an idea, or something that didn’t work?” Explain that questions, feedback and privacy requests go to the existing public email address. Preserve that address and mailto action. Do not invent a response-time commitment or provision a new domain mailbox.
- Do not promise anonymity, encrypted local storage, clinical validation, guaranteed clarity, therapy, team alignment, account syncing, collaboration, pricing or a completion duration. Historical planning documents are not evidence that these capabilities exist.

### Navigation, routing and technical boundaries

- Public desktop navigation prioritises “How it works”, “About”, “History” and the primary exercise action. The brand links Home. Privacy and Contact are persistent footer links on all pages, and Privacy remains directly reachable from consent controls. All five public pages link to the exercise without a dead end.
- On mobile, use a compact wrapping or stacked navigation that keeps the primary action visible and avoids horizontal overflow; do not introduce a complex menu solely for this change. Maintain current navigation semantics and an accessible name.
- Preserve existing direct application routes, Session query parameters and canonical domain. Update each public page's title, description and social metadata to match its purpose. Maintain generated direct-route hosting metadata, canonical URLs and working refreshes on the static host.
- Retain social sharing destinations, installation/offline behaviour, existing consent preferences, local Session history, export/import compatibility and feature availability. VITE_ENABLE_BEHAVIOUR_REFLECTION is a build-time opt-in: unset or false hides the behaviour route and its Home/How it works entry points; explicit true keeps the existing tool and links available. This visibility gate does not change behaviour reflection data, Session or backup contracts.
- Resolve the observed browser-runtime configuration failure before acceptance. Browser routes must not depend on a Node-only process global. Use the existing Vite-compatible configuration approach and preserve current defaults and supported deployment configuration intent; do not turn this into a framework migration or broad configuration refactor.
- No database schema, service API, Session format or backup format change is required. Marketing and sample components must not introduce new service-layer seams or bypass existing consent/storage contracts.

### Accessibility and completion criteria

- All public pages work from 320px wide upward and at 200% zoom, with no clipped headings, overlapping controls or page-level horizontal scroll. Reading text should generally stay within 65–75 characters per line on wide screens.
- Provide one meaningful primary heading per page, logical subsequent headings, landmarks, visible keyboard focus, accessible control names, and touch targets at least 44px high for principal controls.
- Verify body text contrast at least 4.5:1 and large text/control/focus contrast at least 3:1 in relevant states. Do not encode sample selection solely in colour. Ensure consent content and navigation remain readable over their own surfaces.
- The complete headline, explanation and primary action remain accessible if fonts or decorative imagery fail, animations are disabled, or optional analytics is rejected.
- Avoid heavy animation libraries, autoplay video and render-blocking remote assets for the marketing experience. Supply dimensions for product imagery and load below-fold imagery lazily. The optional sample should not load exercise services solely to render its two choices.
- Acceptance requires working public route loads and refreshes, a successful existing exercise handoff, preserved saved-work access and consent behaviour, accurate copy, functional sample isolation, and the desktop/mobile visual review described below. The behaviour-reflection route and links must also match the build-time flag in both default-disabled and explicitly enabled builds.

## Testing Decisions

- Prefer the existing browser-level application boundary as the main test seam. Extend current Playwright coverage rather than introducing a marketing-specific service abstraction or duplicating exercise engine tests. Assert what a visitor sees, can navigate to, can operate and can retain after a reload; do not assert component decomposition, class names or incidental copy fragments.
- Existing prior art includes application-route navigation/direct-refresh tests, the functional-page journey, the saved exercise lifecycle, personal content/metadata tests and consent behaviour tests. Update headline/navigation expectations intentionally where approved copy changes, preserving the behaviours those tests protect.
- Cover direct load and refresh of Home, About, How it works, Privacy and Contact, meaningful page headings, primary-action destinations, History access and canonical/metadata correctness. Fail on runtime page errors, including the previously observed configuration failure. Test both behaviour-reflection build states: unset/false hides the Home and How it works invitations and resolves /behaviour to not-found; true shows both invitations and keeps the existing route usable.
- Cover the exercise handoff: the marketing action reaches existing setup, both value-set choices and target count remain available, and a Session begins only after explicit Start exercise. Preserve an existing representative start/save/resume lifecycle as regression coverage rather than duplicating every sorting rule.
- Cover sample behaviour through visible controls: initial state, either selection, changing selection, reset, keyboard operation, neutral feedback and a working full-exercise action. Reload/navigation resets the sample. Use existing browser inspection of saved-work state to verify no new Session or scenario attempt was created and no existing record changed; do not rely on a newly invented storage abstraction.
- Intercept analytics requests in a representative browser journey to verify no optional analytics before consent or after rejection and no sample choice/answer in any outgoing request. Reuse the existing consent component tests for detailed grant/withdraw behaviour rather than recreating them at every page.
- Keep focused existing component-level tests for the saved instruction preference, consent controls, functional external links and metadata. Add a component test only if a material behaviour cannot be exercised reliably at the browser boundary. Do not snapshot prose, SVG path data or the DOM tree merely to mirror implementation.
- Review Home and the four supporting pages together at desktop (1440px) and mobile (390px), with an additional 320px overflow check. Include no-choice and selected sample states, pending consent, reduced motion, keyboard focus and font/image fallback in the bounded review. Build fully, inspect in one batch, fix identified defects together, and use at most one confirmation round.
- Validate accessible names, heading order, contrast and reduced-motion behaviour; an automated scan supplements rather than replaces visual and keyboard checks. Review the actual built static-site output and route metadata, not only the development server.
- Run the project's existing type, lint, relevant test, production build and static-host artifact checks. Broaden verification only for failures or a change that affects a wider contract. Do not update baselines merely to conceal broken behaviour.
- The proposed browser/visual test seam has been presented to the user for confirmation during specification synthesis. No additional lower-level seam is necessary. Any requested adjustment belongs in the Comments section; this is not an implementation approval gate.

## Out of Scope

- Implementing this specification during the specification-writing task.
- A full-screen dilemma experience, mandatory onboarding or a personality-assessment product.
- Renaming Core Values, changing the selected palette, creating another round of colour prototypes or changing existing SVG filenames.
- Changes to the separate in-house application, organisational branding or a product-edition switch.
- New sorting mechanics, category rules, target defaults, value catalogues, results capabilities, scenario logic, data models or migrations.
- Accounts, payment, subscriptions, pricing pages, multi-user collaboration, shared team dashboards, cloud syncing or server-side answer processing.
- Persisted sample responses, generated interpretation, sample analytics, new tracking vendors or changes to the consent model.
- Invented testimonials, validation studies, outcome guarantees, professional endorsements, creator details or response-time commitments.
- Provisioning a domain mailbox, publishing/deploying the redesign, or unrelated platform/configuration cleanup.

## Further Notes

- This specification synthesizes the user's selection of the recommended editorial direction with the clearer commercial messaging and a small optional interaction from the radical concept. The main primary audience is individual reflection; coaching and team conversations remain secondary, accurately bounded contexts.
- Proposed copy above is the implementation baseline. Small editorial refinements may improve line fit and comprehension while preserving meaning and product truth. Material claim changes require evidence rather than creative invention.
- The previous review was source-based: the live Home route showed a configuration runtime error, and browser automation could not complete a reliable visual audit. The implementation must establish a working visual baseline before claiming a verified redesign.
- Current source, current working behaviour and the accepted session decisions take precedence over aspirational historical requirements. In particular, do not repeat old assertions of local encryption, scientific validation, shared team features or regulatory compliance without verification.
- Maintain this specification as the change contract. Any subsequently produced design brief or visual reference should record the selected direction, not restart the already-settled brand discussion. The present task creates only the tracker specification.

## Comments

- Specification synthesized from the accepted public-site recommendation. Test-boundary confirmation was requested while preparing this document; no response has been recorded at initial publication.

- 2026-11-08 owner-approved availability decision: behaviour reflection is disabled in public builds unless VITE_ENABLE_BEHAVIOUR_REFLECTION=true. This gates the Home/How it works invitations and route, and any active scenario presentation in History; it does not alter saved records or backup import/export compatibility.
