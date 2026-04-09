import { GitBranch, ArrowRight, CheckCircle2, AlertCircle, Clock } from "lucide-react";

// Placeholder dashboard with mock data
const mockFeatures = [
  {
    id: "1",
    branch: "feature/billing-v2",
    title: "Billing V2",
    author: "roderick",
    currentEnv: "QA",
    status: "deployed",
  },
  {
    id: "2",
    branch: "feature/auth-refresh",
    title: "Auth Token Refresh",
    author: "roderick",
    currentEnv: "Staging",
    status: "promoting",
  },
  {
    id: "3",
    branch: "feature/dark-mode",
    title: "Dark Mode",
    author: "sarah",
    currentEnv: null,
    status: "open",
  },
];

const environments = ["Dev", "QA", "Staging", "Production"];

const statusIcons: Record<string, typeof CheckCircle2> = {
  deployed: CheckCircle2,
  promoting: Clock,
  open: GitBranch,
  conflict: AlertCircle,
};

const statusColors: Record<string, string> = {
  deployed: "text-emerald-400",
  promoting: "text-amber-400",
  open: "text-[var(--convoye-text-muted)]",
  conflict: "text-red-400",
};

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Pipeline Overview */}
      <div className="flex items-center gap-3">
        {environments.map((env, i) => (
          <div key={env} className="flex items-center gap-3">
            <div className="rounded-lg border border-[var(--convoye-border)] bg-[var(--convoye-surface)] px-4 py-2">
              <span className="text-sm font-medium">{env}</span>
              <p className="text-xs text-[var(--convoye-text-muted)] mt-0.5">
                {mockFeatures.filter((f) => f.currentEnv === env).length} features
              </p>
            </div>
            {i < environments.length - 1 && (
              <ArrowRight className="h-4 w-4 text-[var(--convoye-text-muted)]" />
            )}
          </div>
        ))}
      </div>

      {/* Feature List */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Active Features</h2>
        <div className="space-y-2">
          {mockFeatures.map((feature) => {
            const StatusIcon = statusIcons[feature.status] || GitBranch;
            return (
              <div
                key={feature.id}
                className="flex items-center justify-between rounded-lg border border-[var(--convoye-border)] bg-[var(--convoye-surface)] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <StatusIcon
                    className={`h-4 w-4 ${statusColors[feature.status]}`}
                  />
                  <div>
                    <p className="text-sm font-medium">{feature.title}</p>
                    <p className="text-xs text-[var(--convoye-text-muted)] font-mono">
                      {feature.branch}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {feature.currentEnv && (
                    <span className="rounded-full bg-[var(--convoye-primary)]/10 px-3 py-1 text-xs font-medium text-[var(--convoye-primary)]">
                      {feature.currentEnv}
                    </span>
                  )}
                  <button className="rounded-lg bg-[var(--convoye-primary)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--convoye-primary-hover)] transition-colors">
                    Promote
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
