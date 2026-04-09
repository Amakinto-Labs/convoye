# FR-002: Promotion Workflow ([#2](https://github.com/Amakinto-Labs/convoye/issues/2))

The promotion workflow moves feature branches through pipeline environments using an intermediate promotion branch pattern. This ensures the feature branch remains clean while conflicts are detected and resolved before merging into the target environment.

## Requirements

- [ ] **FR-002.1** ([#15](https://github.com/Amakinto-Labs/convoye/issues/15)): System detects feature branches in connected repository
- [ ] **FR-002.2** ([#16](https://github.com/Amakinto-Labs/convoye/issues/16)): User can view all features and their current environment position
- [ ] **FR-002.3** ([#17](https://github.com/Amakinto-Labs/convoye/issues/17)): User can promote a feature to the next environment
- [ ] **FR-002.4** ([#18](https://github.com/Amakinto-Labs/convoye/issues/18)): Promotion creates a promotion branch (`promote/<feature>_-_<env>`)
- [ ] **FR-002.5** ([#19](https://github.com/Amakinto-Labs/convoye/issues/19)): System merges target environment branch INTO promotion branch for conflict detection
- [ ] **FR-002.6** ([#20](https://github.com/Amakinto-Labs/convoye/issues/20)): System shows conflicts if they exist, allows resolution
- [ ] **FR-002.7** ([#21](https://github.com/Amakinto-Labs/convoye/issues/21)): System opens PR from promotion branch to environment branch
- [ ] **FR-002.8** ([#22](https://github.com/Amakinto-Labs/convoye/issues/22)): On PR merge, system triggers deployment to target environment
- [ ] **FR-002.9** ([#23](https://github.com/Amakinto-Labs/convoye/issues/23)): Feature branch remains clean and untouched throughout promotion
- [ ] **FR-002.10** ([#24](https://github.com/Amakinto-Labs/convoye/issues/24)): User can batch promote multiple features

## Details

### FR-002.1: Feature Branch Detection

The system polls or receives webhooks from the connected Git provider to detect new branches. Branches matching configurable patterns (e.g., `feature/*`, `fix/*`) are tracked as features. The main/trunk branch and environment branches are excluded.

### FR-002.2: Feature Position Tracking

Each feature has a "current position" in the pipeline, representing the highest environment it has been promoted to. Features start at the first environment in the pipeline and advance as they are promoted.

### FR-002.3: Promote Feature

From the dashboard, users click a promote button on a feature card. The system determines the next environment(s) in the pipeline based on the current position and the pipeline graph.

### FR-002.4: Promotion Branch Creation

When a promotion is triggered, the system creates a new branch from the feature branch:

```
promote/<feature-name>_-_<target-environment>
```

Example: `promote/add-search_-_staging`

This branch is ephemeral and exists only for the duration of the promotion process.

### FR-002.5: Conflict Detection

The system merges the target environment branch INTO the promotion branch (not the other way around). This reveals any conflicts between the feature and the current state of the target environment without touching either the feature branch or the environment branch.

```
promotion branch = feature branch + target env branch
```

### FR-002.6: Conflict Resolution

If conflicts are detected during the merge:
- The promotion status is set to "conflict"
- The user is notified with details of the conflicting files
- The user can resolve conflicts in the promotion branch (via Git client or web IDE)
- Once resolved, the promotion continues

### FR-002.7: Pull Request

After a clean merge (or conflict resolution), the system opens a PR from the promotion branch to the target environment branch. The PR includes:
- Promotion metadata (source feature, target environment)
- Link back to the Convoye dashboard
- Required checks and reviewers as configured on the promotion path

### FR-002.8: Deployment Trigger

When the PR is merged (either manually or auto-merged after checks pass):
- The system detects the merge via webhook
- Triggers deployment to the configured deploy target for that environment
- Updates the feature's position in the pipeline
- Records the promotion event in the audit trail

### FR-002.9: Clean Feature Branch

The feature branch is never modified during promotion. All merge operations happen on the promotion branch. This means:
- Feature branches can be promoted to multiple environments independently
- No merge commits pollute the feature branch
- The feature branch remains a clean diff against its base

### FR-002.10: Batch Promotion

Users can select multiple features and promote them all to the next environment in one action. Each feature gets its own promotion branch and PR. Batch promotions are tracked as a group in the audit trail.
