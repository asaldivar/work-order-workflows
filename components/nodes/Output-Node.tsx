import React from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { NodeWrapper } from "./Node-Wrapper";

export function OutputNode(nodeProps: NodeProps) {
  const { data, isConnectable } = nodeProps;
  const { label } = data;

  return (
    <NodeWrapper nodeProps={nodeProps}>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <p className="text-lg">{label}</p>
    </NodeWrapper>
  );
}
