import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { mistralChannel } from "@/inngest/channels/mistral";
import { sendBandMessage } from "@/lib/band";
import ky from "ky";

Handlebars.registerHelper("json", (ctx) => new Handlebars.SafeString(JSON.stringify(ctx, null, 2)));

const AGENT_NAME = "Mistral Agent";
const MODEL = "mistralai/mistral-7b-instruct:free";

type MistralData = { variableName?: string; systemPrompt?: string; userPrompt?: string };

export const mistralExecutor: NodeExecutor<MistralData> = async ({ data, nodeId, context, step, publish, bandRoomId }) => {
  await publish(mistralChannel().status({ nodeId, status: "loading" }));

  if (!data.variableName) {
    await publish(mistralChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Mistral node: Variable name is missing");
  }
  if (!data.userPrompt) {
    await publish(mistralChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Mistral node: User prompt is missing");
  }

  const systemPrompt = data.systemPrompt
    ? decode(Handlebars.compile(data.systemPrompt)(context))
    : "You are a helpful assistant.";
  const userPrompt = decode(Handlebars.compile(data.userPrompt)(context));

  if (bandRoomId) {
    await step.run("band-post-prompt", () => sendBandMessage(bandRoomId, AGENT_NAME, `Prompt:\n${userPrompt}`));
  }

  try {
    const result = await step.run("mistral-generate", async () => {
      const res = await ky.post("https://openrouter.ai/api/v1/chat/completions", {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://cipher-app-tau.vercel.app",
          "X-Title": "Cipher Mistral Agent",
        },
        json: {
          model: MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        },
        timeout: 60000,
      }).json<{ choices: { message: { content: string } }[] }>();
      return res.choices[0]?.message?.content || "";
    });

    if (bandRoomId) {
      await step.run("band-post-response", () => sendBandMessage(bandRoomId, AGENT_NAME, `Response:\n${result}`));
    }

    await publish(mistralChannel().status({ nodeId, status: "success" }));
    return { ...context, [data.variableName]: { text: result } };
  } catch (error) {
    await publish(mistralChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
