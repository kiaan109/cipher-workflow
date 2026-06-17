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

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !userId) {
    await publish(instagramChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Instagram node: Platform credentials not configured (INSTAGRAM_ACCESS_TOKEN / INSTAGRAM_USER_ID)");
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
      const mediaRes = await ky.post(
        `https://graph.facebook.com/v21.0/${userId}/media`,
        {
          json: {
            image_url: imageUrl,
            caption,
            access_token: accessToken,
          },
        },
      ).json<{ id: string }>();

      const publishRes = await ky.post(
        `https://graph.facebook.com/v21.0/${userId}/media_publish`,
        {
          json: {
            creation_id: mediaRes.id,
            access_token: accessToken,
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
