# Repository Guidelines

## Project Structure & Module Organization
- `app/` hosts the Next.js App Router routes; top-level pages like `app/page.tsx` render shared UI primitives (`CreateThreadButton`, `ThreadList`).
- `app/threads/[id]/` contains the thread detail route, keeping feature-specific layouts colocated with their server components.
- `app/lib/` centralizes cross-cutting utilities including database access (`db.ts`), Drizzle schema definitions, typing helpers, and shared rate limiting logic.
- `app/api/` exposes route handlers that back the UI fetches; mirror UI feature names when adding endpoints.
- `public/` holds static assets, and `components/` (workspace root) is available for reusable building blocks that should not depend on Next.js server modules.

## Build, Test, and Development Commands
- `npm run dev` starts the Next.js dev server with hot reloading at `http://localhost:3000`.
- `npm run build` compiles production assets; run after significant dependency or schema changes to catch build-time issues.
- `npm run start` serves the prebuilt app; use this to verify deployment parity locally.
- `npm run lint` runs `next lint` with the repo ESLint rules; execute before every push.

## Coding Style & Naming Conventions
- Use TypeScript throughout; favor explicit return types for exported functions in `app/lib` and API handlers.
- Components live in PascalCase files (e.g., `thread-list.tsx` exports `ThreadList`); hooks and utilities stay camelCase.
- Follow the existing Tailwind-first styling approach; group utility classes logically from layout → spacing → color.
- Maintain 2-space indentation and run ESLint autofix (`npm run lint -- --fix`) to align with the project config.

## Testing Guidelines
- No automated tests are committed yet; introduce new suites alongside features using `.test.ts`/`.test.tsx` naming under the relevant directory.
- Prefer React Testing Library for client components and mocked fetch handlers for server actions.
- Target at least smoke coverage for new API routes to verify database interactions with Drizzle models.

## Commit & Pull Request Guidelines
- Existing history uses Conventional Commit prefixes (e.g., `feat:`); continue with `type(scope): summary` to keep changelogs stable.
- Keep commits focused: UI tweak, schema change, and seed data should be separate logical units.
- Pull requests must outline motivation, key changes, testing evidence (`npm run build`/`lint`), and reference related issues.
- Include screenshots or terminal output when UI or DX changes are not obvious from diff context.
