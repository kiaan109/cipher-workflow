import prisma from "@/lib/db";
import { ExecutionStatus } from "@/generated/prisma";
import { sendWorkflowExecution } from "@/inngest/utils";
import { createId } from "@paralleldrive/cuid2";

export const maxDuration = 15;

// POST /api/webhooks/trigger/[workflowId]
// Body: any JSON - available as {{webhookData.body}} in downstream nodes
export async function POST(
  req: Request,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const { workflowId } = await params;

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
    select: { id: true, name: true },
  });

  if (!workflow) {
    return Response.json({ error: "Workflow not found" }, { status: 404 });
  }

  let body: unknown = null;
  try {
    const text = await req.text();
    body = text ? JSON.parse(text) : null;
  } catch { body = null; }

  const headers: Record<string, string> = {};
  req.headers.forEach((v, k) => { headers[k] = v; });

  const initialData = {
    webhookData: {
      body,
      headers,
      method: req.method,
      triggeredAt: new Date().toISOString(),
    },
  };

  const eventId = createId();
  const execution = await prisma.execution.create({
    data: { workflowId, inngestEventId: eventId, status: ExecutionStatus.RUNNING },
  });

  await sendWorkflowExecution({ workflowId, eventId, initialData });

  return Response.json({ ok: true, executionId: execution.id });
}
