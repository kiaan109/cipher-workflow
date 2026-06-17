import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { cipherChannel } from "@/inngest/channels/cipher";
import ky from "ky";

Handlebars.registerHelper("json", (ctx) => new Handlebars.SafeString(JSON.stringify(ctx, null, 2)));

type VectorStoreData = { variableName?: string; operation?: string; indexHost?: string; vector?: string; id?: string; metadata?: string; topK?: number };

export const vectorStoreExecutor: NodeExecutor<VectorStoreData> = async ({ data, nodeId, context, step, publish }) => {
  await publish(cipherChannel().status({ nodeId, status: "loading" }));
  if (!data.variableName) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Vector Store: Variable name required"); }
  if (!data.indexHost) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Vector Store: Index host required"); }

  const operation = data.operation || "query";
  const indexHost = decode(Handlebars.compile(data.indexHost)(context));

  try {
    const result = await step.run("vector-store-run", async () => {
      const headers = { "Api-Key": process.env.PINECONE_API_KEY || "", "Content-Type": "application/json" };
      if (operation === "upsert") {
        const vector = JSON.parse(decode(Handlebars.compile(data.vector || "[]")(context)));
        const metadata = data.metadata ? JSON.parse(decode(Handlebars.compile(data.metadata)(context))) : {};
        const id = decode(Handlebars.compile(data.id || `vec-${Date.now()}`)(context));
        const res = await ky.post(`${indexHost}/vectors/upsert`, { headers, json: { vectors: [{ id, values: vector, metadata }] }, timeout: 30000 }).json();
        return { ...context, [data.variableName!]: { operation: "upsert", id, result: res } };
      } else {
        const vector = JSON.parse(decode(Handlebars.compile(data.vector || "[]")(context)));
        const res = await ky.post(`${indexHost}/query`, { headers, json: { vector, topK: data.topK || 5, includeMetadata: true }, timeout: 30000 }).json<{ matches: unknown[] }>();
        return { ...context, [data.variableName!]: { operation: "query", matches: res.matches } };
      }
    });
    await publish(cipherChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (err) {
    await publish(cipherChannel().status({ nodeId, status: "error" }));
    throw err;
  }
};
