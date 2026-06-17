import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { smsChannel } from "@/inngest/channels/sms";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

type SmsData = {
  variableName?: string;
  accountSid?: string;
  authToken?: string;
  to?: string;
  from?: string;
  body?: string;
};

export const smsExecutor: NodeExecutor<SmsData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(smsChannel().status({ nodeId, status: "loading" }));

  if (!data.accountSid) {
    await publish(smsChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("SMS node: Account SID is required");
  }
  if (!data.authToken) {
    await publish(smsChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("SMS node: Auth token is required");
  }
  if (!data.to) {
    await publish(smsChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("SMS node: Recipient phone number is required");
  }
  if (!data.from) {
    await publish(smsChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("SMS node: Sender phone number is required");
  }
  if (!data.body) {
    await publish(smsChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("SMS node: Message body is required");
  }
  if (!data.variableName) {
    await publish(smsChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("SMS node: Variable name is required");
  }

  const body = decode(Handlebars.compile(data.body)(context));

  try {
    const result = await step.run("sms-send", async () => {
      const credentials = Buffer.from(`${data.accountSid}:${data.authToken}`).toString("base64");
      const params = new URLSearchParams({ To: data.to!, From: data.from!, Body: body });

      const response = await ky.post(
        `https://api.twilio.com/2010-04-01/Accounts/${data.accountSid}/Messages.json`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        },
      ).json<{ sid: string; status: string }>();

      return {
        ...context,
        [data.variableName!]: { messageSid: response.sid, status: response.status, body },
      };
    });

    await publish(smsChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (error) {
    await publish(smsChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
