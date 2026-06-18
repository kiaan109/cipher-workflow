import prisma from "@/lib/db";
import { ExecutionStatus } from "@/generated/prisma";
import { createId } from "@paralleldrive/cuid2";

export const maxDuration = 15;

function getAppUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

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

  const runUrl = `${getAppUrl()}/api/run-workflow`;
  fetch(runUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "",
    },
    body: JSON.stringify({ workflowId, executionId: execution.id, initialData }),
  }).catch(() => {});

  return Response.json({ ok: true, executionId: execution.id });
}
