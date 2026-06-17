"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { WhatsappDialog, WhatsappFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchWhatsappToken } from "./actions";
import { WHATSAPP_CHANNEL_NAME } from "@/inngest/channels/whatsapp";

type WhatsAppNodeData = Record<string, string | undefined>;
type WhatsAppNodeType = Node<WhatsAppNodeData>;

export const WhatsAppNode = memo((props: NodeProps<WhatsAppNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: WHATSAPP_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchWhatsappToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: WhatsappFormValues) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === props.id) return { ...node, data: { ...node.data, ...values } };
      return node;
    }));
  };

  const nodeData = props.data;
  const description = nodeData?.message
    ? `Send: ${String(nodeData.message).slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <WhatsappDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/whatsapp.svg"
        name="WhatsApp"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

WhatsAppNode.displayName = "WhatsAppNode";
