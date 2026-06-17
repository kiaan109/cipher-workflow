import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { qwenChannel } from "@/inngest/channels/qwen";
import { sendBandMessage } from "@/lib/band";
import ky from "ky";

Handlebars.registerHelper("json", (ctx) => new Handlebars.SafeString(JSON.stringify(ctx, null, 2)));

const AGENT_NAME = "Qwen Agent";
const MODEL = "qwen/qwen-2.5-72b-instruct:free";

type QwenData = { variableName?: string; systemPrompt?: string; userPrompt?: string };

export const qwenExecutor: NodeExecutor<QwenData> = async ({ data, nodeId, context, step, publish, bandRoomId }) => {
  await publish(qwenChannel().status({ nodeId, status: "loading" }));

  if (!data.variableName) {
    await publish(qwenChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Qwen node: Variable name is missing");
  }
  if (!data.userPrompt) {
    await publish(qwenChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Qwen node: User prompt is missing");
  }

  const systemPrompt = data.systemPrompt
    ? decode(Handlebars.compile(data.systemPrompt)(context))
    : "You are a helpful assistant.";
  const userPrompt = decode(Handlebars.compile(data.userPrompt)(context));

  if (bandRoomId) {
    await step.run("band-post-prompt", () => sendBandMessage(bandRoomId, AGENT_NAME, `Prompt:\n${userPrompt}`));
  }

  try {
    const result = await step.run("qwen-generate", async () => {
      const res = await ky.post("https://openrouter.ai/api/v1/chat/completions", {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://cipher-app-tau.vercel.app",
          "X-Title": "Cipher Qwen Agent",
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

    await publish(qwenChannel().status({ nodeId, status: "success" }));
    return { ...context, [data.variableName]: { text: result } };
  } catch (error) {
    await publish(qwenChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
