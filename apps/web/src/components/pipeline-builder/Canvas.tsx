import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
  type NodeChange,
  type EdgeChange,
  MarkerType,
} from "@xyflow/react";
import { Plus } from "lucide-react";
import { usePipelineStore } from "@/stores/pipeline";
import { EnvironmentNode } from "./EnvironmentNode";
import { PromotionEdge } from "./PromotionEdge";

const nodeTypes = { environment: EnvironmentNode };
const edgeTypes = { promotion: PromotionEdge };

export function Canvas() {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    addEnvironment,
    selectNode,
    selectEdge,
  } = usePipelineStore();

  const defaultEdgeOptions = useMemo(
    () => ({
      type: "promotion",
      markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
      data: { requireTests: false, requireApproval: false },
    }),
    []
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes(applyNodeChanges(changes, nodes) as any);
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges(applyEdgeChanges(changes, edges) as any);
    },
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges(
        addEdge(
          {
            ...connection,
            type: "promotion",
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 16,
              height: 16,
            },
            data: { requireTests: false, requireApproval: false },
          },
          edges
        ) as any
      );
    },
    [edges, setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: any) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: any) => {
      selectEdge(edge.id);
    },
    [selectEdge]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);

  const handleAddEnvironment = useCallback(() => {
    // Place new node at center-ish of viewport
    const x = 100 + nodes.length * 250;
    const y = 200;
    addEnvironment({ x, y });
  }, [addEnvironment, nodes.length]);

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-[var(--convoye-bg)]"
      >
        <Background color="var(--convoye-border)" gap={24} size={1} />
        <Controls
          className="!border-[var(--convoye-border)] !bg-[var(--convoye-surface)] [&>button]:!border-[var(--convoye-border)] [&>button]:!bg-[var(--convoye-surface)] [&>button:hover]:!bg-white/5 [&>button>svg]:!fill-[var(--convoye-text)]"
        />
        <MiniMap
          className="!border-[var(--convoye-border)] !bg-[var(--convoye-surface)]"
          nodeColor="var(--convoye-primary)"
          maskColor="rgba(0,0,0,0.5)"
        />
      </ReactFlow>

      {/* Add Environment Button */}
      <button
        onClick={handleAddEnvironment}
        className="absolute top-4 right-4 flex items-center gap-2 rounded-lg bg-[var(--convoye-primary)] px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-[var(--convoye-primary-hover)] transition-colors z-10"
      >
        <Plus className="h-4 w-4" />
        Add Environment
      </button>
    </div>
  );
}
