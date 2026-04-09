# Convoye Architecture Overview

## Monorepo Structure

Convoye uses Turborepo to manage a monorepo with the following structure:

```
convoye/
├── apps/
│   ├── web/          # Vite + React frontend (pipeline builder, dashboard)
│   ├── api/          # Hono API server
│   └── website/      # Marketing/landing page site
├── packages/
│   ├── shared/       # Shared types, utilities, constants
│   └── db/           # Drizzle ORM schema, migrations, database client
├── turbo.json
└── package.json
```

## Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| API          | Hono (lightweight, edge-ready)          |
| Frontend     | Vite + React                            |
| Canvas       | @xyflow/react (React Flow)              |
| State        | Zustand (canvas and app state)          |
| Database     | PostgreSQL + Drizzle ORM                |
| Auth         | Better Auth                             |
| Monorepo     | Turborepo                               |

## System Diagram

```
                         ┌──────────────┐
                         │     User     │
                         └──────┬───────┘
                                │
                         ┌──────▼───────┐
                         │   Web App    │
                         │  (React +    │
                         │  React Flow) │
                         └──────┬───────┘
                                │
                         ┌──────▼───────┐
                         │   Hono API   │
                         │              │
                         └──┬───┬───┬───┘
                            │   │   │
               ┌────────────┘   │   └────────────┐
               │                │                │
        ┌──────▼──────┐ ┌──────▼──────┐ ┌───────▼─────┐
        │  GitHub API  │ │ Railway API │ │ Vercel API  │
        │  (Git ops,   │ │ (Deploy)    │ │ (Deploy)    │
        │   PRs,       │ └─────────────┘ └─────────────┘
        │   webhooks)  │
        └──────────────┘
               │
        ┌──────▼──────┐
        │ Environments │
        │ (staging,    │
        │  production) │
        └──────────────┘
```

## Data Flow

### Pipeline Configuration

1. User builds a pipeline on the React Flow canvas (environments as nodes, promotion paths as edges).
2. Canvas state is managed by Zustand and persisted to PostgreSQL via the API.
3. The API generates a `convoye.yml` configuration file committed to the repository root.
4. `convoye.yml` serves as the declarative source of truth for CI/CD tooling.

### Promotion Flow

1. User triggers a promotion from the dashboard or feature card.
2. API creates a promotion branch (`promote/<feature>_-_<env>`) via GitHub API.
3. Target environment branch is merged INTO the promotion branch for conflict detection.
4. If clean, a PR is opened from promotion branch to environment branch.
5. On PR merge, the API triggers deployment to the configured deploy target.
6. All promotion events are recorded in the database as an audit trail.

### Data Storage

```
PostgreSQL
├── pipelines          # Pipeline definitions (nodes, edges, config)
├── environments       # Environment configuration per pipeline
├── features           # Tracked feature branches and their positions
├── promotions         # Promotion history with status and audit trail
├── deploy_targets     # Connected Railway/Vercel/webhook configs
├── projects           # Connected repositories
└── users / sessions   # Better Auth managed tables
```

## Key Design Decisions

### Promotion Branch Pattern

Instead of merging feature branches directly into environment branches, Convoye creates an intermediate promotion branch (`promote/<feature>_-_<env>`). This isolates conflict detection from both the feature branch and the target environment branch. The feature branch remains clean and untouched throughout the entire promotion lifecycle.

### Zustand for Canvas State

React Flow requires tight control over node/edge state with frequent updates during drag-and-drop interactions. Zustand provides a lightweight, subscription-based store that avoids unnecessary re-renders and integrates cleanly with React Flow's controlled mode.

### Hono for API

Hono was chosen for its minimal footprint, Web Standard API compatibility, and strong TypeScript support. It runs efficiently in Node.js for development and can be deployed to edge runtimes if needed.

### Drizzle ORM

Drizzle provides type-safe SQL with a schema-as-code approach that fits the monorepo model. The schema lives in `packages/db` and is shared across the API and any tooling that needs database access.
