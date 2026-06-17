"use client";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { AiChainDialog, type AiChainFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchCipherToken } from "../universal/actions";
import { CIPHER_CHANNEL_NAME } from "@/inngest/channels/cipher";
type T = Node<Record<string, string | number | undefined>>;
export const AiChainNode = memo((props: NodeProps<T>) => {
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const status = useNodeStatus({ nodeId: props.id, channel: CIPHER_CHANNEL_NAME, topic: "status", refreshToken: fetchCipherToken });
  const handleSubmit = (v: AiChainFormValues) => setNodes(ns => ns.map(n => n.id === props.id ? { ...n, data: { ...n.data, ...v } } : n));
  const desc = props.data.prompt ? String(props.data.prompt).slice(0, 50) : "Not configured";
  return (<><AiChainDialog open={open} onOpenChange={setOpen} onSubmit={handleSubmit} defaultValues={props.data as Partial<AiChainFormValues>} /><BaseExecutionNode {...props} id={props.id} icon="⛓️" name="LLM Chain" status={status} description={desc} onSettings={() => setOpen(true)} onDoubleClick={() => setOpen(true)} /></>);
});
AiChainNode.displayName = "AiChainNode";
