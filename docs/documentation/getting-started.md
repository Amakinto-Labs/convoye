# Getting Started with Convoye

## Prerequisites

- **Node.js** 20 or later
- **PostgreSQL** (local instance or hosted)
- **GitHub account** with repository access

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-org/convoye.git
cd convoye
```

### 2. Install dependencies

```bash
npm install
```

This installs dependencies for all apps and packages in the monorepo.

### 3. Configure environment variables

Copy the example environment file and fill in your values:

```bash
cp apps/api/.env.example apps/api/.env
```

Required variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/convoye
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
BETTER_AUTH_SECRET=a_random_secret_string
```

### 4. Set up the database

Run migrations to create the database schema:

```bash
cd packages/db
npx drizzle-kit migrate
```

### 5. Start development servers

From the repository root:

```bash
npx turbo dev
```

This starts both the API server and the web frontend:

- **API**: http://localhost:3000
- **Web**: http://localhost:5173

## First Pipeline

### Connect GitHub

1. Open the web app and sign in.
2. Go to **Settings > Git Providers**.
3. Click **Connect GitHub** and complete the OAuth flow.

### Select a Repository

1. Go to **Projects > New Project**.
2. Select a repository from your connected GitHub account.
3. Give the project a name and confirm.

### Build Your Pipeline

1. Open the project and click **Pipeline Builder**.
2. Drag environment nodes onto the canvas (e.g., Development, Staging, Production).
3. Draw edges between environments to define promotion paths.
4. Click each environment node to configure:
   - Branch name (e.g., `develop`, `staging`, `main`)
   - Deploy target (Railway, Vercel, or webhook)
   - Auto-deploy and reviewer settings
5. Save the pipeline.

### Promote a Feature

1. Push a feature branch to your repository.
2. Open the **Dashboard** -- Convoye detects the new branch automatically.
3. Find the feature card and click **Promote**.
4. Convoye creates a promotion branch, checks for conflicts, and opens a PR.
5. Merge the PR to deploy to the target environment.

## Project Structure

```
convoye/
├── apps/
│   ├── api/          # Hono API server
│   ├── web/          # React frontend with pipeline canvas
│   └── website/      # Marketing site
├── packages/
│   ├── shared/       # Shared types and utilities
│   └── db/           # Drizzle schema and migrations
├── turbo.json        # Turborepo configuration
└── package.json      # Root package with workspaces
```

## Useful Commands

| Command               | Description                          |
| --------------------- | ------------------------------------ |
| `npx turbo dev`       | Start all dev servers                |
| `npx turbo build`     | Build all apps and packages          |
| `npx turbo lint`      | Lint all apps and packages           |
| `npx drizzle-kit migrate` | Run database migrations         |
| `npx drizzle-kit studio`  | Open Drizzle Studio (DB browser) |
