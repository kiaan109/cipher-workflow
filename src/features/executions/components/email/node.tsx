"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState, useEffect } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { EmailDialog, EmailFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchEmailToken, fetchEmailCredentials } from "./actions";
import { EMAIL_CHANNEL_NAME } from "@/inngest/channels/email";

type EmailNodeData = Record<string, string | number | undefined>;
type EmailNodeType = Node<EmailNodeData>;

export const EmailNode = memo((props: NodeProps<EmailNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(() => Object.keys(props.data || {}).length === 0);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const { setNodes } = useReactFlow();

  useEffect(() => {
    fetchEmailCredentials().then((creds) => {
      setCredentials(creds);
      if (creds.apiKey) {
        setNodes((nodes) => nodes.map((n) =>
          n.id === props.id ? { ...n, data: { ...n.data, ...creds } } : n
        ));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id]);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: EMAIL_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchEmailToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: EmailFormValues) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === props.id) return { ...node, data: { ...node.data, ...credentials, ...values } };
      return node;
    }));
  };

  const nodeData = props.data;
  const fieldVal = nodeData?.["to"];
  const description = fieldVal
    ? `Send to: ${String(fieldVal).slice(0, 50)}`
    : "Not configured";

  return (
    <>
      <EmailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData as Partial<EmailFormValues>}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/email.svg"
        name="Email"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

EmailNode.displayName = "EmailNode";
