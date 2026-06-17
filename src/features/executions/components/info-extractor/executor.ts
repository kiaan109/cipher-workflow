import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { cipherChannel } from "@/inngest/channels/cipher";
import ky from "ky";

Handlebars.registerHelper("json", (ctx) => new Handlebars.SafeString(JSON.stringify(ctx, null, 2)));

type InfoExtractorData = { variableName?: string; text?: string; schema?: string; model?: string };

export const infoExtractorExecutor: NodeExecutor<InfoExtractorData> = async ({ data, nodeId, context, step, publish }) => {
  await publish(cipherChannel().status({ nodeId, status: "loading" }));
  if (!data.variableName) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Info Extractor: Variable name required"); }
  if (!data.text) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Info Extractor: Text required"); }

  const text = decode(Handlebars.compile(data.text)(context));
  const schema = data.schema || "{ name, email, phone, company }";
  const model = data.model || "google/gemma-3-27b-it:free";
  const systemPrompt = `Extract structured information from the text. Return a JSON object matching this schema: ${schema}. Use null for missing fields.`;

  try {
    const result = await step.run("info-extractor-run", async () => {
      const res = await ky.post("https://openrouter.ai/api/v1/chat/completions", {
        headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, "Content-Type": "application/json", "HTTP-Referer": "https://cipher-app-tau.vercel.app", "X-Title": "Cipher" },
        json: { model, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: text }], response_format: { type: "json_object" } },
        timeout: 60000,
      }).json<{ choices: { message: { content: string } }[] }>();
      let parsed: unknown;
      try { parsed = JSON.parse(res.choices[0]?.message?.content || "{}"); } catch { parsed = { raw: res.choices[0]?.message?.content }; }
      return { ...context, [data.variableName!]: parsed };
    });
    await publish(cipherChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (err) {
    await publish(cipherChannel().status({ nodeId, status: "error" }));
    throw err;
  }
};
