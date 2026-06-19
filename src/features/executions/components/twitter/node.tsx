"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState, useEffect } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { TwitterDialog, TwitterFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchTwitterToken, fetchTwitterCredentials } from "./actions";
import { TWITTER_CHANNEL_NAME } from "@/inngest/channels/twitter";

type TwitterNodeData = Record<string, string | undefined>;
type TwitterNodeType = Node<TwitterNodeData>;

export const TwitterNode = memo((props: NodeProps<TwitterNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(() => Object.keys(props.data || {}).length === 0);
  const { setNodes } = useReactFlow();

  useEffect(() => {
    fetchTwitterCredentials().then((creds) => {
      if (creds.apiKey || creds.accessToken) {
        setNodes((nodes) => nodes.map((n) =>
          n.id === props.id ? { ...n, data: { ...n.data, ...creds } } : n
        ));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id]);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: TWITTER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchTwitterToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: TwitterFormValues) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === props.id) return { ...node, data: { ...node.data, ...values } };
      return node;
    }));
  };

  const nodeData = props.data;
  const description = nodeData?.text
    ? `Tweet: ${nodeData.text.slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <TwitterDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/twitter.svg"
        name="Twitter"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

TwitterNode.displayName = "TwitterNode";
