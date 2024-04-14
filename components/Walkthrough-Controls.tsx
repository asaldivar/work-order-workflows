import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import useNodeTraversalStore from "@/lib/hooks/useNodeTraversal";

export default function WalkthroughControls() {
  const {
    traversalPath,
    currentIndex,
    buildTraversalPath,
    traversePreviousNode,
    traverseNextNode,
    stopTraversal,
  } = useNodeTraversalStore();

  const handleStartButtonClick = () => {
    buildTraversalPath(0); // Start the walkthrough from the first node
  };

  const handleNextButtonClick = () => {
    traverseNextNode(); // Traverse to the next node
  };

  const handlePreviousButtonClick = () => {
    traversePreviousNode(); // Traverse to the previous node
  };

  const handleStopTraversal = () => {
    stopTraversal();
  };

  return (
    <div className="absolute z-0 inset-x-0 bottom-8 flex justify-center">
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={handlePreviousButtonClick}
          disabled={
            !traversalPath || currentIndex === null || currentIndex === 0
          }
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous Node
        </Button>
        {!traversalPath ? (
          <Button variant="outline" onClick={handleStartButtonClick}>
            Start Walktrough
          </Button>
        ) : (
          <Button variant="outline" onClick={handleStopTraversal}>
            Stop Walktrough
          </Button>
        )}
        <Button
          variant="outline"
          onClick={handleNextButtonClick}
          disabled={
            !traversalPath ||
            currentIndex === null ||
            currentIndex === traversalPath.length - 1
          }
        >
          Next Node <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
