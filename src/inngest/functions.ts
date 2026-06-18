import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort, computeParallelLevels } from "./utils";
import { sendWorkflowEmail } from "@/lib/notify";
import { ExecutionStatus, NodeType } from "@/generated/prisma";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { createBandRoom } from "@/lib/band";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { geminiChannel } from "./channels/gemini";
import { openAiChannel } from "./channels/openai";
import { anthropicChannel } from "./channels/anthropic";
import { discordChannel } from "./channels/discord";
import { slackChannel } from "./channels/slack";
import { twitterChannel } from "./channels/twitter";
import { telegramChannel } from "./channels/telegram";
import { linkedinChannel } from "./channels/linkedin";
import { instagramChannel } from "./channels/instagram";
import { whatsappChannel } from "./channels/whatsapp";
import { mistralChannel } from "./channels/mistral";
import { qwenChannel } from "./channels/qwen";
import { emailChannel } from "./channels/email";
import { notionChannel } from "./channels/notion";
import { googleSheetsChannel } from "./channels/google-sheets";
import { githubChannel } from "./channels/github";
import { rssFeedChannel } from "./channels/rss-feed";
import { smsChannel } from "./channels/sms";
import { cipherChannel } from "./channels/cipher";

type ExecutionStep = {
  nodeId: string;
  nodeType: string;
  nodeName: string;
  status: "success" | "error";
  output?: unknown;
  error?: string;
  completedAt: string;
};

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: process.env.NODE_ENV === "production" ? 3 : 0,
    onFailure: async ({ event }) => {
      try {
        const execution = await prisma.execution.findFirst({ where: { inngestEventId: event.data.event.id }, include: { workflow: { select: { name: true, userId: true } } } });
        await prisma.execution.updateMany({
          where: { inngestEventId: event.data.event.id },
          data: { status: ExecutionStatus.FAILED, error: event.data.error.message, errorStack: event.data.error.stack, completedAt: new Date() },
        });
        if (execution?.workflow?.userId) {
          const user = await prisma.user.findUnique({ where: { id: execution.workflow.userId }, select: { email: true } });
          if (user?.email) {
            await sendWorkflowEmail({ to: user.email, workflowName: execution.workflow.name, executionId: execution.id, status: "failed", error: event.data.error.message });
          }
        }
      } catch { /* execution record may not exist yet */ }
    },
  },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      openAiChannel(),
      anthropicChannel(),
      discordChannel(),
      slackChannel(),
      twitterChannel(),
      telegramChannel(),
      linkedinChannel(),
      instagramChannel(),
      whatsappChannel(),
      mistralChannel(),
      qwenChannel(),
      emailChannel(),
      notionChannel(),
      googleSheetsChannel(),
      githubChannel(),
      rssFeedChannel(),
      smsChannel(),
      cipherChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;

    if (!inngestEventId || !workflowId) {
      throw new NonRetriableError("Event ID or workflow ID is missing");
    }

    await step.run("ensure-execution", async () => {
      return prisma.execution.upsert({
        where: { inngestEventId },
        create: { workflowId, inngestEventId, status: ExecutionStatus.RUNNING },
        update: { status: ExecutionStatus.RUNNING },
      });
    });

    // Single step: fetch workflow + user email together to minimize Inngest round-trips
    const { sortedNodes, parallelLevels, workflowInfo, userEmail } = await step.run("prepare-workflow", async () => {
      const [workflow, info] = await Promise.all([
        prisma.workflow.findUniqueOrThrow({ where: { id: workflowId }, include: { nodes: true, connections: true } }),
        prisma.workflow.findUniqueOrThrow({ where: { id: workflowId }, select: { userId: true, name: true } }),
      ]);
      const user = await prisma.user.findUnique({ where: { id: info.userId }, select: { email: true } });
      return {
        sortedNodes: topologicalSort(workflow.nodes, workflow.connections),
        parallelLevels: computeParallelLevels(workflow.nodes, workflow.connections),
        workflowInfo: info,
        userEmail: user?.email ?? null,
      };
    });

    const userId = workflowInfo.userId;

    // Fire "started" email without blocking - no step.run checkpoint needed
    if (userEmail) {
      void sendWorkflowEmail({ to: userEmail, workflowName: workflowInfo.name, executionId: inngestEventId, status: "started" });
    }

    const aiNodeTypes: NodeType[] = [
      NodeType.OPENAI, NodeType.ANTHROPIC, NodeType.GEMINI, NodeType.MISTRAL, NodeType.QWEN,
      NodeType.AI_AGENT, NodeType.AI_CHAIN, NodeType.SUMMARIZER, NodeType.TEXT_CLASSIFIER, NodeType.INFO_EXTRACTOR,
    ];
    const hasAiAgents = sortedNodes.some((node) => aiNodeTypes.includes(node.type as NodeType));

    // Create Band room without a step.run checkpoint - fire DB update in background
    let bandRoomId: string | null = null;
    if (hasAiAgents) {
      const room = await createBandRoom(`${workflowInfo.name} - ${inngestEventId}`);
      if (room) {
        bandRoomId = room.id;
        void prisma.execution.update({ where: { inngestEventId }, data: { bandRoomId: room.id } });
      }
    }

    let context: Record<string, unknown> = event.data.initialData || {};
    const executionSteps: ExecutionStep[] = [];

    for (const level of parallelLevels) {
      const levelResults = await Promise.all(
        level.map(async (node) => {
          const executor = getExecutor(node.type as NodeType);
          try {
            const result = await executor({
              data: node.data as Record<string, unknown>,
              nodeId: node.id,
              userId,
              context,
              step,
              publish,
              bandRoomId,
            });
            const varName = (node.data as Record<string, unknown>)?.variableName as string | undefined;
            return { ok: true as const, node, result, varName };
          } catch (err) {
            return { ok: false as const, node, error: err instanceof Error ? err.message : String(err), err };
          }
        }),
      );

      for (const r of levelResults) {
        if (r.ok) {
          if (r.varName && r.result[r.varName] !== undefined) {
            context = { ...context, [r.varName]: r.result[r.varName] };
          } else {
            context = { ...context, ...r.result };
          }
          executionSteps.push({
            nodeId: r.node.id, nodeType: r.node.type, nodeName: r.node.name,
            status: "success", output: r.varName ? context[r.varName] : undefined,
            completedAt: new Date().toISOString(),
          });
        } else {
          executionSteps.push({
            nodeId: r.node.id, nodeType: r.node.type, nodeName: r.node.name,
            status: "error", error: r.error, completedAt: new Date().toISOString(),
          });
          throw r.err;
        }
      }
    }

    await step.run("complete-execution", async () => {
      return prisma.execution.update({
        where: { inngestEventId },
        data: {
          status: ExecutionStatus.SUCCESS,
          completedAt: new Date(),
          output: JSON.parse(JSON.stringify({ _steps: executionSteps, ...context })),
        },
      });
    });

    // Fire success email without blocking
    if (userEmail) {
      void sendWorkflowEmail({ to: userEmail, workflowName: workflowInfo.name, executionId: inngestEventId, status: "success" });
    }

    return { workflowId, result: context };
  },
);
