"use client";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { TextClassifierDialog, type TextClassifierFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchCipherToken } from "../universal/actions";
import { CIPHER_CHANNEL_NAME } from "@/inngest/channels/cipher";
type T = Node<Record<string, string | number | undefined>>;
export const TextClassifierNode = memo((props: NodeProps<T>) => {
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const status = useNodeStatus({ nodeId: props.id, channel: CIPHER_CHANNEL_NAME, topic: "status", refreshToken: fetchCipherToken });
  const handleSubmit = (v: TextClassifierFormValues) => setNodes(ns => ns.map(n => n.id === props.id ? { ...n, data: { ...n.data, ...v } } : n));
  return (<><TextClassifierDialog open={open} onOpenChange={setOpen} onSubmit={handleSubmit} defaultValues={props.data as Partial<TextClassifierFormValues>} /><BaseExecutionNode {...props} id={props.id} icon="🏷️" name="Text Classifier" status={status} description={props.data.categories ? String(props.data.categories).slice(0, 40) : "Not configured"} onSettings={() => setOpen(true)} onDoubleClick={() => setOpen(true)} /></>);
});
TextClassifierNode.displayName = "TextClassifierNode";
