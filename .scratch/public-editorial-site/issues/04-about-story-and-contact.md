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

## Comments

- About and Contact are one bounded slice because together they establish who made the product and how a visitor can reach them; they introduce no separate service or data model.
