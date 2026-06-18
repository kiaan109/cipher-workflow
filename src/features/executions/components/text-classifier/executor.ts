import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { cipherChannel } from "@/inngest/channels/cipher";
import { renderTemplate } from "@/lib/template";
import { callLLM } from "@/lib/llm";

type TextClassifierData = { variableName?: string; text?: string; categories?: string; model?: string };

export const textClassifierExecutor: NodeExecutor<TextClassifierData> = async ({ data, nodeId, context, step, publish }) => {
  await publish(cipherChannel().status({ nodeId, status: "loading" }));
  if (!data.variableName) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Text Classifier: Variable name required"); }
  if (!data.text) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Text Classifier: Text required"); }
  if (!data.categories) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Text Classifier: Categories required"); }

  const text = decode(renderTemplate(data.text, context as Record<string, unknown>));
  const categories = data.categories;
  const model = data.model || "openai/gpt-oss-20b:free";
  const systemPrompt = `Classify the given text into exactly one of these categories: ${categories}. Respond with JSON: {"category": "...", "confidence": 0.0-1.0, "reasoning": "..."}`;

  try {
    const raw = await step.run(`text-classifier-run-${nodeId}`, () =>
      callLLM([{ role: "system", content: systemPrompt }, { role: "user", content: text }], model),
    );
    let parsed: unknown;
    try { parsed = JSON.parse(raw); } catch { parsed = { category: raw }; }
    await publish(cipherChannel().status({ nodeId, status: "success" }));
    return { ...context, [data.variableName!]: parsed };
  } catch (err) {
    await publish(cipherChannel().status({ nodeId, status: "error" }));
    throw err;
  }
};
