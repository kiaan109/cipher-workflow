import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { cipherChannel } from "@/inngest/channels/cipher";
import { renderTemplate } from "@/lib/template";
import { callLLM } from "@/lib/llm";

type SummarizerData = { variableName?: string; text?: string; style?: string; model?: string };

export const summarizerExecutor: NodeExecutor<SummarizerData> = async ({ data, nodeId, context, step, publish }) => {
  await publish(cipherChannel().status({ nodeId, status: "loading" }));
  if (!data.variableName) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Summarizer: Variable name required"); }
  if (!data.text) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Summarizer: Text required"); }

  const text = decode(renderTemplate(data.text, context as Record<string, unknown>));
  const style = data.style || "concise";
  const model = data.model || "openai/gpt-oss-20b:free";
  const systemPrompt = `You are an expert summarizer. Summarize the following text in a ${style} manner. Return only the summary, no preamble.`;

  try {
    const summary = await step.run(`summarizer-run-${nodeId}`, () =>
      callLLM([{ role: "system", content: systemPrompt }, { role: "user", content: text }], model),
    );
    await publish(cipherChannel().status({ nodeId, status: "success" }));
    return { ...context, [data.variableName!]: { summary, originalLength: text.length } };
  } catch (err) {
    await publish(cipherChannel().status({ nodeId, status: "error" }));
    throw err;
  }
};
