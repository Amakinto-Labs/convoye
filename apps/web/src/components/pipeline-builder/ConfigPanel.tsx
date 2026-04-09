import { X, Trash2 } from "lucide-react";
import { usePipelineStore } from "@/stores/pipeline";

export function ConfigPanel() {
  const { nodes, selectedNodeId, updateEnvironment, removeEnvironment, selectNode } =
    usePipelineStore();

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const data = node.data;

  return (
    <div className="w-80 border-l border-[var(--convoye-border)] bg-[var(--convoye-surface)] overflow-y-auto">
      <div className="flex items-center justify-between border-b border-[var(--convoye-border)] px-4 py-3">
        <h3 className="text-sm font-semibold">Environment Config</h3>
        <button
          onClick={() => selectNode(null)}
          className="text-[var(--convoye-text-muted)] hover:text-[var(--convoye-text)]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-[var(--convoye-text-muted)] mb-1">
            Name
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) =>
              updateEnvironment(node.id, { name: e.target.value })
            }
            className="nodrag w-full rounded-lg border border-[var(--convoye-border)] bg-[var(--convoye-bg)] px-3 py-2 text-sm text-[var(--convoye-text)] focus:border-[var(--convoye-primary)] focus:outline-none"
            placeholder="e.g. Production"
          />
        </div>

        {/* Branch */}
        <div>
          <label className="block text-xs font-medium text-[var(--convoye-text-muted)] mb-1">
            Git Branch
          </label>
          <input
            type="text"
            value={data.branch}
            onChange={(e) =>
              updateEnvironment(node.id, { branch: e.target.value })
            }
            className="nodrag w-full rounded-lg border border-[var(--convoye-border)] bg-[var(--convoye-bg)] px-3 py-2 text-sm font-mono text-[var(--convoye-text)] focus:border-[var(--convoye-primary)] focus:outline-none"
            placeholder="e.g. main"
          />
        </div>

        {/* Deploy Target */}
        <div>
          <label className="block text-xs font-medium text-[var(--convoye-text-muted)] mb-1">
            Deploy Target
          </label>
          <select
            value={data.deployTarget || ""}
            onChange={(e) =>
              updateEnvironment(node.id, {
                deployTarget: e.target.value || null,
              })
            }
            className="nodrag w-full rounded-lg border border-[var(--convoye-border)] bg-[var(--convoye-bg)] px-3 py-2 text-sm text-[var(--convoye-text)] focus:border-[var(--convoye-primary)] focus:outline-none"
          >
            <option value="">None</option>
            <option value="railway">Railway</option>
            <option value="vercel">Vercel</option>
            <option value="fly">Fly.io</option>
            <option value="custom">Custom Webhook</option>
          </select>
        </div>

        {/* Auto Deploy */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[var(--convoye-text-muted)]">
            Auto-deploy on merge
          </label>
          <button
            onClick={() =>
              updateEnvironment(node.id, { autoDeploy: !data.autoDeploy })
            }
            className={`relative h-5 w-9 rounded-full transition-colors ${
              data.autoDeploy ? "bg-[var(--convoye-primary)]" : "bg-[var(--convoye-border)]"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                data.autoDeploy ? "translate-x-4" : ""
              }`}
            />
          </button>
        </div>

        {/* Reviewers */}
        <div>
          <label className="block text-xs font-medium text-[var(--convoye-text-muted)] mb-1">
            Required Reviewers
          </label>
          <input
            type="number"
            min={0}
            max={10}
            value={data.reviewersRequired}
            onChange={(e) =>
              updateEnvironment(node.id, {
                reviewersRequired: parseInt(e.target.value) || 0,
              })
            }
            className="nodrag w-full rounded-lg border border-[var(--convoye-border)] bg-[var(--convoye-bg)] px-3 py-2 text-sm text-[var(--convoye-text)] focus:border-[var(--convoye-primary)] focus:outline-none"
          />
        </div>

        {/* Delete */}
        <button
          onClick={() => {
            removeEnvironment(node.id);
            selectNode(null);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Delete Environment
        </button>
      </div>
    </div>
  );
}
