import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { generateText } from "ai";
import type { NodeExecutor } from "@/features/executions/types";
import { openAiChannel } from "@/inngest/channels/openai";
import { openrouter, OPENROUTER_FREE_MODELS } from "@/lib/openrouter";
import { sendBandMessage } from "@/lib/band";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

const AGENT_NAME = "OpenAI Agent";

type OpenAiData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const openAiExecutor: NodeExecutor<OpenAiData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
  bandRoomId,
}) => {
  await publish(
    openAiChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.variableName) {
    await publish(
      openAiChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("OpenAi node: Variable name is missing");
  }

  if (!data.userPrompt) {
    await publish(
      openAiChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("OpenAi node: User prompt is missing");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  if (bandRoomId) {
    await step.run("band-post-prompt", () =>
      sendBandMessage(bandRoomId, AGENT_NAME, `Prompt:\n${userPrompt}`),
    );
  }

  try {
    const { steps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        model: openrouter(OPENROUTER_FREE_MODELS.OPENAI),
        system: systemPrompt,
        prompt: userPrompt,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    const text =
      steps[0].content[0].type === "text"
        ? steps[0].content[0].text
        : "";

    if (bandRoomId) {
      await step.run("band-post-response", () =>
        sendBandMessage(bandRoomId, AGENT_NAME, `Response:\n${text}`),
      );
    }

    await publish(
      openAiChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return {
      ...context,
      [data.variableName]: {
        text,
      },
    }
  } catch (error) {
     await publish(
      openAiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
