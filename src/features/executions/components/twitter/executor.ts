import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { twitterChannel } from "@/inngest/channels/twitter";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

type TwitterData = {
  variableName?: string;
  bearerToken?: string;
  text?: string;
};

export const twitterExecutor: NodeExecutor<TwitterData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(twitterChannel().status({ nodeId, status: "loading" }));

  if (!data.bearerToken) {
    await publish(twitterChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Twitter node: Bearer token is required");
  }
  if (!data.text) {
    await publish(twitterChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Twitter node: Tweet text is required");
  }
  if (!data.variableName) {
    await publish(twitterChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Twitter node: Variable name is required");
  }

  const text = decode(Handlebars.compile(data.text)(context)).slice(0, 280);

  try {
    const result = await step.run("twitter-post-tweet", async () => {
      const response = await ky.post("https://api.twitter.com/2/tweets", {
        headers: {
          Authorization: `Bearer ${data.bearerToken}`,
          "Content-Type": "application/json",
        },
        json: { text },
      }).json<{ data: { id: string; text: string } }>();

      return {
        ...context,
        [data.variableName!]: {
          tweetId: response.data.id,
          text: response.data.text,
        },
      };
    });

    await publish(twitterChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (error) {
    await publish(twitterChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
