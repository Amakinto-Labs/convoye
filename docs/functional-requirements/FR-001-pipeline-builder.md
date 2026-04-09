# FR-001: Pipeline Builder

The pipeline builder allows users to visually design deployment pipelines using a drag-and-drop canvas. Each pipeline defines the environments code flows through and the promotion paths between them.

## Requirements

- [ ] **FR-001.1**: User can create a new pipeline for a project
- [ ] **FR-001.2**: User can add environment nodes to canvas via drag-and-drop
- [ ] **FR-001.3**: User can connect environments with promotion path edges
- [ ] **FR-001.4**: User can configure each environment: name, branch, deploy target, auto-deploy, required reviewers
- [ ] **FR-001.5**: User can configure promotion paths: require tests, require approval
- [ ] **FR-001.6**: Pipeline supports non-linear flows (one source to multiple targets)
- [ ] **FR-001.7**: Pipeline state persists to database and can be reloaded
- [ ] **FR-001.8**: Pipeline generates convoye.yml configuration file

## Details

### FR-001.1: Create Pipeline

A pipeline belongs to a project (connected repository). Users create a pipeline from the project settings or dashboard. A project can have one active pipeline at a time.

### FR-001.2: Add Environment Nodes

The canvas sidebar lists available environment types. Users drag an environment onto the React Flow canvas to add it. Each node represents a deployment environment (e.g., development, staging, production).

### FR-001.3: Connect Environments

Users draw edges between environment nodes to define promotion paths. An edge from "staging" to "production" means code can be promoted from staging to production. Edges are directional.

### FR-001.4: Configure Environments

Each environment node has a configuration panel with:
- **Name**: Display name for the environment
- **Branch**: Git branch this environment tracks (e.g., `main`, `staging`)
- **Deploy target**: Which deployment platform to use (Railway, Vercel, webhook)
- **Auto-deploy**: Whether merges to the branch automatically trigger deployment
- **Required reviewers**: Number of PR approvals required before merge

### FR-001.5: Configure Promotion Paths

Each edge (promotion path) can be configured with:
- **Require tests**: PR checks must pass before merge is allowed
- **Require approval**: Human approval required before promotion proceeds

### FR-001.6: Non-Linear Flows

Pipelines are not limited to linear chains. A single environment can promote to multiple targets (e.g., staging promotes to both production-us and production-eu). The canvas supports any directed acyclic graph structure.

### FR-001.7: Persistence

Pipeline state (nodes, edges, positions, configurations) is saved to PostgreSQL via the API. When a user returns to the pipeline builder, the canvas reloads the saved state exactly as it was left.

### FR-001.8: Generate convoye.yml

When the pipeline is saved, the API generates a `convoye.yml` file representing the pipeline configuration. This file is committed to the repository root and serves as a declarative reference for the pipeline structure.
