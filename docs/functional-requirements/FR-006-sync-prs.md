# FR-006: Sync PRs ([#6](https://github.com/Amakinto-Labs/convoye/issues/6))

After code reaches production, lower environment branches may fall behind. Sync PRs keep environment branches aligned by propagating production state back down the pipeline.

## Requirements

- [ ] **FR-006.1** ([#44](https://github.com/Amakinto-Labs/convoye/issues/44)): After production deploy, system creates sync PRs to lower environment branches
- [ ] **FR-006.2** ([#45](https://github.com/Amakinto-Labs/convoye/issues/45)): Sync keeps environment branches aligned with main/production
- [ ] **FR-006.3** ([#46](https://github.com/Amakinto-Labs/convoye/issues/46)): Sync detects conflicts and surfaces them to user
- [ ] **FR-006.4** ([#47](https://github.com/Amakinto-Labs/convoye/issues/47)): User can toggle automatic vs manual sync
- [ ] **FR-006.5** ([#48](https://github.com/Amakinto-Labs/convoye/issues/48)): Sync PR creation can be triggered manually

## Details

### FR-006.1: Automatic Sync PRs

When a deployment to the final environment (typically production/main) completes, the system creates PRs from the production branch to each lower environment branch in the pipeline. This ensures all environments stay aligned with what is in production.

Example pipeline: `development -> staging -> production`

After a production deploy, the system creates:
- PR from `main` to `staging`
- PR from `main` to `development`

### FR-006.2: Branch Alignment

Sync PRs bring environment branches up to date with production. This prevents drift where an environment branch falls behind and future promotions encounter unnecessary conflicts caused by stale state rather than actual code differences.

### FR-006.3: Conflict Detection

If a sync PR has merge conflicts (e.g., a hotfix was applied directly to an environment branch), the system:
- Marks the sync PR with a conflict status
- Notifies the user via the dashboard
- Provides details of the conflicting files

The user must resolve conflicts manually before the sync PR can be merged.

### FR-006.4: Automatic vs Manual Sync

Users can configure sync behavior per pipeline:
- **Automatic**: Sync PRs are created and auto-merged (if no conflicts) immediately after production deploy
- **Manual**: Sync PRs are created but require manual review and merge

The default is automatic sync with conflict detection.

### FR-006.5: Manual Trigger

Users can trigger sync PR creation manually from the dashboard at any time. This is useful when:
- Automatic sync is disabled
- A previous sync failed and needs to be retried
- An out-of-band change was made to an environment branch
