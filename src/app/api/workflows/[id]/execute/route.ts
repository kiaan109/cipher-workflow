import { after } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { ExecutionStatus, NodeType } from "@/generated/prisma";
import { topologicalSort } from "@/inngest/utils";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { createId } from "@paralleldrive/cuid2";

export const maxDuration = 60;

type ExecutionStep = {
  nodeId: string;
  nodeType: string;
  nodeName: string;
  status: "success" | "error";
  output?: unknown;
  error?: string;
  completedAt: string;
};

// Shim: step.run just calls the function directly (no Inngest needed)
const stepShim = {
  run: async <T>(_name: string, fn: () => Promise<T>): Promise<T> => fn(),
  sleep: async () => {},
  waitForEvent: async () => null,
  sendEvent: async () => {},
  invoke: async () => null,
};

// No-op publish (realtime not needed for direct execution)
const publishShim = async () => {};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  const { id: workflowId } = await params;

  // Create execution record immediately so frontend can navigate to it
  const eventId = createId();
  const execution = await prisma.execution.create({
    data: {
      workflowId,
      inngestEventId: eventId,
      status: ExecutionStatus.RUNNING,
    },
  });

  const executionId = execution.id;
  const userId = session.user.id;

  // Run workflow in background AFTER responding to the client
  after(async () => {
    const executionSteps: ExecutionStep[] = [];
    let context: Record<string, unknown> = {};

    try {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: { nodes: true, connections: true },
      });

      const sortedNodes = topologicalSort(workflow.nodes, workflow.connections);

      for (const node of sortedNodes) {
        const executor = getExecutor(node.type as NodeType);

        try {
          context = await executor({
            data: node.data as Record<string, unknown>,
            nodeId: node.id,
            userId,
            context,
            step: stepShim as never,
            publish: publishShim as never,
            bandRoomId: null,
          });

          const varName = (node.data as Record<string, unknown>)
            ?.variableName as string | undefined;

          executionSteps.push({
            nodeId: node.id,
            nodeType: node.type,
            nodeName: node.name,
            status: "success",
            output: varName ? context[varName] : undefined,
            completedAt: new Date().toISOString(),
          });
        } catch (err) {
          executionSteps.push({
            nodeId: node.id,
            nodeType: node.type,
            nodeName: node.name,
            status: "error",
            error: err instanceof Error ? err.message : String(err),
            completedAt: new Date().toISOString(),
          });
          throw err;
        }

        // Save progress after each node so live polling sees it
        await prisma.execution.update({
          where: { id: executionId },
          data: {
            output: JSON.parse(
              JSON.stringify({ _steps: executionSteps, ...context })
            ),
          },
        });
      }

      await prisma.execution.update({
        where: { id: executionId },
        data: {
          status: ExecutionStatus.SUCCESS,
          completedAt: new Date(),
          output: JSON.parse(
            JSON.stringify({ _steps: executionSteps, ...context })
          ),
        },
      });
    } catch (err) {
      await prisma.execution
        .update({
          where: { id: executionId },
          data: {
            status: ExecutionStatus.FAILED,
            completedAt: new Date(),
            error: err instanceof Error ? err.message : String(err),
            output: JSON.parse(JSON.stringify({ _steps: executionSteps })),
          },
        })
        .catch(() => {});
    }
  });

  return Response.json({ executionId });
}
