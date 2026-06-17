import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { cipherChannel } from "@/inngest/channels/cipher";

Handlebars.registerHelper("json", (ctx) => new Handlebars.SafeString(JSON.stringify(ctx, null, 2)));

type TextSplitterData = { variableName?: string; text?: string; chunkSize?: number; overlap?: number; splitBy?: string };

export const textSplitterExecutor: NodeExecutor<TextSplitterData> = async ({ data, nodeId, context, step, publish }) => {
  await publish(cipherChannel().status({ nodeId, status: "loading" }));
  if (!data.variableName) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Text Splitter: Variable name required"); }
  if (!data.text) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Text Splitter: Text required"); }

  const text = decode(Handlebars.compile(data.text)(context));
  const chunkSize = data.chunkSize || 1000;
  const overlap = data.overlap || 200;
  const splitBy = data.splitBy || "characters";

  try {
    const result = await step.run("text-splitter-run", async () => {
      let chunks: string[] = [];
      if (splitBy === "paragraphs") {
        chunks = text.split(/\n\n+/).filter(Boolean);
      } else if (splitBy === "sentences") {
        chunks = text.split(/(?<=[.!?])\s+/).filter(Boolean);
      } else {
        for (let i = 0; i < text.length; i += chunkSize - overlap) {
          chunks.push(text.slice(i, i + chunkSize));
          if (i + chunkSize >= text.length) break;
        }
      }
      return { ...context, [data.variableName!]: { chunks, count: chunks.length, totalLength: text.length } };
    });
    await publish(cipherChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (err) {
    await publish(cipherChannel().status({ nodeId, status: "error" }));
    throw err;
  }
};
