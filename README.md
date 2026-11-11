# Core Values

Core Values helps people identify and prioritise their values through a card-sorting exercise and guided reflection. It
also offers a team-focused card set for use together in a facilitated conversation.

Exercises and notes are stored in the browser. History supports resuming, replaying, exporting and importing saved work.
The app supports offline use; optional Google Analytics loads only with consent. See the site's privacy page for details
about storage, backups and analytics.

## Getting started

Requirements: Node.js 22.19.0 or later and pnpm 10.33.2. CI uses those versions.

```bash
git clone https://github.com/digitalanalogue9/digitalanalogue9.github.io.git
cd digitalanalogue9.github.io
pnpm install --frozen-lockfile
pnpm dev
```

Open the URL printed by Vite. To build and preview the production site:

```bash
pnpm build
pnpm preview
```

## Configuration

Copy `.env.example` to `.env.local` to customise local settings. The example documents
`VITE_ENABLE_BEHAVIOUR_REFLECTION`: set it to `true` to enable the behaviour reflection tool and its links. It is
disabled when unset or set to `false`. Vite environment values are included at build time; rebuild after changing them
for a production preview. Client-side values are public and must not contain secrets.

`VITE_ENABLE_REFLECTION_FIRST_RESULTS` controls the reflection-first results view; it is enabled unless set to `false`.
The metadata generation scripts use `VITE_SITE_URL`, defaulting to `https://core-values.me`, when supplied in the
process environment. The current router supplies the Google Analytics measurement ID in code; analytics is subject to
the visitor's consent.

## Development

The app uses React, TypeScript, Vite, React Router, Tailwind CSS, IndexedDB and a service worker for offline support.

- `src/router.tsx` defines routes and the shared layout; `src/app` contains exercise pages and flows.
- `src/components` contains shared and feature components; `src/lib` contains domain logic, services and storage.
- `src/personal` contains public information pages; `src/styles` contains shared styles.
- `tests` contains Vitest and Playwright tests; `scripts` contains build and validation utilities.

See [CODING_STANDARDS.md](CODING_STANDARDS.md), [DESIGN.md](DESIGN.md) and [GLOSSARY.md](GLOSSARY.md) for project
conventions, design guidance and domain language.

## Checks

```bash
pnpm check                  # Typecheck, lint and Vitest
pnpm check:ci               # Run the Pages workflow checks locally
pnpm format:check           # Check the latest commit and uncommitted files
pnpm test:coverage          # Vitest with coverage
pnpm build                  # Production build and Pages route artifacts
pnpm validate:pages-artifact
pnpm exec playwright install chromium
pnpm test:e2e               # Playwright browser journeys
```

The [Pages workflow](.github/workflows/pages.yml) defines the full CI checks, including Playwright runs with behaviour
reflection disabled and enabled. Outside CI, Playwright builds and serves the site unless it finds a server already
running on its configured port.

Before pushing, use `pnpm check:ci` to run the same validation sequence as GitHub, including both production builds.
Install the Playwright Chromium browser first. GitHub uses Node 22.19.0 and pnpm 10.33.2; use those versions locally for
the closest match. The command requires port 5173 to be free. On a pull request, the formatting check compares the whole
branch against its target; locally it checks the latest commit and uncommitted files. To check a whole branch locally in
PowerShell, set `$env:GITHUB_BASE_REF = 'main'` before running it and remove that variable afterwards.

## Contributing

Create a branch for your change, run the relevant checks, and open a pull request. Describe the behaviour changed and
the checks performed. For questions or feedback, use the contact details on the site's Contact page.

## Licence

This project is licensed under the [MIT License](LICENSE). Third-party assets may carry their own licences.
