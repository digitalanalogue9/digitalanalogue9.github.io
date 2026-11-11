# Coding standards

Use these standards for new and changed code. Existing code is not necessarily a precedent; improve it when relevant to
the change. For domain language, use [GLOSSARY.md](GLOSSARY.md); for interface design, use [DESIGN.md](DESIGN.md).

## Structure and types

- Keep route composition in `src/app` and `src/router.tsx`, reusable UI in `src/components`, and shared domain,
  persistence, and service logic in `src/lib`. Place feature-specific code with its feature until it has a shared use.
- Keep business rules independent of React and browser storage where practical. Use the existing contracts, domain
  functions, services, and repository boundaries instead of duplicating rules in components.
- Name components and types in PascalCase, hooks with a `use` prefix, and functions and variables in camelCase. Use
  domain terms from the glossary and names that describe behaviour.
- Preserve TypeScript's strict checks. Model expected states explicitly, validate data at external boundaries, and avoid
  weakening types to bypass errors. Use the configured `@/` alias or a clear relative import consistently with nearby
  code.

## Data and browser behaviour

- Treat session and reflection data as personal. Keep it in the existing browser-side storage and export flows; avoid
  sending it to analytics, logs, or external services without an explicit product decision and appropriate consent.
- Validate imported and persisted data before relying on it. Changes to IndexedDB schemas, stored contracts, or backup
  formats must account for existing records, migration, and import/export compatibility, with tests for affected paths.
- Preserve direct navigation, refresh, and offline behaviour when changing routes or PWA assets. The production build
  generates Pages routing and metadata artifacts; validate those artifacts when changing the build or routing.

## UI and accessibility

- Follow the existing design tokens, components, and responsive patterns described in `DESIGN.md`. Use semantic HTML,
  accessible names, visible focus, and keyboard-operable controls; provide alternatives to drag-and-drop interactions.
- Respect reduced-motion preferences when adding animation. Check relevant narrow and wide layouts and loading, empty,
  error, and disabled states when they are affected.

## Tests and verification

- Use test-driven development for behaviour changes: first demonstrate the missing behaviour or regression with a
  failing test, then implement it. Choose the lowest level that demonstrates the behaviour: Vitest for domain, service,
  and component behaviour; Playwright for browser journeys and platform integration.
- Test observable outcomes and meaningful edge cases, including migrations and invalid imports where relevant. Keep
  tests independent and clean up browser storage, mocks, and other shared state.
- Run relevant tests during each implementation increment and before committing. Preserve failing tests and investigate
  failures rather than removing them or skipping verification.
- Before submitting changes, run the checks appropriate to the change. The full CI sequence is defined in
  [pages.yml](.github/workflows/pages.yml), including formatting, type checking, lint, coverage, production build, Pages
  artifact validation, and Playwright journeys with the reflection feature disabled and enabled.
- Use `pnpm` and the versions declared in `package.json`. `pnpm check` runs type checking, lint, and unit tests;
  `pnpm format:check` checks changed files. Run targeted tests during development and report checks not run.

## Tooling and changes

- Let the repository's ESLint, TypeScript, and Prettier configuration define mechanical rules. Format changed files and
  keep unrelated formatting churn out of behaviour changes.
- Review changes for correctness, readability, architecture, security, and performance.
- Keep secrets out of source control. Document new build-time configuration in `.env.example`; client-side environment
  variables are public in the built site.
- Prefer small, reviewable changes. Add dependencies only when they solve a demonstrated need, and keep the lockfile in
  sync.
- Obtain the user's approval before database schema changes or adding dependencies unless the requested work already
  authorises them.
