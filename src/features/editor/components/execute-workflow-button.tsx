"use client";

import { Button } from "@/components/ui/button";
import { FlaskConicalIcon, Loader2Icon, MailIcon, XIcon, ArrowRightIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

function ExecutionStartedModal({ workflowName, executionId, onClose }: { workflowName?: string; executionId: string; onClose: () => void }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-sm mx-auto rounded-2xl border border-white/10 bg-[#0f0f12] shadow-[0_0_80px_rgba(139,92,246,0.15)] overflow-hidden">
        {/* Purple glow top accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors z-10"
          aria-label="Close"
        >
          <XIcon className="size-4" />
        </button>

        <div className="px-8 pt-10 pb-8 flex flex-col items-center gap-6">
          {/* Icon with rings */}
          <div className="relative flex items-center justify-center">
            <span className="absolute size-20 rounded-full bg-purple-500/10 animate-ping" style={{ animationDuration: "2s" }} />
            <span className="absolute size-16 rounded-full bg-purple-500/15" />
            <span className="relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-700 shadow-lg shadow-purple-500/30">
              <FlaskConicalIcon className="size-7 text-white" />
            </span>
          </div>

          {/* Heading */}
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-bold text-white tracking-tight">Workflow running</h2>
            {workflowName && (
              <p className="text-sm font-medium text-purple-400/90 bg-purple-500/10 px-3 py-1 rounded-full inline-block border border-purple-500/20">
                {workflowName}
              </p>
            )}
          </div>

          {/* Info card */}
          <div className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] p-4 flex gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 border border-purple-500/30">
              <MailIcon className="size-4 text-purple-400" />
            </div>
            <div className="space-y-1 min-w-0">
              <p className="text-sm font-semibold text-white leading-snug">You can close this page</p>
              <p className="text-sm text-white/50 leading-relaxed">
                Your workflow runs in the cloud. We&apos;ll email you when it finishes.
              </p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Running on Cipher cloud
          </div>

          {/* Buttons */}
          <div className="w-full flex flex-col gap-2.5">
            <Button
              className="w-full h-11 bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm gap-2 transition-all"
              onClick={() => { onClose(); router.push(`/executions/${executionId}`); }}
            >
              Watch live
              <ArrowRightIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              className="w-full h-10 text-white/50 hover:text-white/80 hover:bg-white/5 text-sm font-medium"
              onClick={onClose}
            >
              <CheckIcon className="size-3.5 mr-1.5" />
              Got it, close
            </Button>
          </div>
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
        {isPending ? "Starting..." : "Execute workflow"}
      </Button>
      {modal && (
        <ExecutionStartedModal
          executionId={modal.executionId}
          workflowName={modal.workflowName}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
};
