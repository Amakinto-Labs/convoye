# FR-003: Dashboard

The dashboard provides a real-time view of all features flowing through the pipeline. It shows environment lanes with feature cards and their current status.

## Requirements

- [ ] **FR-003.1**: Dashboard shows pipeline with environment lanes
- [ ] **FR-003.2**: Features displayed as cards in their current environment lane
- [ ] **FR-003.3**: Real-time status updates (deploying, deployed, failed, conflict)
- [ ] **FR-003.4**: Click feature card shows full promotion history and audit trail
- [ ] **FR-003.5**: Filter features by author, status, date range
- [ ] **FR-003.6**: Promote button available on each feature card

## Details

### FR-003.1: Environment Lanes

The dashboard renders the pipeline as horizontal or vertical lanes, one per environment. Lanes are ordered according to the pipeline's promotion flow (e.g., Development -> Staging -> Production). Non-linear pipelines show branching lanes.

### FR-003.2: Feature Cards

Each tracked feature branch appears as a card in the lane corresponding to its current environment position. Cards display:
- Feature/branch name
- Author
- Current status indicator
- Time in current environment

### FR-003.3: Real-Time Status

Feature cards update in real time to reflect their current state:
- **Pending**: Awaiting promotion
- **Promoting**: Promotion branch created, PR in progress
- **Conflict**: Merge conflict detected on promotion branch
- **Deploying**: PR merged, deployment in progress
- **Deployed**: Deployment successful
- **Failed**: Deployment or promotion failed

Status updates are pushed via polling or WebSocket connection.

### FR-003.4: Promotion History

Clicking a feature card opens a detail panel showing:
- Full promotion history (which environments, when, by whom)
- Associated PRs and their status
- Deployment logs and results
- Conflict resolution history
- Complete audit trail of all actions taken on this feature

### FR-003.5: Filtering

The dashboard supports filtering features by:
- **Author**: Show only features created by a specific user
- **Status**: Show only features in a specific state (e.g., only conflicts)
- **Date range**: Show features active within a time window

### FR-003.6: Promote Action

Each feature card includes a promote button when the feature is eligible for promotion to the next environment. The button is disabled when:
- The feature is already at the final environment
- A promotion is currently in progress
- Required conditions (tests, approvals) are not met
