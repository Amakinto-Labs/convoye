# FR-005: Deploy Targets ([#5](https://github.com/Amakinto-Labs/convoye/issues/5))

Deploy targets define where and how code is deployed when a promotion is completed. Each environment node in the pipeline can be connected to a specific deploy target.

## Requirements

- [ ] **FR-005.1** ([#38](https://github.com/Amakinto-Labs/convoye/issues/38)): User can connect Railway environment
- [ ] **FR-005.2** ([#39](https://github.com/Amakinto-Labs/convoye/issues/39)): User can connect Vercel project
- [ ] **FR-005.3** ([#40](https://github.com/Amakinto-Labs/convoye/issues/40)): User can configure custom webhook endpoint
- [ ] **FR-005.4** ([#41](https://github.com/Amakinto-Labs/convoye/issues/41)): System triggers deployment on promotion merge
- [ ] **FR-005.5** ([#42](https://github.com/Amakinto-Labs/convoye/issues/42)): System tracks deployment status
- [ ] **FR-005.6** ([#43](https://github.com/Amakinto-Labs/convoye/issues/43)): Deploy target configurable per environment node

## Details

### FR-005.1: Railway Integration

Users connect a Railway environment by providing:
- Railway API token
- Project ID
- Environment ID

When a promotion completes, the system triggers a deployment via Railway's API to the specified environment.

### FR-005.2: Vercel Integration

Users connect a Vercel project by providing:
- Vercel API token
- Project ID

Vercel deployments are triggered by branch pushes (the merged environment branch). The system can also use the Vercel deployment API for explicit trigger control.

### FR-005.3: Custom Webhook

For platforms not directly supported, users can configure a custom webhook endpoint:
- **URL**: The endpoint to call
- **Secret**: Shared secret for payload signing
- **Payload template**: Customizable JSON body with variables (branch, environment, feature name)

The system sends an HTTP POST to the webhook URL when a promotion completes.

### FR-005.4: Deployment Trigger

When a promotion PR is merged into the target environment branch:
1. The system detects the merge via webhook (FR-004.6)
2. Looks up the deploy target configured for that environment
3. Triggers deployment via the appropriate provider API
4. Records the deployment attempt in the database

### FR-005.5: Deployment Status Tracking

After triggering a deployment, the system tracks its status:
- **Queued**: Deployment request sent
- **Building**: Build in progress (provider-specific polling)
- **Deployed**: Deployment successful
- **Failed**: Deployment failed (with error details)

Status is polled from the provider API and displayed on the dashboard.

### FR-005.6: Per-Environment Configuration

Each environment node in the pipeline builder has a deploy target selector. Users choose from connected deploy targets or configure a new one. Different environments can use different providers (e.g., staging on Railway, production on Vercel).
