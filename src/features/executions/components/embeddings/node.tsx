"use client";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { EmbeddingsDialog, type EmbeddingsFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchCipherToken } from "../universal/actions";
import { CIPHER_CHANNEL_NAME } from "@/inngest/channels/cipher";
type T = Node<Record<string, string | number | undefined>>;
export const EmbeddingsNode = memo((props: NodeProps<T>) => {
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const status = useNodeStatus({ nodeId: props.id, channel: CIPHER_CHANNEL_NAME, topic: "status", refreshToken: fetchCipherToken });
  const handleSubmit = (v: EmbeddingsFormValues) => setNodes(ns => ns.map(n => n.id === props.id ? { ...n, data: { ...n.data, ...v } } : n));
  return (<><EmbeddingsDialog open={open} onOpenChange={setOpen} onSubmit={handleSubmit} defaultValues={props.data as Partial<EmbeddingsFormValues>} /><BaseExecutionNode {...props} id={props.id} icon="🔢" name="Embeddings" status={status} description={props.data.model ? String(props.data.model) : "Not configured"} onSettings={() => setOpen(true)} onDoubleClick={() => setOpen(true)} /></>);
});
EmbeddingsNode.displayName = "EmbeddingsNode";
