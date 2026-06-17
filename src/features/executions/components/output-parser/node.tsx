"use client";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { OutputParserDialog, type OutputParserFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchCipherToken } from "../universal/actions";
import { CIPHER_CHANNEL_NAME } from "@/inngest/channels/cipher";
type T = Node<Record<string, string | number | undefined>>;
export const OutputParserNode = memo((props: NodeProps<T>) => {
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const status = useNodeStatus({ nodeId: props.id, channel: CIPHER_CHANNEL_NAME, topic: "status", refreshToken: fetchCipherToken });
  const handleSubmit = (v: OutputParserFormValues) => setNodes(ns => ns.map(n => n.id === props.id ? { ...n, data: { ...n.data, ...v } } : n));
  return (<><OutputParserDialog open={open} onOpenChange={setOpen} onSubmit={handleSubmit} defaultValues={props.data as Partial<OutputParserFormValues>} /><BaseExecutionNode {...props} id={props.id} icon="🔧" name="Output Parser" status={status} description={`Format: ${props.data.format || "not set"}`} onSettings={() => setOpen(true)} onDoubleClick={() => setOpen(true)} /></>);
});
OutputParserNode.displayName = "OutputParserNode";
