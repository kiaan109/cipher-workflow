import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { instagramChannel } from "@/inngest/channels/instagram";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

type InstagramData = {
  variableName?: string;
  accessToken?: string;
  userId?: string;
  imageUrl?: string;
  caption?: string;
};

export const instagramExecutor: NodeExecutor<InstagramData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(instagramChannel().status({ nodeId, status: "loading" }));

  if (!data.accessToken) {
    await publish(instagramChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Instagram node: Access token is required");
  }
  if (!data.userId) {
    await publish(instagramChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Instagram node: User ID is required");
  }
  if (!data.imageUrl) {
    await publish(instagramChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Instagram node: Image URL is required");
  }
  if (!data.variableName) {
    await publish(instagramChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Instagram node: Variable name is required");
  }

  const caption = data.caption
    ? decode(Handlebars.compile(data.caption)(context))
    : "";
  const imageUrl = decode(Handlebars.compile(data.imageUrl)(context));

  try {
    const result = await step.run("instagram-post-media", async () => {
      // Step 1: Create media container
      const mediaRes = await ky.post(
        `https://graph.facebook.com/v21.0/${data.userId}/media`,
        {
          json: {
            image_url: imageUrl,
            caption,
            access_token: data.accessToken,
          },
        },
      ).json<{ id: string }>();

      // Step 2: Publish the container
      const publishRes = await ky.post(
        `https://graph.facebook.com/v21.0/${data.userId}/media_publish`,
        {
          json: {
            creation_id: mediaRes.id,
            access_token: data.accessToken,
          },
        },
      ).json<{ id: string }>();

      return {
        ...context,
        [data.variableName!]: {
          mediaId: publishRes.id,
          caption,
        },
      };
    });

    await publish(instagramChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (error) {
    await publish(instagramChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
