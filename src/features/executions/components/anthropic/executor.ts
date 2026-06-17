import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import { sendBandMessage } from "@/lib/band";
import ky from "ky";

Handlebars.registerHelper("json", (ctx) => new Handlebars.SafeString(JSON.stringify(ctx, null, 2)));

const AGENT_NAME = "Anthropic Agent";
const MODEL = "deepseek/deepseek-r1:free";

type AnthropicData = { variableName?: string; systemPrompt?: string; userPrompt?: string };

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({ data, nodeId, context, step, publish, bandRoomId }) => {
  await publish(anthropicChannel().status({ nodeId, status: "loading" }));

  if (!data.variableName) {
    await publish(anthropicChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Anthropic node: Variable name is missing");
  }
  if (!data.userPrompt) {
    await publish(anthropicChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Anthropic node: User prompt is missing");
  }

  const systemPrompt = data.systemPrompt
    ? decode(Handlebars.compile(data.systemPrompt)(context))
    : "You are a helpful assistant.";
  const userPrompt = decode(Handlebars.compile(data.userPrompt)(context));

  if (bandRoomId) {
    await step.run("band-post-prompt", () => sendBandMessage(bandRoomId, AGENT_NAME, `Prompt:\n${userPrompt}`));
  }

  try {
    const result = await step.run("anthropic-generate", async () => {
      const res = await ky.post("https://openrouter.ai/api/v1/chat/completions", {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://cipher-app-tau.vercel.app",
          "X-Title": "Cipher Anthropic Agent",
        },
        json: {
          model: MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        },
        timeout: 90000,
      }).json<{ choices: { message: { content: string } }[] }>();
      return res.choices[0]?.message?.content || "";
    });

    if (bandRoomId) {
      await step.run("band-post-response", () => sendBandMessage(bandRoomId, AGENT_NAME, `Response:\n${result}`));
    }

    await publish(anthropicChannel().status({ nodeId, status: "success" }));
    return { ...context, [data.variableName]: { text: result } };
  } catch (error) {
    await publish(anthropicChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
