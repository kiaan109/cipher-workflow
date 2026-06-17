import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { cipherChannel } from "@/inngest/channels/cipher";
import ky from "ky";

Handlebars.registerHelper("json", (ctx) => new Handlebars.SafeString(JSON.stringify(ctx, null, 2)));

type EmbeddingsData = { variableName?: string; text?: string; model?: string };

export const embeddingsExecutor: NodeExecutor<EmbeddingsData> = async ({ data, nodeId, context, step, publish }) => {
  await publish(cipherChannel().status({ nodeId, status: "loading" }));
  if (!data.variableName) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Embeddings: Variable name required"); }
  if (!data.text) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Embeddings: Text required"); }

  const text = decode(Handlebars.compile(data.text)(context));
  const model = data.model || "text-embedding-3-small";

  try {
    const result = await step.run("embeddings-run", async () => {
      const res = await ky.post("https://api.openai.com/v1/embeddings", {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY}`, "Content-Type": "application/json" },
        json: { model, input: text },
        timeout: 30000,
      }).json<{ data: { embedding: number[] }[] }>();
      const embedding = res.data[0]?.embedding || [];
      return { ...context, [data.variableName!]: { embedding, dimensions: embedding.length, text } };
    });
    await publish(cipherChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (err) {
    await publish(cipherChannel().status({ nodeId, status: "error" }));
    throw err;
  }
};
