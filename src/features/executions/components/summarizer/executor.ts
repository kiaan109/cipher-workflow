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

  let text = decode(renderTemplate(data.text, context as Record<string, unknown>));
  // If rendered text looks like a JSON object/array, try to extract readable text from it
  if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      const extract = (obj: unknown): string => {
        if (typeof obj === "string") return obj;
        if (Array.isArray(obj)) return obj.map(extract).join(" ");
        if (obj && typeof obj === "object") {
          const o = obj as Record<string, unknown>;
          for (const k of ["text", "content", "body", "message", "summary", "description"]) {
            if (typeof o[k] === "string" && (o[k] as string).length > 10) return o[k] as string;
          }
          return Object.values(o).map(extract).filter(Boolean).join(" ");
        }
        return "";
      };
      const extracted = extract(parsed).trim();
      if (extracted) text = extracted;
    } catch { /* keep original text */ }
  }
  const style = data.style || "concise";
  const model = data.model || "meta-llama/llama-3.3-70b-instruct:free";
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
