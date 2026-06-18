import { requireAuth } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { ExecutionStatus } from "@/generated/prisma";
import { runWorkflow } from "@/lib/run-workflow";
import { createId } from "@paralleldrive/cuid2";
import { after } from "next/server";

// 5 min max — workflows can take time
export const maxDuration = 300;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  const { id: workflowId } = await params;

  const workflow = await prisma.workflow.findUniqueOrThrow({
    where: { id: workflowId, userId: session.user.id },
    select: { name: true },
  });

  // Pre-create execution record so the frontend can navigate immediately
  const executionId = createId();
  const execution = await prisma.execution.create({
    data: {
      workflowId,
      inngestEventId: executionId,
      status: ExecutionStatus.RUNNING,
    },
  });

  // Run the workflow after the HTTP response is sent (Next.js 15 built-in)
  after(async () => {
    await runWorkflow({ workflowId, executionId: execution.id });
  });

  return Response.json({ executionId: execution.id, workflowName: workflow.name });
}
