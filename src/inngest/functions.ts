import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
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
        await prisma.execution.updateMany({
          where: { inngestEventId: event.data.event.id },
          data: {
            status: ExecutionStatus.FAILED,
            error: event.data.error.message,
            errorStack: event.data.error.stack,
            completedAt: new Date(),
          },
        });
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

    // Upsert so execution created pre-flight (in the tRPC mutation) is reused
    await step.run("ensure-execution", async () => {
      return prisma.execution.upsert({
        where: { inngestEventId },
        create: { workflowId, inngestEventId, status: ExecutionStatus.RUNNING },
        update: { status: ExecutionStatus.RUNNING },
      });
    });

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: { nodes: true, connections: true },
      });
      return topologicalSort(workflow.nodes, workflow.connections);
    });

    const workflowInfo = await step.run("find-workflow-info", async () => {
      return prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: { userId: true, name: true },
      });
    });

    const userId = workflowInfo.userId;

    const aiNodeTypes: NodeType[] = [
      NodeType.OPENAI, NodeType.ANTHROPIC, NodeType.GEMINI, NodeType.MISTRAL, NodeType.QWEN,
      NodeType.AI_AGENT, NodeType.AI_CHAIN, NodeType.SUMMARIZER, NodeType.TEXT_CLASSIFIER, NodeType.INFO_EXTRACTOR,
    ];
    const hasAiAgents = sortedNodes.some((node) => aiNodeTypes.includes(node.type as NodeType));

    const bandRoomId = hasAiAgents
      ? await step.run("create-band-room", async () => {
          const room = await createBandRoom(`${workflowInfo.name} - ${inngestEventId}`);
          if (room) {
            await prisma.execution.update({
              where: { inngestEventId },
              data: { bandRoomId: room.id },
            });
          }
          return room?.id ?? null;
        })
      : null;

    let context: Record<string, unknown> = event.data.initialData || {};
    const executionSteps: ExecutionStep[] = [];

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      try {
        context = await executor({
          data: node.data as Record<string, unknown>,
          nodeId: node.id,
          userId,
          context,
          step,
          publish,
          bandRoomId,
        });

        const varName = (node.data as Record<string, unknown>)?.variableName as string | undefined;
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

      // Save intermediate progress so the execution page can show live steps
      await step.run(`save-progress-${node.id}`, async () => {
        return prisma.execution.update({
          where: { inngestEventId },
          data: { output: JSON.parse(JSON.stringify({ _steps: executionSteps, ...context })) },
        });
      });
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

    return { workflowId, result: context };
  },
);
