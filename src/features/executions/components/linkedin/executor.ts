import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { linkedinChannel } from "@/inngest/channels/linkedin";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

type LinkedInData = {
  variableName?: string;
  accessToken?: string;
  personUrn?: string;
  text?: string;
};

export const linkedinExecutor: NodeExecutor<LinkedInData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(linkedinChannel().status({ nodeId, status: "loading" }));

  if (!data.accessToken) {
    await publish(linkedinChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("LinkedIn node: Access token is required");
  }
  if (!data.personUrn) {
    await publish(linkedinChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("LinkedIn node: Person URN is required (e.g. urn:li:person:ABC123)");
  }
  if (!data.text) {
    await publish(linkedinChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("LinkedIn node: Post text is required");
  }
  if (!data.variableName) {
    await publish(linkedinChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("LinkedIn node: Variable name is required");
  }

  const text = decode(Handlebars.compile(data.text)(context)).slice(0, 3000);

  try {
    const result = await step.run("linkedin-post-update", async () => {
      const response = await ky.post("https://api.linkedin.com/v2/ugcPosts", {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        json: {
          author: data.personUrn,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: { text },
              shareMediaCategory: "NONE",
            },
          },
          visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
        },
      }).json<{ id: string }>();

      return {
        ...context,
        [data.variableName!]: {
          postId: response.id,
          text,
        },
      };
    });

    await publish(linkedinChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (error) {
    await publish(linkedinChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
