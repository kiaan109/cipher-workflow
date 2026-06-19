"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { LinkedinDialog, LinkedinFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchLinkedinToken } from "./actions";
import { LINKEDIN_CHANNEL_NAME } from "@/inngest/channels/linkedin";

type LinkedInNodeData = Record<string, string | undefined>;
type LinkedInNodeType = Node<LinkedInNodeData>;

export const LinkedInNode = memo((props: NodeProps<LinkedInNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(() => Object.keys(props.data || {}).length === 0);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: LINKEDIN_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchLinkedinToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: LinkedinFormValues) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === props.id) return { ...node, data: { ...node.data, ...values } };
      return node;
    }));
  };

  const nodeData = props.data;
  const description = nodeData?.text
    ? `Post: ${nodeData.text.slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <LinkedinDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/linkedin.svg"
        name="LinkedIn"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

LinkedInNode.displayName = "LinkedInNode";
