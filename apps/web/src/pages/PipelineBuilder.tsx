import { Canvas } from "@/components/pipeline-builder/Canvas";
import { ConfigPanel } from "@/components/pipeline-builder/ConfigPanel";
import { usePipelineStore } from "@/stores/pipeline";

export function PipelineBuilder() {
  const selectedNodeId = usePipelineStore((s) => s.selectedNodeId);

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <Canvas />
      </div>
      {selectedNodeId && <ConfigPanel />}
    </div>
  );
}
