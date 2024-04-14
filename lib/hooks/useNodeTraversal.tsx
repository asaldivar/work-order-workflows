import { create } from "zustand";
import useStore from "./useStore";

interface NodeTraversalState {
  traversalPath:
    | { nodeIndex: number; currentNodeId: string; targetIndex: number }[]
    | null;
  currentIndex: number | null;
}

interface NodeTraversalActions {
  buildTraversalPath: (startNodeIndex: number) => void;
  traverseNextNode: () => void;
  traversePreviousNode: () => void;
  stopTraversal: () => void;
}

const useNodeTraversalStore = create<NodeTraversalState & NodeTraversalActions>(
  set => {
    const buildTraversalPath = (startNodeIndex: number) => {
      const { nodes, edges } = useStore.getState();
      const path: {
        nodeIndex: number;
        currentNodeId: string;
        targetIndex: number;
      }[] = [];
      const visited = new Set<number>();
      const queue = [
        {
          nodeIndex: startNodeIndex,
          currentNodeId: nodes[startNodeIndex].id,
          targetIndex: 0,
        },
      ];

      while (queue.length > 0) {
        const { nodeIndex, currentNodeId, targetIndex } = queue.shift()!;
        const node = nodes[nodeIndex];
        if (!visited.has(nodeIndex)) {
          visited.add(nodeIndex);
          path.push({ nodeIndex, currentNodeId, targetIndex });
          const outgoingEdges = edges.filter(edge => edge.source === node.id);
          for (let i = 0; i < outgoingEdges.length; i++) {
            const targetNodeIndex = nodes.findIndex(
              node => node.id === outgoingEdges[i].target
            );
            if (targetNodeIndex !== -1) {
              queue.push({
                nodeIndex: targetNodeIndex,
                currentNodeId: outgoingEdges[i].target,
                targetIndex: 0,
              });
            }
          }
        }
      }

      set({ traversalPath: path, currentIndex: 0 });
    };

    const traverseNextNode = () => {
      set(state => ({
        currentIndex:
          state.currentIndex !== null ? state.currentIndex + 1 : null,
      }));
    };

    const traversePreviousNode = () => {
      set(state => ({
        currentIndex:
          state.currentIndex !== null && state.currentIndex > 0
            ? state.currentIndex - 1
            : null,
      }));
    };

    const stopTraversal = () => {
      set({ traversalPath: null, currentIndex: null });
    };

    return {
      traversalPath: null,
      currentIndex: null,
      buildTraversalPath,
      traverseNextNode,
      traversePreviousNode,
      stopTraversal,
    };
  }
);

export default useNodeTraversalStore;
