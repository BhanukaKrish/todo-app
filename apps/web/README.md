# @todo/web — Frontend

React 19 single-page app built with **Vite**, **Tailwind CSS v4** and **shadcn/ui** (Radix primitives), organised using **Atomic Design**.

## Setup and run

From the **repo root**:

```bash
pnpm install
pnpm dev                     # runs the API and the web app together
# or only the frontend (expects the API on :3000):
pnpm --filter @todo/shared build && pnpm --filter @todo/web dev
```

Open http://localhost:5173.

| Command | Description |
| --- | --- |
| `pnpm --filter @todo/web dev` | Dev server with HMR |
| `pnpm --filter @todo/web build` | Type-check and build to `dist/` |
| `pnpm --filter @todo/web preview` | Serve the production build |
| `pnpm --filter @todo/web test` | Unit tests (Vitest) |
| `pnpm --filter @todo/web lint` | oxlint |

### Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_URL` | `/api` | API base URL baked into the build. Set it when the API is on another origin, e.g. `https://api.example.com/api`. |
| `VITE_API_PROXY_TARGET` | `http://localhost:3000` | Dev only: where the Vite proxy forwards `/api`. |

In development, `/api` is proxied to the API, so CORS never comes into play.

## Architecture

### Atomic Design

```
src/
├── components/
│   ├── atoms/        Smallest building blocks: shadcn/ui primitives (button, input, checkbox, dialog…) + spinner
│   ├── molecules/    Small compositions: form-field, empty-state, error-state, confirm-dialog, theme-toggle, todo-filter-tabs
│   ├── organisms/    Feature sections: todo-form, create-todo-card, todo-item, edit-todo-dialog, todo-list, todo-toolbar, app-header
│   └── templates/    Page layout without data: todo-template (header / aside / content slots)
├── pages/            todos-page: wires data hooks into the template and organisms
├── hooks/            use-todos (TanStack Query + optimistic updates), use-theme
├── services/         todos.service: typed HTTP calls, one function per endpoint
├── lib/              api-client (fetch wrapper + ApiError), zod form schema, utils
└── app/              Providers (QueryClient, Toaster)
```

Rules that keep the layers honest:

- Each layer only imports from layers below it (atoms ← molecules ← organisms ← templates ← pages).
- Atoms, molecules, organisms and templates are presentational: they get data and callbacks through props. Only **pages** talk to the data hooks.
- `components.json` sets shadcn's `ui` alias to `@/components/atoms`, so `pnpm dlx shadcn add <component>` drops new primitives straight into the atoms layer.

### Data flow

`todos-page` → `use-todos` hooks → `todos.service` → `api-client` → API.

- **Optimistic updates:** create, edit, toggle and delete patch the TanStack Query cache immediately. If the request fails, the previous snapshot is restored and an error toast explains what happened. A new todo appears instantly with a temporary id and a "Saving…" state, and its actions unlock as soon as the server responds.
- **Consistency:** the list is refetched once the *last* in-flight mutation settles, so a refetch never overwrites another mutation's optimistic state.
- **Errors:** `api-client` turns network failures and API error bodies into an `ApiError` with a human-readable message. 4xx responses aren't retried; network and 5xx errors are retried twice.

### UX details

- Form validation with react-hook-form + zod, using the same length limits as the API (`@todo/shared`), with live character counters
- ⌘/Ctrl + Enter submits the create and edit forms
- Completed todos are struck through and faded, and a progress bar tracks completion
- All / Active / Completed filters with counts, and a contextual empty state for each
- Skeleton loading state, a retryable error state, and toast notifications
- Delete asks for confirmation; edit opens in a dialog
- Light and dark themes (follows the system by default, persisted in `localStorage`, no flash on load)
- Enter animations and transitions, a responsive two-column layout that stacks on mobile, and accessible labels on icon buttons

## Assumptions and limitations

- Single page, so there's no router.
- Lists are rendered without virtualisation, which is fine for hundreds of items.
- Removed items disappear without an exit animation.
- No offline queue: when the API is unreachable, mutations roll back and tell the user rather than retrying later.
