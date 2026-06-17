import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { cipherChannel } from "@/inngest/channels/cipher";
import { renderTemplate } from "@/lib/template";
import ky from "ky";

type AiChainData = { variableName?: string; prompt?: string; model?: string };

export const aiChainExecutor: NodeExecutor<AiChainData> = async ({ data, nodeId, context, step, publish }) => {
  await publish(cipherChannel().status({ nodeId, status: "loading" }));
  if (!data.variableName) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("AI Chain: Variable name required"); }
  if (!data.prompt) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("AI Chain: Prompt required"); }

  const prompt = decode(renderTemplate(data.prompt, context as Record<string, unknown>));
  const model = data.model || "openai/gpt-oss-20b:free";

  try {
    const result = await step.run("ai-chain-run", async () => {
      const res = await ky.post("https://openrouter.ai/api/v1/chat/completions", {
        headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, "Content-Type": "application/json", "HTTP-Referer": "https://cipher-app-tau.vercel.app", "X-Title": "Cipher" },
        json: { model, messages: [{ role: "user", content: prompt }] },
        timeout: 60000,
      }).json<{ choices: { message: { content: string } }[] }>();
      return { ...context, [data.variableName!]: { text: res.choices[0]?.message?.content || "", model } };
    });
    await publish(cipherChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (err) {
    await publish(cipherChannel().status({ nodeId, status: "error" }));
    throw err;
  }
};
