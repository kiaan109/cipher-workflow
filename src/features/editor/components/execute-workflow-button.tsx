"use client";

import { Button } from "@/components/ui/button";
import { FlaskConicalIcon, Loader2Icon, MailIcon, XIcon, ExternalLinkIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

function ExecutionStartedModal({ workflowName, executionId, onClose }: { workflowName?: string; executionId: string; onClose: () => void }) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md rounded-2xl border bg-background shadow-2xl p-6 flex flex-col gap-5">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <XIcon className="size-4" />
        </button>

        <div className="flex items-center justify-center">
          <div className="relative flex items-center justify-center size-16">
            <span className="absolute inline-flex size-full rounded-full bg-purple-500/30 animate-ping" />
            <span className="relative flex size-12 items-center justify-center rounded-full bg-purple-600">
              <FlaskConicalIcon className="size-6 text-white" />
            </span>
          </div>
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold">Workflow is running!</h2>
          {workflowName && <p className="text-sm text-muted-foreground font-medium">{workflowName}</p>}
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-purple-500/10 border border-purple-500/20 px-4 py-3">
          <MailIcon className="size-5 text-purple-400 mt-0.5 shrink-0" />
          <div className="text-sm leading-relaxed">
            <p className="font-medium text-purple-300">You can leave this page</p>
            <p className="text-muted-foreground mt-0.5">
              We&apos;ll send you an email the moment your workflow finishes or fails — with a direct link to the results.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Close</Button>
          <Button
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            onClick={() => { onClose(); router.push(`/executions/${executionId}`); }}
          >
            <ExternalLinkIcon className="size-4" />
            Watch Live
          </Button>
        </div>
      </div>
    </div>
  );
}

export const ExecuteWorkflowButton = ({ workflowId }: { workflowId: string }) => {
  const [isPending, setIsPending] = useState(false);
  const [modal, setModal] = useState<{ executionId: string; workflowName?: string } | null>(null);
  const router = useRouter();

  const handleExecute = async () => {
    setIsPending(true);
    try {
      const res = await fetch(`/api/workflows/${workflowId}/execute`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        toast.error(`Failed to execute: ${err.error ?? res.statusText}`);
        return;
      }
      const { executionId, workflowName } = await res.json();
      setModal({ executionId, workflowName });
    } catch (err) {
      toast.error(`Failed to execute: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Button size="lg" onClick={handleExecute} disabled={isPending}>
        {isPending ? <Loader2Icon className="size-4 animate-spin" /> : <FlaskConicalIcon className="size-4" />}
        {isPending ? "Starting…" : "Execute workflow"}
      </Button>
      {modal && (
        <ExecutionStartedModal
          executionId={modal.executionId}
          workflowName={modal.workflowName}
          onClose={() => { setModal(null); router.push(`/executions/${modal.executionId}`); }}
        />
      )}
    </>
  );
};
