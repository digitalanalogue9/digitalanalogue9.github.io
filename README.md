# Core Values App

**A Vite + React + TypeScript web application that helps individuals and teams discover their core values through an interactive card‑sorting exercise.**

## Why it exists
- Clarifies personal priorities
- Builds team cohesion
- Fosters values‑driven culture

## How it works (short version)
1. Start with 35 value cards.
2. Sort each card into importance columns across multiple rounds.
3. Discard “Not Important” cards at the end of every round.
4. Columns shrink as cards diminish, forcing sharper choices.
5. Finish when your **Very Important** column equals the target number (default 10).

## Tech Highlights
| Area | Choice |
|------|--------|
| Framework | React 18 (hooks) |
| Build tool | Vite |
| Language | TypeScript 5 |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Persistence | IndexedDB (local‑first) |
| Testing | Vitest + React Testing Library |

## Getting Started
```bash
npm install
npm run dev
```

## Contributing
1. Read `.github/copilot-instructions.md` for coding conventions.
2. Create feature branches off `vite-rebuild`.
3. Ensure `npm run lint` and `npm run test` pass.
4. Open a PR.

## Roadmap
See [`docs/feature-roadmap.md`](docs/feature-roadmap.md).

## License
MIT
