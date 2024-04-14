import React, { useState } from "react";
import { NodeProps } from "reactflow";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useStore from "@/lib/hooks/useStore";
import useNodeTraversal from "@/lib/hooks/useNodeTraversal";
import { cn } from "@/lib/utils";

enum Dialogs {
  Edit = 1,
  Delete = 2,
}

interface DialogProps {
  setIsOpen: React.Dispatch<boolean>;
  nodeProps: NodeProps;
}

const editFormSchema = z.object({
  label: z.string().min(2),
});

const EditDialog: React.FC<DialogProps> = ({ setIsOpen, nodeProps }) => {
  const {
    id,
    data: { label },
  } = nodeProps;
  const { updateNode } = useStore();

  const form = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      label,
    },
  });

  function onSubmit(values: z.infer<typeof editFormSchema>) {
    const { label } = values;
    updateNode(id, label);
    setIsOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <DialogHeader>
          <DialogTitle>Edit label</DialogTitle>
          <DialogDescription>
            Make changes to your node here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Step 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

const DeleteDialog: React.FC<DialogProps> = ({ setIsOpen, nodeProps }) => {
  const {
    id,
    data: { label },
  } = nodeProps;
  const { nodes, setNodes } = useStore();

  const handleSubmit = () => {
    const updatedNodes = nodes.filter(node => node.id !== id);
    setNodes(updatedNodes);
    setIsOpen(false);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete node: {label}</DialogTitle>
        <DialogDescription>
          This action cannot be undone. Are you sure you want to permanently
          delete this file from our servers?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button onClick={handleSubmit}>Confirm</Button>
      </DialogFooter>
    </>
  );
};

interface NodeWrapperProps {
  nodeProps: NodeProps;
  children: React.ReactNode;
}

export const NodeWrapper: React.FC<NodeWrapperProps> = ({
  nodeProps,
  children,
}) => {
  const { nodes } = useStore();
  const [dialog, setDialog] = useState<Dialogs>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { buildTraversalPath, traversalPath, currentIndex } =
    useNodeTraversal();

  const beginWalkThrough = () => {
    const startIndex = nodes.findIndex(node => node.id === nodeProps.id);
    buildTraversalPath(startIndex);
  };

  let isHighlighted = false;
  if (traversalPath !== null && currentIndex !== null) {
    isHighlighted = nodeProps.id === traversalPath[currentIndex].currentNodeId;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn("border-black border-2 rounded-sm p-2 bg-null-300", {
              "bg-green-300": isHighlighted,
            })}
          >
            {children}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <DialogTrigger asChild onClick={() => setDialog(Dialogs.Edit)}>
            <ContextMenuItem>
              <span>Edit Label</span>
            </ContextMenuItem>
          </DialogTrigger>
          <ContextMenuItem onClick={beginWalkThrough}>
            <span>Walkthrough</span>
          </ContextMenuItem>
          <DialogTrigger
            asChild
            onClick={() => setDialog(Dialogs.Delete)}
            disabled={traversalPath !== null}
          >
            <ContextMenuItem>
              <span>Delete</span>
            </ContextMenuItem>
          </DialogTrigger>
        </ContextMenuContent>
        <DialogContent>
          {dialog === Dialogs.Edit ? (
            <EditDialog setIsOpen={setIsDialogOpen} nodeProps={nodeProps} />
          ) : (
            <DeleteDialog setIsOpen={setIsDialogOpen} nodeProps={nodeProps} />
          )}
        </DialogContent>
      </ContextMenu>
    </Dialog>
  );
};
