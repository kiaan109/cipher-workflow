"use client";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { MailIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { GmailSearchDialog, type GmailSearchFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchCipherToken } from "../universal/actions";
import { CIPHER_CHANNEL_NAME } from "@/inngest/channels/cipher";

type T = Node<Record<string, unknown>>;

export const GmailSearchNode = memo((props: NodeProps<T>) => {
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const status = useNodeStatus({ nodeId: props.id, channel: CIPHER_CHANNEL_NAME, topic: "status", refreshToken: fetchCipherToken });
  const handleSubmit = (v: GmailSearchFormValues) =>
    setNodes((ns) => ns.map((n) => (n.id === props.id ? { ...n, data: { ...n.data, ...v } } : n)));

  const prompt = props.data.prompt as string | undefined;
  const description = prompt ? `${prompt.slice(0, 50)}${prompt.length > 50 ? "…" : ""}` : "Not configured — click to set up";

  return (
    <>
      <GmailSearchDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        defaultValues={props.data as Partial<GmailSearchFormValues>}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={MailIcon}
        name="Gmail Search"
        status={status}
        description={description}
        onSettings={() => setOpen(true)}
        onDoubleClick={() => setOpen(true)}
      />
    </>
  );
});

GmailSearchNode.displayName = "GmailSearchNode";
