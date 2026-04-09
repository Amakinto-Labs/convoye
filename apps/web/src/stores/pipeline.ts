import { create } from "zustand";
import type { Node, Edge } from "@xyflow/react";

export interface EnvironmentNodeData {
  name: string;
  branch: string;
  deployTarget: string | null;
  deployConfig: Record<string, string>;
  autoDeploy: boolean;
  reviewersRequired: number;
  [key: string]: unknown;
}

export interface PromotionEdgeData {
  requireTests: boolean;
  requireApproval: boolean;
  [key: string]: unknown;
}

interface PipelineState {
  nodes: Node<EnvironmentNodeData>[];
  edges: Edge<PromotionEdgeData>[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;

  setNodes: (nodes: Node<EnvironmentNodeData>[]) => void;
  setEdges: (edges: Edge<PromotionEdgeData>[]) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;

  addEnvironment: (position: { x: number; y: number }) => void;
  removeEnvironment: (id: string) => void;
  updateEnvironment: (id: string, data: Partial<EnvironmentNodeData>) => void;

  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
}

let nodeIdCounter = 0;

export const usePipelineStore = create<PipelineState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes: any) => {
    // Apply changes using xyflow utilities (done in component)
    set({ nodes: changes });
  },

  onEdgesChange: (changes: any) => {
    set({ edges: changes });
  },

  addEnvironment: (position) => {
    const id = `env-${++nodeIdCounter}-${Date.now()}`;
    const newNode: Node<EnvironmentNodeData> = {
      id,
      type: "environment",
      position,
      data: {
        name: "New Environment",
        branch: "",
        deployTarget: null,
        deployConfig: {},
        autoDeploy: false,
        reviewersRequired: 0,
      },
    };
    set((state) => ({ nodes: [...state.nodes, newNode] }));
  },

  removeEnvironment: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }));
  },

  updateEnvironment: (id, data) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    }));
  },

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
}));
