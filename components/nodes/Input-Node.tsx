import React, { useEffect } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { NodeWrapper } from "./Node-Wrapper";

export function InputNode(nodeProps: NodeProps) {
  const { data, isConnectable } = nodeProps;
  const { label } = data;

  return (
    <NodeWrapper nodeProps={nodeProps}>
      <p>{label}</p>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      />
    </NodeWrapper>
  );
}
