# Functional and preference storage: research note

## What the terms mean

“Functional” or “preference” cookies are common product labels for storage that remembers a visitor’s choices or
supports a requested feature (for example, a display preference). They are not a blanket legal exemption. Under PECR
regulation 6, storing information on or accessing information from a user’s device generally requires consent unless it
is strictly necessary to provide a service the user has requested. The ICO’s guidance covers cookies and similar
technologies; the purpose and necessity of each storage use matter, so a preference should not be called legally
“essential” from its name alone. ([PECR regulation 6](https://www.legislation.gov.uk/uksi/2003/2426/regulation/6),
[ICO: Cookies and similar technologies](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/))

These website records are mostly **Web Storage, IndexedDB, and Cache API data, not HTTP cookies**. `localStorage` is
persistent, origin-scoped key/value storage; IndexedDB is a browser database; Cache API stores request/response pairs,
commonly for service-worker/offline use. Their technical names do not determine their PECR treatment.
([MDN: `localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage),
[MDN: IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API),
[MDN: Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache))

## Storage found in this repository

| Storage and use                                                                                                                                                                                                                                 | Practical role                                                                                                             | Essential vs optional, as a product observation                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cookie-consent` in `localStorage` ([`useConsent.ts`](../src/lib/hooks/useConsent.ts))                                                                                                                                                          | Remembers analytics/functional choice and gates analytics loading. If storage fails, the current-visit choice still works. | Needed to retain a choice between visits and avoid asking again; analytics itself is optional. This is a consent record, not a functional cookie that provides the exercise. |
| `core-values-behaviour-attempts-v2` and legacy `core-values-scenario-attempts-v1` in `localStorage` ([`serviceSingleton.ts`](../src/lib/services/serviceSingleton.ts), [`attemptStorage.ts`](../src/lib/scenario-reflection/attemptStorage.ts)) | Stores reflection answers, notes, saved reminder settings, and attempt progress.                                           | Needed for the app’s save-and-return reflection feature; not merely a display preference. These records can contain personal content.                                        |
| Exercise sessions and rounds in IndexedDB ([`indexedDB` module](../src/lib/db/indexedDB.ts))                                                                                                                                                    | Persists saved exercise work and supports history/replay.                                                                  | Needed for the save/history/replay features users choose to use; core exercise use may still be possible without retaining it.                                               |
| `show-instructions` in `localStorage` ([`HelpPage.tsx`](../src/personal/HelpPage.tsx))                                                                                                                                                          | Remembers whether instructions should appear automatically.                                                                | Optional convenience; default behavior works without the saved choice.                                                                                                       |
| `pwa-prompt-dismissed` in `localStorage` ([`PWAPrompt`](../src/components/common/PWAPrompt/index.tsx))                                                                                                                                          | Suppresses a dismissed install prompt.                                                                                     | Optional convenience; install and ordinary site use do not depend on it.                                                                                                     |
| `app-version` in `localStorage` ([`exercise/page.tsx`](../src/app/exercise/page.tsx))                                                                                                                                                           | Detects a version change and triggers a reload/cache refresh.                                                              | Operational update marker; not a visitor preference.                                                                                                                         |
| Service-worker Cache API entries ([`worker/index.ts`](../src/lib/worker/index.ts), [`cacheUtils.ts`](../src/lib/utils/storage/cacheUtils.ts))                                                                                                   | Caches assets, API responses, and app data for offline/fast loading.                                                       | Supports offline access and performance; not a preference cookie. A fuller necessity assessment depends on how the offline service is presented/requested.                   |

## Cautions for product or legal review

- The app’s UI offers a “Functional preferences” consent option, but the inspected code does not make app features
  conditional on `consent.functional`; current observable behavior is the stored consent record, instruction preference,
  PWA prompt dismissal, saved exercise/reflection data, and offline caches. A label alone does not establish which use
  the choice covers.
- Avoid describing all browser storage as cookies. A notice can say “cookies or similar technologies” where that is
  accurate, while separately explaining that exercise content is saved in browser storage.
- This inventory is a code observation, not a legal classification. Confirm actual deployed behavior, third-party tags,
  storage lifetimes, and the exact service offered before deciding what is strictly necessary or how to present consent.

## Primary sources

- UK Parliament,
  [Privacy and Electronic Communications Regulations 2003, regulation 6](https://www.legislation.gov.uk/uksi/2003/2426/regulation/6).
- UK Information Commissioner’s Office,
  [Cookies and similar technologies](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/).
- MDN Web Docs, [Window: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage),
  [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API),
  [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache), and
  [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).
