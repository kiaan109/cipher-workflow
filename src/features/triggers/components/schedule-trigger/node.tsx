"use client";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { ScheduleTriggerDialog, type ScheduleTriggerFormValues } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchCipherToken } from "@/features/executions/components/universal/actions";
import { CIPHER_CHANNEL_NAME } from "@/inngest/channels/cipher";
type T = Node<Record<string, string | number | undefined>>;
export const ScheduleTriggerNode = memo((props: NodeProps<T>) => {
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const status = useNodeStatus({ nodeId: props.id, channel: CIPHER_CHANNEL_NAME, topic: "status", refreshToken: fetchCipherToken });
  const handleSubmit = (v: ScheduleTriggerFormValues) => setNodes(ns => ns.map(n => n.id === props.id ? { ...n, data: { ...n.data, ...v } } : n));
  return (<><ScheduleTriggerDialog open={open} onOpenChange={setOpen} onSubmit={handleSubmit} defaultValues={props.data as Partial<ScheduleTriggerFormValues>} /><BaseExecutionNode {...props} id={props.id} icon="⏰" name="Schedule Trigger" status={status} description={props.data.cron ? String(props.data.cron) : "Not configured"} onSettings={() => setOpen(true)} onDoubleClick={() => setOpen(true)} /></>);
});
ScheduleTriggerNode.displayName = "ScheduleTriggerNode";
