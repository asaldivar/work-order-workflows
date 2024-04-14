"use client";

import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { create } from "zustand";

import { initialNodes } from "../initial-nodes";
import { initialEdges } from "../initial-edges";
import useNodeTraversalStore from "./useNodeTraversal";

const saveToLocalStorage = <T>(key: string, data: T) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export type NodeData = {
  label: string;
};

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  updateNode: (nodeId: string, label: string) => void;
};

let storedNodes = null;
let storedEdges = null;

if (typeof window !== "undefined") {
  storedNodes = localStorage.getItem("nodes");
  storedEdges = localStorage.getItem("edges");
}

const initialNodesData = storedNodes ? JSON.parse(storedNodes) : initialNodes;
const initialEdgesData = storedEdges ? JSON.parse(storedEdges) : initialEdges;

const useStore = create<RFState>((set, get) => ({
  nodes: initialNodesData,
  edges: initialEdgesData,

  onNodesChange: (changes: NodeChange[]) => {
    const isRemove = Boolean(changes.find(({ type }) => type === "remove"));
    if (useNodeTraversalStore.getState().traversalPath !== null && isRemove)
      return;

    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
    saveToLocalStorage("nodes", applyNodeChanges(changes, get().nodes));
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    const isRemove = Boolean(changes.find(({ type }) => type === "remove"));
    if (useNodeTraversalStore.getState().traversalPath !== null && isRemove)
      return;

    if (useNodeTraversalStore.getState().traversalPath !== null) return;
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
    saveToLocalStorage("edges", applyEdgeChanges(changes, get().edges));
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge({ ...connection, type: "smoothstep" }, get().edges),
    });
    saveToLocalStorage(
      "edges",
      addEdge({ ...connection, type: "smoothstep" }, get().edges)
    );
  },

  setNodes: (nodes: Node[]) => {
    set({ nodes });
    saveToLocalStorage("nodes", nodes);
  },

  updateNode(nodeId, label) {
    set({
      nodes: get().nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, label } };
        }
        return node;
      }),
    });
    saveToLocalStorage("nodes", get().nodes);
  },
}));

export default useStore;
