import { requireAuth } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { ExecutionStatus } from "@/generated/prisma";
import { createId } from "@paralleldrive/cuid2";

export const maxDuration = 15;

function getAppUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

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

  // Fire-and-forget: invoke the dedicated run-workflow function as a separate
  // Vercel invocation so it gets its own timeout budget (up to maxDuration=300).
  const runUrl = `${getAppUrl()}/api/run-workflow`;
  fetch(runUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "",
    },
    body: JSON.stringify({ workflowId, executionId: execution.id }),
  }).catch(() => {});

  return Response.json({ executionId: execution.id, workflowName: workflow.name });
}
