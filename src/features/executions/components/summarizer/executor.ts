import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { cipherChannel } from "@/inngest/channels/cipher";
import ky from "ky";

Handlebars.registerHelper("json", (ctx) => new Handlebars.SafeString(JSON.stringify(ctx, null, 2)));

type SummarizerData = { variableName?: string; text?: string; style?: string; model?: string };

export const summarizerExecutor: NodeExecutor<SummarizerData> = async ({ data, nodeId, context, step, publish }) => {
  await publish(cipherChannel().status({ nodeId, status: "loading" }));
  if (!data.variableName) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Summarizer: Variable name required"); }
  if (!data.text) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Summarizer: Text required"); }

  const text = decode(Handlebars.compile(data.text)(context));
  const style = data.style || "concise";
  const model = data.model || "google/gemma-3-27b-it:free";
  const systemPrompt = `You are an expert summarizer. Summarize the following text in a ${style} manner. Return only the summary, no preamble.`;

  try {
    const result = await step.run("summarizer-run", async () => {
      const res = await ky.post("https://openrouter.ai/api/v1/chat/completions", {
        headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, "Content-Type": "application/json", "HTTP-Referer": "https://cipher-app-tau.vercel.app", "X-Title": "Cipher" },
        json: { model, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: text }] },
        timeout: 60000,
      }).json<{ choices: { message: { content: string } }[] }>();
      return { ...context, [data.variableName!]: { summary: res.choices[0]?.message?.content || "", originalLength: text.length } };
    });
    await publish(cipherChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (err) {
    await publish(cipherChannel().status({ nodeId, status: "error" }));
    throw err;
  }
};
