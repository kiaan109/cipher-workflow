import { requireAuth } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { ExecutionStatus } from "@/generated/prisma";
import { sendWorkflowExecution } from "@/inngest/utils";
import { createId } from "@paralleldrive/cuid2";

export const maxDuration = 15;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  const { id: workflowId } = await params;

  // Verify workflow belongs to this user
  const workflow = await prisma.workflow.findUniqueOrThrow({
    where: { id: workflowId, userId: session.user.id },
    select: { name: true },
  });

  // Pre-create the execution record so the frontend can navigate immediately
  const eventId = createId();
  const execution = await prisma.execution.create({
    data: {
      workflowId,
      inngestEventId: eventId,
      status: ExecutionStatus.RUNNING,
    },
  });

  // Hand off to Inngest — runs on Inngest's servers, survives device off/sleep/disconnect
  await sendWorkflowExecution({ workflowId, eventId });

  return Response.json({ executionId: execution.id, workflowName: workflow.name });
}
