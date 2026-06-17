"use client";

import { Button } from "@/components/ui/button";
import { FlaskConicalIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const ExecuteWorkflowButton = ({ workflowId }: { workflowId: string }) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleExecute = async () => {
    setIsPending(true);
    try {
      const res = await fetch(`/api/workflows/${workflowId}/execute`, {
        method: "POST",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        toast.error(`Failed to execute: ${err.error ?? res.statusText}`);
        return;
      }

      const { executionId } = await res.json();
      toast.success("Workflow started — watching live");
      router.push(`/executions/${executionId}`);
    } catch (err) {
      toast.error(`Failed to execute: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button size="lg" onClick={handleExecute} disabled={isPending}>
      {isPending
        ? <Loader2Icon className="size-4 animate-spin" />
        : <FlaskConicalIcon className="size-4" />
      }
      {isPending ? "Starting…" : "Execute workflow"}
    </Button>
  );
};
