"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { MistralDialog, MistralFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchMistralToken } from "./actions";
import { MISTRAL_CHANNEL_NAME } from "@/inngest/channels/mistral";

type MistralNodeData = { variableName?: string; systemPrompt?: string; userPrompt?: string };
type MistralNodeType = Node<MistralNodeData>;

export const MistralNode = memo((props: NodeProps<MistralNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: MISTRAL_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchMistralToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: MistralFormValues) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === props.id) return { ...node, data: { ...node.data, ...values } };
      return node;
    }));
  };

  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `mistral (OpenRouter): ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <MistralDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/mistral.svg"
        name="Mistral AI"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

MistralNode.displayName = "MistralNode";
