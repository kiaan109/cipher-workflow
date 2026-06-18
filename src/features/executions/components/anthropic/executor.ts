import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import { sendBandMessage } from "@/lib/band";
import { renderTemplate } from "@/lib/template";
import { callLLM } from "@/lib/llm";

const AGENT_NAME = "Anthropic Agent";

type AnthropicData = { variableName?: string; systemPrompt?: string; userPrompt?: string };

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({ data, nodeId, context, step, publish, bandRoomId }) => {
  await publish(anthropicChannel().status({ nodeId, status: "loading" }));

  if (!data.variableName) { await publish(anthropicChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Anthropic node: Variable name is missing"); }
  if (!data.userPrompt) { await publish(anthropicChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Anthropic node: User prompt is missing"); }

  const ctx = context as Record<string, unknown>;
  const systemPrompt = data.systemPrompt ? decode(renderTemplate(data.systemPrompt, ctx)) : "You are a helpful assistant.";
  const userPrompt = decode(renderTemplate(data.userPrompt, ctx));

  if (bandRoomId) void sendBandMessage(bandRoomId, AGENT_NAME, `Prompt:\n${userPrompt}`);

  try {
    const text = await step.run(`anthropic-generate-${nodeId}`, () =>
      callLLM([{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }], "openai/gpt-oss-20b:free"),
    );
    if (bandRoomId) void sendBandMessage(bandRoomId, AGENT_NAME, `Response:\n${text}`);
    await publish(anthropicChannel().status({ nodeId, status: "success" }));
    return { ...context, [data.variableName]: { text } };
  } catch (error) {
    await publish(anthropicChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};



