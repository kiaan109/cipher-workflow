import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { emailChannel } from "@/inngest/channels/email";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

type EmailData = {
  variableName?: string;
  apiKey?: string;
  to?: string;
  subject?: string;
  body?: string;
  fromEmail?: string;
  fromName?: string;
};

export const emailExecutor: NodeExecutor<EmailData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(emailChannel().status({ nodeId, status: "loading" }));

  if (!data.apiKey) {
    await publish(emailChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Email node: SendGrid API key is required");
  }
  if (!data.to) {
    await publish(emailChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Email node: Recipient address is required");
  }
  if (!data.subject) {
    await publish(emailChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Email node: Subject is required");
  }
  if (!data.body) {
    await publish(emailChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Email node: Body is required");
  }
  if (!data.variableName) {
    await publish(emailChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Email node: Variable name is required");
  }

  const subject = decode(Handlebars.compile(data.subject)(context));
  const body = decode(Handlebars.compile(data.body)(context));
  const fromEmail = data.fromEmail || "noreply@cipher.app";
  const fromName = data.fromName || "Cipher";

  try {
    const result = await step.run("email-send", async () => {
      await ky.post("https://api.sendgrid.com/v3/mail/send", {
        headers: {
          Authorization: `Bearer ${data.apiKey}`,
          "Content-Type": "application/json",
        },
        json: {
          personalizations: [{ to: [{ email: data.to }], subject }],
          from: { email: fromEmail, name: fromName },
          content: [{ type: "text/html", value: body }],
        },
      });

      return {
        ...context,
        [data.variableName!]: { to: data.to, subject, sent: true },
      };
    });

    await publish(emailChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (error) {
    await publish(emailChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
