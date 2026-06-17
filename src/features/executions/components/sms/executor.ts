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
  to?: string;
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

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !from) {
    await publish(smsChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("SMS node: Platform Twilio credentials not configured (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER)");
  }
  if (!data.to) {
    await publish(smsChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("SMS node: Recipient phone number is required");
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
      const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
      const params = new URLSearchParams({ To: data.to!, From: from, Body: body });

      const response = await ky.post(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
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
        [data.variableName!]: { messageSid: response.sid, status: response.status, to: data.to, body },
      };
    });

    await publish(smsChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (error) {
    await publish(smsChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
