import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { geminiChannel } from "@/inngest/channels/gemini";
import { sendBandMessage } from "@/lib/band";
import { renderTemplate } from "@/lib/template";
import { callLLM } from "@/lib/llm";

const AGENT_NAME = "Gemini Agent";

type GeminiData = { variableName?: string; systemPrompt?: string; userPrompt?: string };

export const geminiExecutor: NodeExecutor<GeminiData> = async ({ data, nodeId, context, step, publish, bandRoomId }) => {
  await publish(geminiChannel().status({ nodeId, status: "loading" }));

  if (!data.variableName) { await publish(geminiChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Gemini node: Variable name is missing"); }
  if (!data.userPrompt) { await publish(geminiChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Gemini node: User prompt is missing"); }

  const ctx = context as Record<string, unknown>;
  const systemPrompt = data.systemPrompt ? decode(renderTemplate(data.systemPrompt, ctx)) : "You are a helpful assistant.";
  const userPrompt = decode(renderTemplate(data.userPrompt, ctx));

  if (bandRoomId) await step.run("band-post-prompt", () => sendBandMessage(bandRoomId, AGENT_NAME, `Prompt:\n${userPrompt}`));

  try {
    const text = await step.run("gemini-generate", () =>
      callLLM([{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }], "google/gemma-4-26b-a4b-it:free"),
    );
    if (bandRoomId) await step.run("band-post-response", () => sendBandMessage(bandRoomId, AGENT_NAME, `Response:\n${text}`));
    await publish(geminiChannel().status({ nodeId, status: "success" }));
    return { ...context, [data.variableName]: { text } };
  } catch (error) {
    await publish(geminiChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
