import { Github, Train, Globe } from "lucide-react";

export function Settings() {
  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h2 className="text-sm font-semibold mb-3">Git Provider</h2>
        <button className="flex items-center gap-3 rounded-lg border border-[var(--convoye-border)] bg-[var(--convoye-surface)] px-4 py-3 w-full hover:border-[var(--convoye-primary)] transition-colors">
          <Github className="h-5 w-5" />
          <div className="text-left">
            <p className="text-sm font-medium">Connect GitHub</p>
            <p className="text-xs text-[var(--convoye-text-muted)]">
              Connect your GitHub account to manage repositories
            </p>
          </div>
        </button>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-3">Deploy Targets</h2>
        <div className="space-y-2">
          <button className="flex items-center gap-3 rounded-lg border border-[var(--convoye-border)] bg-[var(--convoye-surface)] px-4 py-3 w-full hover:border-[var(--convoye-primary)] transition-colors">
            <Train className="h-5 w-5" />
            <div className="text-left">
              <p className="text-sm font-medium">Railway</p>
              <p className="text-xs text-[var(--convoye-text-muted)]">
                Connect Railway for environment deployments
              </p>
            </div>
          </button>
          <button className="flex items-center gap-3 rounded-lg border border-[var(--convoye-border)] bg-[var(--convoye-surface)] px-4 py-3 w-full hover:border-[var(--convoye-primary)] transition-colors">
            <Globe className="h-5 w-5" />
            <div className="text-left">
              <p className="text-sm font-medium">Vercel</p>
              <p className="text-xs text-[var(--convoye-text-muted)]">
                Connect Vercel for frontend deployments
              </p>
            </div>
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-3">Pipeline Settings</h2>
        <div className="rounded-lg border border-[var(--convoye-border)] bg-[var(--convoye-surface)] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto Sync PRs</p>
              <p className="text-xs text-[var(--convoye-text-muted)]">
                Automatically create sync PRs after production deploys
              </p>
            </div>
            <button className="relative h-5 w-9 rounded-full bg-[var(--convoye-border)] transition-colors">
              <span className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
