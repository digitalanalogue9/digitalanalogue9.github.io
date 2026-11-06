# 04: Tell the origin story and improve Contact

**What to build:** Visitors can understand the real human story behind Core Values, distinguish further reading from endorsement and contact the owner through a clear, welcoming page. Both pages provide a useful next step into the exercise.

**Blocked by:** 02 — Launch the editorial home page and public navigation.

**Status:** ready-for-agent

Parent specification: [Public editorial site](../spec.md), especially About, Privacy and Contact, and Editorial visual system.

- [ ] About leads with “It started with a borrowed deck of cards.” Preserve the factual sequence: a values exercise with a coach, returning the borrowed deck, wanting a reusable tool and sharing it with others.
- [ ] Use the established public editorial typography and open reading composition, with a clear explanation of the current tool and its limits. Do not add invented creator names, portraits, credentials or personal details.
- [ ] Explain individual reflection and the secondary use of team-focused values as a conversation starter; imply no multi-user collaboration, guaranteed outcomes or validated assessment.
- [ ] Retain the existing further-reading resources and destinations, clearly identified as additional perspectives rather than product validation or endorsement.
- [ ] About ends with a working “Find my core values” action leading to setup without creating a Session.
- [ ] Contact leads with “A question, an idea, or something that didn’t work?” and explains that questions, feedback and privacy requests go to the existing public email address.
- [ ] Preserve the actual email address and functioning mailto action. Add no unconfirmed response-time promise, account requirement, contact form/backend or new mailbox provisioning.
- [ ] Both pages retain their existing URLs, load/refresh directly, have meaningful headings, updated page-specific metadata and an accessible route into the exercise.
- [ ] Extend existing personal-content/metadata and public-route tests to protect factual links, mailto behaviour, metadata and the exercise actions without snapshotting prose or DOM structure.
- [ ] Verify readable desktop/mobile widths, 320px overflow, keyboard navigation and contrast. Relevant checks pass; the exercise surfaces remain unchanged.

## Reviewed wording requirements

Implement the full [About draft](../copy-review.md#proposed-about-copy), [Contact draft](../copy-review.md#proposed-contact-copy) and corresponding [metadata](../copy-review.md#proposed-metadata). Use [product marketing context](../../../docs/product-marketing.md) for factual and voice boundaries. The recommended drafts are the copy baseline; alternatives remain optional.

- [ ] Preserve the first-person borrowed-deck story, including “The cards belonged to my coach, so I had to return them.” Bring the cards into the opening and retain the modest reason for sharing the tool. Add no founder mission, credentials or invented personal outcome.
- [ ] Replace the generic “Focus on what is within your control” advice with the reviewed “What you can do here” explanation of sorting, choosing, notes and revisiting. Relate the exercise to a decision or change without promising the answer.
- [ ] Use the reviewed conversation section: individual use first, coaching and team-focused use second. State that each person completes their own exercise and the tool does not combine choices into a team result.
- [ ] Retain all three resource titles and destinations. Use the reviewed further-perspectives introduction and clarify that links do not imply endorsement of Core Values.
- [ ] Use the reviewed personal Contact invitation, including “I’d like to hear from you”, and the existing corevaluesanalytics@gmail.com address for feedback and privacy requests. Preserve mailto behaviour and make no response-time promise.
- [ ] Keep the About and Contact exercise actions and reviewed page-specific metadata. Edit for inviting, natural British English while preserving the product's genuine personality.

## Comments

- About and Contact are one bounded slice because together they establish who made the product and how a visitor can reach them; they introduce no separate service or data model.

- 2026-11-06 owner instruction: **Application editing is paused pending owner review of proposed wording.** Read [the copy review and proposal](../copy-review.md) before resuming. Use the reviewed full About and Contact drafts. Preserve the factual first-person story, resources and email address.


- 2026-11-06 follow-up: the owner reviewed the copy proposal, requested these wording requirements in the existing tickets, and authorised implement-spec to continue after the updates. This supersedes the earlier wording-review pause. Use the recommended draft in copy-review.md; alternative headlines and CTAs are not selected.
