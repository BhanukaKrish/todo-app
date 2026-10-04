# TODO App — Full-stack take-home

A small but production-shaped TODO app: **React + Tailwind CSS + shadcn/ui** on the front, **NestJS + MongoDB (Mongoose)** on the back, in a **pnpm + Turborepo** monorepo.

| Feature | Where |
| --- | --- |
| View, create, edit, toggle and delete TODOs | `apps/web`, `apps/api` |
| Client + server validation sharing the same limits | `packages/shared` |
| Optimistic UI with automatic rollback and error toasts | `apps/web/src/hooks/use-todos.ts` |
| Loading skeletons, empty states, retryable error state | `apps/web/src/components/organisms/todo-list.tsx` |
| Filters (All / Active / Completed), progress bar, dark mode, keyboard shortcut (⌘/Ctrl + Enter) | `apps/web` |
| Unit and e2e tests (e2e runs against an in-memory MongoDB) | `apps/api/test`, `apps/web/src/lib/*.test.ts` |

## Repository layout

```
.
├── apps/
│   ├── api/          NestJS REST API (see apps/api/README.md)
│   └── web/          React + Vite SPA (see apps/web/README.md)
├── packages/
│   └── shared/       Types + validation limits shared by both apps
├── docker-compose.yml  Local MongoDB
└── turbo.json        Task pipeline (shared is built before the apps)
```

## Quick start

Prerequisites: **Node.js ≥ 20**, **pnpm ≥ 10** (`corepack enable`), and **Docker** (or a MongoDB Atlas URI).

```bash
pnpm install
pnpm db:up          # starts MongoDB 7 on localhost:27017 (docker compose)
pnpm dev            # builds @todo/shared, then runs the API (:3000) and web app (:5173)
```

Open http://localhost:5173. The Vite dev server proxies `/api` to the API, so no CORS setup is needed locally.

No `.env` files are required for the defaults above. To use Atlas or different ports, copy `apps/api/.env.example` to `apps/api/.env` (and optionally `apps/web/.env.example` to `apps/web/.env`).

## Scripts (run from the repo root)

| Command | What it does |
| --- | --- |
| `pnpm dev` | Watch mode for every package |
| `pnpm build` | Production build of all packages |
| `pnpm test` | API unit + e2e tests and web unit tests |
| `pnpm lint` / `pnpm typecheck` | Static checks across the workspace |
| `pnpm db:up` / `pnpm db:down` | Start / stop the local MongoDB container |

## API

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/todos` | List all TODOs (newest first) |
| POST | `/todos` | Create a TODO `{ title, description? }` |
| PUT | `/todos/:id` | Update title and/or description |
| PATCH | `/todos/:id/done` | Toggle the done status |
| DELETE | `/todos/:id` | Delete a TODO (204) |
| GET | `/health` | Liveness + database status |

Every error response uses the same body: `{ statusCode, message, errors? }`.

## Key decisions

- **NestJS instead of Express.** It's still Express under the hood, but it gives modules, DI, DTO validation and exception filters out of the box, which keeps the API small and well structured.
- **Shared package.** `@todo/shared` holds the `Todo` contract and the title/description length limits, so the class-validator DTOs and the zod form schema can't drift apart.
- **Atomic design on the frontend.** Components are split into atoms → molecules → organisms → templates → pages (details in `apps/web/README.md`).
- **TanStack Query for server state.** Every mutation updates the cache optimistically, rolls back on failure with a toast, and resyncs with the server once the last in-flight mutation settles.
- **Atomic toggle.** `PATCH /done` flips the flag with a MongoDB update pipeline (`$not: '$done'`), so two quick clicks can't race each other.

## Assumptions and limitations

- Single user, no authentication or authorisation.
- No pagination: the full list is returned, which is fine for a personal TODO list but would need cursor pagination at scale.
- Last write wins on concurrent edits from different tabs (there's no versioning or conflict detection).
