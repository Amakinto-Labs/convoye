import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps, Node } from "@xyflow/react";
import { Server, GitBranch, Zap, ShieldCheck } from "lucide-react";
import type { EnvironmentNodeData } from "@/stores/pipeline";

type EnvironmentNodeProps = NodeProps<Node<EnvironmentNodeData>>;

export const EnvironmentNode = memo(function EnvironmentNode({
  data,
  selected,
}: EnvironmentNodeProps) {
  const statusColor = "bg-emerald-500"; // TODO: dynamic based on deploy status

  return (
    <div
      className={`relative rounded-xl border-2 bg-[var(--convoye-surface)] px-4 py-3 shadow-lg transition-all min-w-[180px] ${
        selected
          ? "border-[var(--convoye-primary)] shadow-[var(--convoye-primary)]/20"
          : "border-[var(--convoye-border)] hover:border-[var(--convoye-border)]/80"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-[var(--convoye-surface)] !bg-[var(--convoye-primary)]"
      />

      <div className="flex items-center gap-2 mb-2">
        <div className={`h-2 w-2 rounded-full ${statusColor}`} />
        <span className="font-semibold text-sm">{data.name || "Unnamed"}</span>
      </div>

      <div className="space-y-1 text-xs text-[var(--convoye-text-muted)]">
        {data.branch && (
          <div className="flex items-center gap-1.5">
            <GitBranch className="h-3 w-3" />
            <span className="font-mono">{data.branch}</span>
          </div>
        )}
        {data.deployTarget && (
          <div className="flex items-center gap-1.5">
            <Server className="h-3 w-3" />
            <span>{data.deployTarget}</span>
          </div>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          {data.autoDeploy && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
              <Zap className="h-2.5 w-2.5" />
              Auto
            </span>
          )}
          {data.reviewersRequired > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-400">
              <ShieldCheck className="h-2.5 w-2.5" />
              {data.reviewersRequired}
            </span>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-[var(--convoye-surface)] !bg-[var(--convoye-primary)]"
      />
    </div>
  );
});
