# @todo/api — Backend

REST API for the TODO app, built with **NestJS 12**, **Mongoose 9** and **MongoDB**.

## Setup and run

From the **repo root**:

```bash
pnpm install
pnpm db:up                         # MongoDB via docker compose (localhost:27017)
pnpm --filter @todo/shared build   # the API imports shared types/limits
pnpm --filter @todo/api dev        # http://localhost:3000/api
```

`pnpm dev` at the root does the shared build and starts both apps for you.

Production build:

```bash
pnpm --filter @todo/api build
pnpm --filter @todo/api start:prod
```

## Configuration

Environment variables are validated on startup (`src/config/env.validation.ts`). The app refuses to boot with an invalid value. Defaults work out of the box, and you can override them in `apps/api/.env` (see `.env.example`):

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port |
| `MONGODB_URI` | `mongodb://localhost:27017/todos` | MongoDB connection string |
| `CORS_ORIGIN` | `http://localhost:5173` | Comma-separated list of allowed origins |

## MongoDB connection notes

- **Local (recommended for review):** `pnpm db:up` runs `mongo:7` from `docker-compose.yml`, with data in a named volume (`mongo-data`). `pnpm db:down` stops it. Add `-v` to also delete the data.
- **Local install without Docker:** start `mongod` and keep the default URI.
- **MongoDB Atlas:** create a free cluster, add your IP to the network access list, create a database user, then set
  `MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/todos?retryWrites=true&w=majority`.
- Server selection times out after 5 s, so a wrong URI fails fast instead of hanging. `GET /api/health` reports `database: "up" | "down"`.

## Endpoints

| Method | Endpoint | Body | Success |
| --- | --- | --- | --- |
| GET | `/api/todos` | — | `200 Todo[]` (newest first) |
| POST | `/api/todos` | `{ title, description? }` | `201 Todo` |
| PUT | `/api/todos/:id` | `{ title?, description? }` | `200 Todo` |
| PATCH | `/api/todos/:id/done` | — | `200 Todo` (done flipped) |
| DELETE | `/api/todos/:id` | — | `204` |
| GET | `/api/health` | — | `200 { status, database }` |

`Todo` = `{ id, title, description?, done, createdAt, updatedAt }`.

Errors always look like `{ "statusCode": 400, "message": "Title is required", "errors": ["Title is required"] }`:

- `400`: validation failure, unknown body fields, or a malformed id
- `404`: the todo doesn't exist
- `500`: unexpected error (details are logged, never leaked)

## Project structure

```
src/
├── main.ts                     Bootstrap: CORS, shutdown hooks, port
├── app.setup.ts                Global prefix, ValidationPipe, exception filter (shared with e2e tests)
├── app.module.ts               Config + Mongoose wiring
├── app.controller.ts           /api/health
├── config/env.validation.ts    Typed, validated environment
├── common/filters/             AllExceptionsFilter → consistent error body
└── todos/
    ├── todos.module.ts
    ├── todos.controller.ts     HTTP layer only (routing, id validation, status codes)
    ├── todos.service.ts        Data access and business rules
    ├── schemas/todo.schema.ts  Mongoose schema (timestamps, `id` instead of `_id`)
    └── dto/                    class-validator DTOs (trimmed, length-limited)
```

## Tests

```bash
pnpm --filter @todo/api test        # unit + e2e
pnpm --filter @todo/api test:unit
pnpm --filter @todo/api test:e2e
```

The e2e suite boots the real `AppModule` against **mongodb-memory-server**, so no running database is needed. The first run downloads a `mongod` binary.

## Assumptions and limitations

- No authentication; every todo belongs to a single anonymous user.
- `GET /todos` is unpaginated.
- `PUT` is a partial update (only provided fields change), matching the "title and/or description" requirement. Sending `description: ""` clears it.
- The toggle uses a MongoDB update pipeline, which requires MongoDB ≥ 4.2.
