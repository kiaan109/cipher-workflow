import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { cipherChannel } from "@/inngest/channels/cipher";
import ky from "ky";

Handlebars.registerHelper("json", (ctx) => new Handlebars.SafeString(JSON.stringify(ctx, null, 2)));

type AiAgentData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
  model?: string;
  tools?: string;
  maxIterations?: number;
};

export const aiAgentExecutor: NodeExecutor<AiAgentData> = async ({ data, nodeId, context, step, publish }) => {
  await publish(cipherChannel().status({ nodeId, status: "loading" }));

  if (!data.variableName) {
    await publish(cipherChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("AI Agent: Variable name is required");
  }
  if (!data.userPrompt) {
    await publish(cipherChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("AI Agent: Prompt is required");
  }

  const model = data.model || "openai/gpt-oss-20b:free";
  const systemPrompt = decode(Handlebars.compile(data.systemPrompt || "You are a helpful AI agent. Complete the task given to you.")(context));
  const userPrompt = decode(Handlebars.compile(data.userPrompt)(context));

  try {
    const result = await step.run("ai-agent-run", async () => {
      const response = await ky.post("https://openrouter.ai/api/v1/chat/completions", {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://cipher-app-tau.vercel.app",
          "X-Title": "Cipher AI Agent",
        },
        json: {
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        },
        timeout: 60000,
      }).json<{ choices: { message: { content: string } }[] }>();

      const text = response.choices[0]?.message?.content || "";
      return {
        ...context,
        [data.variableName!]: { text, model, role: "agent" },
      };
    });

    await publish(cipherChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (error) {
    await publish(cipherChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
