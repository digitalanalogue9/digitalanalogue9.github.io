# Cookie consent banner buttons: UK sources and recommendation

Research checked 16 November 2026. This is a short design note, not legal advice.

## Practical answer

For any non-exempt cookies or similar technologies that require consent, show **Accept all** and **Reject all** together
on the first layer, with equal prominence and one action each. Both choices should apply to every non-exempt purpose,
and neither choice should be preselected. The ICO's final guidance (29 April 2026) explicitly says a consent mechanism
should make refusal as easy as acceptance; its example shows equally prominent accept, reject and customise choices. The
ICO's 2024 enforcement template similarly calls for a reject-all or equivalent unambiguous refusal at the same point
consent is sought, equally prominent as acceptance.

**A separate “Customise” button is not clearly a universal legal requirement.** The ICO says consent must be
purpose-specific and generally requires granular options for each purpose. If there is only one optional,
consent-requiring purpose, Accept and Reject already let the person choose that purpose; a separate customisation step
would not add a meaningful choice. Treat this as a reasoned application of the ICO's guidance, not an explicit ICO
ruling that customisation is never needed. If there are multiple distinct non-exempt purposes, or users need a finer
choice (for example by third party), include a clearly accessible customisation route and keep its controls off by
default.

**Check the analytics use before building a consent toggle.** Since 5 February 2026, PECR has a statistical-purposes
exception for storage/access whose sole purpose is collecting statistics about use of the service or website to improve
it. It requires clear and comprehensive information, a simple free means to object, and no objection; sharing is
restricted to a party assisting those improvements. This is a narrow, conditional exception, not a blanket exemption for
anything labelled “analytics”. If the actual use does not meet every condition (including sole purpose), prior consent
is still required. Where the exception applies, explain the analytics and offer a simple opt-out; an Accept/Reject
consent choice is not what the exception requires. UK GDPR still applies if personal data is processed.

## What the sources establish

| Point                                                                                                                                                                                                                                                                                      | Status                                                                             | Official source                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PECR regulation 6 generally prohibits storing/accessing information on a user's device unless the subscriber/user has clear information and consent, subject to exceptions.                                                                                                                | **Law**                                                                            | [PECR 2003, regulation 6](https://www.legislation.gov.uk/uksi/2003/2426/regulation/6)                                                                                                                                                                                                                                                                                                                                                                           |
| The Data (Use and Access) Act inserted the statistical-purpose exception in Schedule A1, paragraph 5; it requires sole purpose, service improvement, clear information, and a simple free objection method. The schedule came into force on 5 February 2026.                               | **Law**                                                                            | [Data (Use and Access) Act 2025, Schedule 12](https://www.legislation.gov.uk/ukpga/2025/18/schedule/12)                                                                                                                                                                                                                                                                                                                                                         |
| A qualifying analytics/statistics purpose is not automatically consent-requiring, but users must receive information and a simple means to object. For multiple purposes, an exception for one purpose does not cover another; consent must cover non-exempt purposes.                     | **ICO interpretation of law**                                                      | [ICO: What are the exceptions?](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/) and [ICO: How do we manage consent in practice?](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/how-do-we-manage-consent-in-practice/) |
| For consent mechanisms, refusal should be as easy as acceptance; the ICO illustrates equal prominence for accept/reject and shows a customise path with purpose-specific controls. Consent must be opt-in, controls must work, and consent must be withdrawable as easily as it was given. | **Final ICO guidance / regulator expectation**, not wording found verbatim in PECR | [ICO: How do we manage consent in practice?](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/how-do-we-manage-consent-in-practice/)                                                                                                                                                                                                                      |
| For non-essential advertising cookies, the ICO has required a refusal at the same point, such as an equally prominent Reject All or equivalent, and has objected to refusal requiring extra steps.                                                                                         | **Published enforcement position / recommendation applied to assessed sites**      | [ICO cookie compliance template letter, 21 November 2024](https://ico.org.uk/media2/about-the-ico/documents/4032419/cookie-letters-project-phase-2-template-letter.pdf)                                                                                                                                                                                                                                                                                         |

## Suggested button set

- If consent is required for just one optional purpose: **Accept analytics** / **Reject analytics** (or **Accept all** /
  **Reject all** if there are only essential and that one optional purpose). Put them side by side or otherwise make
  their prominence equivalent.
- If there are several optional purposes: **Accept all** / **Reject all** / **Customise** on the first layer. In
  customisation, describe each purpose plainly, leave optional controls off, and provide a save/confirm action.
- If analytics qualifies for the statistical exception: state what it collects and why, and provide a simple, free
  objection/opt-out mechanism. Do not describe a non-consent exception as though the visitor gave consent.
- In either design, do not set consent-requiring technologies before opt-in, respect rejection, and provide a persistent
  way to revisit choices or withdraw consent.

## Scope caveat

“Analytics” alone is not enough to decide which regime applies. Confirm the tool's actual storage/access behavior,
purpose, recipients, data sharing and subsequent personal-data processing. The statutory statistical exception is
limited to statistics for improving the service/site; separate advertising, profiling, cross-service use or other
purposes can take it outside that exception. ICO guidance also cautions that its PECR exceptions are purpose-specific
and UK GDPR duties may still apply.
