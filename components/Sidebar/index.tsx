import React, { DragEvent } from "react";

import useNodeTraversalStore from "@/lib/hooks/useNodeTraversal";

import "reactflow/dist/style.css";
import "./index.css";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const onDragStart = (event: DragEvent<HTMLElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  const { traversalPath } = useNodeTraversalStore();

  return (
    <aside>
      {!traversalPath ? (
        <p className="font-bold mb-4">
          You can drag these nodes into the pane.
        </p>
      ) : (
        <p className="font-bold mb-4">
          Adding nodes disabled during walkthrough.
        </p>
      )}
      <div className="grid gap-2">
        <div
          className={cn(
            "relative text-center bg-white font-bold p-2 border-black border-2 rounded",
            {
              "border-gray-300": traversalPath,
              "cursor-not-allowed	": traversalPath,
              "text-gray-300	": traversalPath,
              "bg-gray-100	": traversalPath,
              "cursor-move": !traversalPath,
            }
          )}
          onDragStart={event => onDragStart(event, "inputNode")}
          draggable={!traversalPath}
        >
          Input
          <div
            className={cn(
              "absolute bg-black h-3 w-3 rounded-lg -right-1.5 top-2.5 border-2 border-white align-center",
              {
                "bg-gray-300": traversalPath,
              }
            )}
          ></div>
        </div>
        <div
          className={cn(
            "relative text-center bg-white font-bold p-2 border-black border-2 rounded",
            {
              "border-gray-300": traversalPath,
              "cursor-not-allowed	": traversalPath,
              "text-gray-300	": traversalPath,
              "bg-gray-100	": traversalPath,
              "cursor-move": !traversalPath,
            }
          )}
          onDragStart={event => onDragStart(event, "defaultNode")}
          draggable={!traversalPath}
        >
          <div
            className={cn(
              "absolute bg-black h-3 w-3 rounded-lg -left-1.5 top-2.5 border-2 border-white align-center",
              {
                "bg-gray-300": traversalPath,
              }
            )}
          ></div>
          Default
          <div
            className={cn(
              "absolute bg-black h-3 w-3 rounded-lg -right-1.5 top-2.5 border-2 border-white align-center",
              {
                "bg-gray-300": traversalPath,
              }
            )}
          ></div>
        </div>
        <div
          className={cn(
            "relative text-center bg-white font-bold p-2 border-black border-2 rounded",
            {
              "border-gray-300": traversalPath,
              "cursor-not-allowed	": traversalPath,
              "text-gray-300	": traversalPath,
              "bg-gray-100	": traversalPath,
              "cursor-move": !traversalPath,
            }
          )}
          onDragStart={event => onDragStart(event, "outputNode")}
          draggable={!traversalPath}
        >
          <div
            className={cn(
              "absolute bg-black h-3 w-3 rounded-lg -left-1.5 top-2.5 border-2 border-white align-center",
              {
                "bg-gray-300": traversalPath,
              }
            )}
          ></div>
          Output
        </div>
      </div>
    </aside>
  );
}
