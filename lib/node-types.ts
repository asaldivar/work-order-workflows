import { DefaultNode, InputNode, OutputNode } from "@/components/nodes";

// TODO: defined outside of component but still getting RF warning
// https://reactflow.dev/error#002
export const nodeTypes = {
  inputNode: InputNode,
  defaultNode: DefaultNode,
  outputNode: OutputNode,
};
