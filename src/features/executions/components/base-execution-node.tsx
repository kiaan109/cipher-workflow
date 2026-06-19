"use client";

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode, useState } from "react";
import { useAtomValue } from "jotai";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/workflow-node";
import { type NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";
import { workflowIdAtom } from "@/features/editor/store/atoms";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  status?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
};

export const BaseExecutionNode = memo(
  ({
    id,
    data,
    icon: Icon,
    name,
    description,
    children,
    status = "initial",
    onSettings,
    onDoubleClick,
  }: BaseExecutionNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();
    const workflowId = useAtomValue(workflowIdAtom);
    const [isExecutingStep, setIsExecutingStep] = useState(false);
    const [stepResult, setStepResult] = useState<{ ok: boolean; output?: unknown; error?: string } | null>(null);

    const retryOnFail = Boolean(data?.retryOnFail);

    const handleDelete = () => {
      setNodes((currentNodes) => {
        const updatedNodes = currentNodes.filter((node) => node.id !== id);
        return updatedNodes;
      });

      setEdges((currentEdges) => {
        const updatedEdges = currentEdges.filter(
          (edge) => edge.source !== id && edge.target !== id
        );
        return updatedEdges;
      });
    };

    const handleToggleRetry = () => {
      setNodes((currentNodes) =>
        currentNodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, retryOnFail: !retryOnFail, maxRetries: node.data?.maxRetries ?? 3 } }
            : node,
        ),
      );
    };

    const handleExecuteStep = async () => {
      if (!workflowId) return;
      setIsExecutingStep(true);
      setStepResult(null);
      try {
        const res = await fetch(`/api/workflows/${workflowId}/nodes/${id}/execute-step`, { method: "POST" });
        const json = await res.json();
        setStepResult(json);
        if (!json.ok) toast.error(`Step failed: ${json.error ?? "Unknown error"}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setStepResult({ ok: false, error: message });
        toast.error(`Step failed: ${message}`);
      } finally {
        setIsExecutingStep(false);
      }
    };

    return (
      <WorkflowNode
        name={name}
        description={description}
        onDelete={handleDelete}
        onSettings={onSettings}
        onExecuteStep={handleExecuteStep}
        isExecutingStep={isExecutingStep}
        retryOnFail={retryOnFail}
        onToggleRetry={handleToggleRetry}
      >
        <NodeStatusIndicator
          status={status}
          variant="border"
        >
          <Popover open={!!stepResult} onOpenChange={(open) => !open && setStepResult(null)}>
            <PopoverTrigger asChild>
              <div>
                <BaseNode status={status} onDoubleClick={onDoubleClick}>
                  <BaseNodeContent>
                    {typeof Icon === "string" ? (
                      <Image src={Icon} alt={name} width={16} height={16} />
                    ) : (
                      <Icon className="size-4 text-muted-foreground" />
                    )}
                    {children}
                    <BaseHandle
                      id="target-1"
                      type="target"
                      position={Position.Left}
                    />
                    <BaseHandle
                      id="source-1"
                      type="source"
                      position={Position.Right}
                    />
                  </BaseNodeContent>
                </BaseNode>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 max-h-72 overflow-y-auto" side="bottom">
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                {stepResult?.ok ? "Step output" : "Step error"}
              </p>
              <pre className="whitespace-pre-wrap break-words text-xs">
                {stepResult?.ok
                  ? JSON.stringify(stepResult.output, null, 2)
                  : stepResult?.error}
              </pre>
            </PopoverContent>
          </Popover>
        </NodeStatusIndicator>
      </WorkflowNode>
    )
  },
);

BaseExecutionNode.displayName = "BaseExecutionNode";
