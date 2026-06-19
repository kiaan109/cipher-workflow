"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState, useEffect } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { InstagramDialog, InstagramFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchInstagramToken, fetchInstagramCredentials } from "./actions";
import { INSTAGRAM_CHANNEL_NAME } from "@/inngest/channels/instagram";

type InstagramNodeData = Record<string, string | undefined>;
type InstagramNodeType = Node<InstagramNodeData>;

export const InstagramNode = memo((props: NodeProps<InstagramNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(() => Object.keys(props.data || {}).length === 0);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const { setNodes } = useReactFlow();

  useEffect(() => { fetchInstagramCredentials().then(setCredentials); }, []);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: INSTAGRAM_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchInstagramToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: InstagramFormValues) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === props.id) return { ...node, data: { ...node.data, ...credentials, ...values } };
      return node;
    }));
  };

  const nodeData = props.data;
  const description = nodeData?.caption
    ? `Post: ${String(nodeData.caption).slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <InstagramDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/instagram.svg"
        name="Instagram"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

InstagramNode.displayName = "InstagramNode";
