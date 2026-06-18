import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { cipherChannel } from "@/inngest/channels/cipher";
import { renderTemplate } from "@/lib/template";
import { callLLM } from "@/lib/llm";

type AiChainData = { variableName?: string; prompt?: string; model?: string };

export const aiChainExecutor: NodeExecutor<AiChainData> = async ({ data, nodeId, context, step, publish }) => {
  await publish(cipherChannel().status({ nodeId, status: "loading" }));
  if (!data.variableName) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("AI Chain: Variable name required"); }
  if (!data.prompt) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("AI Chain: Prompt required"); }

  const prompt = decode(renderTemplate(data.prompt, context as Record<string, unknown>));
  const model = data.model || "openai/gpt-oss-20b:free";

  try {
    const text = await step.run(`ai-chain-run-${nodeId}`, () =>
      callLLM([{ role: "user", content: prompt }], model),
    );
    await publish(cipherChannel().status({ nodeId, status: "success" }));
    return { ...context, [data.variableName!]: { text, model } };
  } catch (err) {
    await publish(cipherChannel().status({ nodeId, status: "error" }));
    throw err;
  }
};
