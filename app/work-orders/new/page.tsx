"use client";

import React, { useState, useRef, useCallback, DragEvent } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  ReactFlowInstance,
  MiniMap,
  Background,
  BackgroundVariant,
} from "reactflow";
import { useShallow } from "zustand/react/shallow";
import { nanoid } from "nanoid";

import Sidebar from "@/components/Sidebar";
import useStore, { RFState } from "@/lib/hooks/useStore";
import { nodeTypes } from "@/lib/node-types";

import "reactflow/dist/style.css";
import WalkthroughControls from "@/components/Walkthrough-Controls";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
});

const DnDFlow = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes } =
    useStore(useShallow(selector));

  const reactFlowWrapper = useRef(null);

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = (event: DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData("application/reactflow");

    if (typeof type === "undefined" || !type) {
      return;
    }

    if (reactFlowInstance) {
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: nanoid(),
        type,
        position,
        data: { label: `${type}` },
      };

      setNodes([...nodes, newNode]);
    }
  };

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            nodeTypes={nodeTypes}
          >
            <Background color="#ccc" variant={BackgroundVariant.Dots} />
          </ReactFlow>
        </div>
        <Sidebar />
        <WalkthroughControls />
        <MiniMap nodeStrokeWidth={3} />
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;
