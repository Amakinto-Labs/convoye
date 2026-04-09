import {
  BaseEdge,
  getSmoothStepPath,
  EdgeLabelRenderer,
} from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";
import { ArrowRight } from "lucide-react";

export function PromotionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? "var(--convoye-primary)" : "var(--convoye-border)",
          strokeWidth: selected ? 2.5 : 2,
          transition: "stroke 0.2s, stroke-width 0.2s",
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
            selected
              ? "bg-[var(--convoye-primary)] text-white"
              : "bg-[var(--convoye-surface)] border border-[var(--convoye-border)] text-[var(--convoye-text-muted)]"
          }`}
        >
          <ArrowRight className="h-3 w-3" />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
