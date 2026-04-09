# FR-004: Git Integration ([#4](https://github.com/Amakinto-Labs/convoye/issues/4))

Git integration connects Convoye to source code repositories, enabling branch detection, promotion branch creation, pull request management, and webhook-driven automation.

## Requirements

- [ ] **FR-004.1** ([#31](https://github.com/Amakinto-Labs/convoye/issues/31)): User can connect GitHub account via OAuth
- [ ] **FR-004.2** ([#32](https://github.com/Amakinto-Labs/convoye/issues/32)): User can select repository from connected account
- [ ] **FR-004.3** ([#33](https://github.com/Amakinto-Labs/convoye/issues/33)): System reads branches from connected repository
- [ ] **FR-004.4** ([#34](https://github.com/Amakinto-Labs/convoye/issues/34)): System creates branches via Git provider API
- [ ] **FR-004.5** ([#35](https://github.com/Amakinto-Labs/convoye/issues/35)): System creates and manages pull requests
- [ ] **FR-004.6** ([#36](https://github.com/Amakinto-Labs/convoye/issues/36)): System listens for webhook events (push, PR merge)
- [ ] **FR-004.7** ([#37](https://github.com/Amakinto-Labs/convoye/issues/37)): Support for GitHub initially, GitLab and Bitbucket planned

## Details

### FR-004.1: GitHub OAuth

Users connect their GitHub account through an OAuth flow managed by Better Auth. The OAuth token is stored securely and used for all subsequent GitHub API calls. The token must have the following scopes:
- `repo` (full repository access)
- `read:org` (organization membership, if applicable)

### FR-004.2: Repository Selection

After connecting GitHub, the user sees a list of repositories they have access to. They select a repository to create a Convoye project. The system stores the repository reference (owner, name, default branch).

### FR-004.3: Branch Reading

The system reads branches from the connected repository to:
- Detect feature branches for tracking
- Verify environment branches exist
- Show branch status in the dashboard

Branch reading happens via GitHub API polling and webhook events.

### FR-004.4: Branch Creation

The system creates branches programmatically for:
- Promotion branches (`promote/<feature>_-_<env>`)
- Environment branches (if they do not exist during pipeline setup)

Branches are created via the Git provider's REST API using the stored OAuth token.

### FR-004.5: Pull Request Management

The system creates PRs as part of the promotion workflow:
- PR from promotion branch to target environment branch
- PR title and body include promotion metadata
- PR is assigned configured reviewers
- System monitors PR status (checks, reviews, merge state)

The system can also create sync PRs (see FR-006).

### FR-004.6: Webhook Events

The system registers a webhook on the connected repository to receive events:
- **push**: Detect new branches and commits
- **pull_request**: Detect PR merges to trigger deployments
- **status / check_run**: Monitor CI status on promotion PRs

Webhook payloads are verified using the webhook secret.

### FR-004.7: Multi-Provider Support

The initial implementation targets GitHub. The git integration layer is designed with a provider abstraction so that GitLab and Bitbucket can be added later without changing the core promotion logic.

```
GitProvider (interface)
├── GitHubProvider
├── GitLabProvider (planned)
└── BitbucketProvider (planned)
```
