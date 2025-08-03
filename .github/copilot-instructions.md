# GitHub Copilot Instructions for Vite + React + TypeScript Project

## 🧠 General Principles

Copilot should:

- Generate clean, maintainable TypeScript React code
- Use modern React (hooks, functional components)
- Align with Vite conventions (ESM, fast dev cycle, modular build)
- Avoid unnecessary abstractions or boilerplate
- Prioritise simplicity, composability, and accessibility

---

## ⚙️ Tech Stack & Tooling

- **Framework:** React 19+ (Functional Components only)
- **Language:** TypeScript with strict mode
- **Bundler/Dev Server:** Vite
- **Styling:** Tailwind CSS (mobile-first, utility classes only)
- **Animations:** Framer Motion (for card transitions and interactivity)
- **Persistence:** IndexedDB (via custom hook)
- **Testing:** Vitest + React Testing Library
- **PWA Support:** Future integration using `vite-plugin-pwa`
- **ESLint + Prettier:** Enforce clean code formatting and standards

---

## 📁 Project Structure Conventions

Copilot should suggest files and folders using this layout:

```
src/
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks (e.g. useSessionStore)
├── utils/              # Pure functions and helpers
├── data/               # Static JSON files (personal-values.json, etc.)
├── types/              # Type definitions (e.g. ValueCard)
├── styles/             # Tailwind base (imported via index.css)
├── App.tsx             # Root component
└── main.tsx            # Vite entry point
```

---

## 💡 Coding Guidelines

### React Components

- Use `function` components with named exports
- Type props using `interface` or `type` (avoid `any`)
- Prefer destructured props
- Use Tailwind utility classes for layout/styling
- All components should be **accessible**, keyboard-navigable, and mobile-friendly

### Hooks

- Prefix all custom hooks with `use`
- Extract shared logic from components into hooks (e.g., persistence, animation)
- Type return values explicitly

### Testing

- Write tests using **Vitest + React Testing Library**
- Focus on behaviour, not implementation
- Test edge cases, error states, and keyboard navigation
- Prefer @testing-library/react for rendering components.
- Always write tests for new features and refactors.
- Do not use Enzyme or Jest (unless absolutely necessary).

---

## ⛔ Anti-Patterns

Copilot should **never** suggest the following:

- ❌ Class components
- ❌ Redux, Zustand, MobX, or external state libraries
- ❌ Create React App or Next.js boilerplate
- ❌ jQuery or imperative DOM manipulation
- ❌ Inline styles (use Tailwind instead)
- ❌ Adding external UI libraries like MUI or Bootstrap

---

## ✅ Preferred Patterns

| Pattern                 | Example                                     |
| ----------------------- | ------------------------------------------- |
| Functional Components   | `function Card(props: CardProps) { ... }`   |
| Composition over config | `<Column><Card /></Column>`                 |
| Custom Hooks            | `useSessionStore`, `useDragAndDrop`         |
| Utility Functions       | `exportToJson(data)`                        |
| CSS via Tailwind        | `className="flex gap-2 p-4 rounded shadow"` |
| Lazy Imports            | `const Settings = lazy(() => import(...))`  |
| Environment Variables   | `import.meta.env.VITE_API_URL`              |

---

## 🔧 Vite + Dev Workflow

- Use `@vitejs/plugin-react`
- Support `.env` variables prefixed with `VITE_`
- Dev server runs at port `5173`
- Use aliases like `@components`, `@hooks`, `@utils` in `vite.config.ts`
- Use Hot Module Replacement (HMR) during development

---

## 🧪 Vitest Testing Guidance

- All new components and features must include tests
- Tests must include:
  - Edge case coverage
  - Error handling
  - Keyboard interaction (where applicable)
- Never modify implementation to make testing easier

---

## 📦 Build & Deploy

- Use `vite build` with TypeScript compilation
- Build output goes to `dist/`
- GitHub Pages deployment supported (static files only)
- Do not generate SSR or dynamic routes

---

## ✅ Good Prompt Examples for Copilot

Copilot should respond well to prompts like:

```tsx
// Component for a draggable card with Framer Motion
```

```ts
// Hook to persist board state in IndexedDB
```

```ts
// Utility to export current card layout to JSON
```

```tsx
// Keyboard-navigable column with accessible drop zones
```

```ts
// Test to verify drag-and-drop moves cards between categories
```

---

## 🧱 Future Considerations (Ignore for Now)

Copilot should **not** suggest or implement:

- Supabase integration (TBD)
- Multi-user collaboration
- Authentication or login systems
- Server APIs or backend logic
- Server-side rendering

These will be added in later design phases.

---

## Summary

Copilot is expected to:

- Adhere to modern React + Vite + TypeScript best practices
- Use Tailwind and Framer Motion for layout and interactivity
- Generate clean, accessible, composable components
- Avoid unnecessary abstraction or libraries
- Focus on developer clarity, minimalism, and testing
