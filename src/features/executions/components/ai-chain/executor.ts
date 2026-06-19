import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { cipherChannel } from "@/inngest/channels/cipher";
import { sendBandMessage } from "@/lib/band";
import { renderTemplate } from "@/lib/template";
import { callLLM } from "@/lib/llm";

type AiChainData = { variableName?: string; prompt?: string; model?: string; name?: string };

export const aiChainExecutor: NodeExecutor<AiChainData> = async ({ data, nodeId, context, step, publish, bandRoomId }) => {
  await publish(cipherChannel().status({ nodeId, status: "loading" }));
  if (!data.variableName) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("AI Chain: Variable name required"); }
  if (!data.prompt) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("AI Chain: Prompt required"); }

  const prompt = decode(renderTemplate(data.prompt, context as Record<string, unknown>));
  const model = data.model || "openai/gpt-oss-20b:free";
  const agentName = data.name || "AI Chain";

  if (bandRoomId) void sendBandMessage(bandRoomId, agentName, `📥 Processing:\n${prompt}`);

  try {
    const text = await step.run(`ai-chain-run-${nodeId}`, () =>
      callLLM([{ role: "user", content: prompt }], model),
    );
    if (bandRoomId) void sendBandMessage(bandRoomId, agentName, `✅ Response:\n${text}`);
    await publish(cipherChannel().status({ nodeId, status: "success" }));
    return { ...context, [data.variableName!]: { text, model } };
  } catch (err) {
    if (bandRoomId) void sendBandMessage(bandRoomId, agentName, `❌ Error: ${err instanceof Error ? err.message : String(err)}`);
    await publish(cipherChannel().status({ nodeId, status: "error" }));
    throw err;
  }
};
