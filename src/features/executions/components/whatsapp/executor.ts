import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { whatsappChannel } from "@/inngest/channels/whatsapp";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

type WhatsAppData = {
  variableName?: string;
  accessToken?: string;
  phoneNumberId?: string;
  to?: string;
  message?: string;
};

export const whatsappExecutor: NodeExecutor<WhatsAppData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(whatsappChannel().status({ nodeId, status: "loading" }));

  const accessToken = data.accessToken || process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = data.phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    await publish(whatsappChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("WhatsApp node: Access Token and Phone Number ID are required (from Meta Business → WhatsApp Cloud API)");
  }
  if (!data.to) {
    await publish(whatsappChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("WhatsApp node: Recipient phone number is required");
  }
  if (!data.message) {
    await publish(whatsappChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("WhatsApp node: Message is required");
  }
  if (!data.variableName) {
    await publish(whatsappChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("WhatsApp node: Variable name is required");
  }

  const message = decode(Handlebars.compile(data.message)(context));

  try {
    const result = await step.run("whatsapp-send-message", async () => {
      const response = await ky.post(
        `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          json: {
            messaging_product: "whatsapp",
            to: data.to,
            type: "text",
            text: { body: message },
          },
          timeout: 30000,
        },
      ).json<{ messages: Array<{ id: string }> }>();

      return {
        ...context,
        [data.variableName!]: {
          messageId: response.messages[0]?.id,
          to: data.to,
          message,
        },
      };
    });

    await publish(whatsappChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (error) {
    await publish(whatsappChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
