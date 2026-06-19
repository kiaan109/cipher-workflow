"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { emailChannel } from "@/inngest/channels/email";
import { inngest } from "@/inngest/client";

export type EmailToken = Realtime.Token<
  typeof emailChannel,
  ["status"]
>;

export async function fetchEmailToken(): Promise<EmailToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: emailChannel(),
    topics: ["status"],
  });

  return token;
};

export async function fetchEmailCredentials() {
  return {
    apiKey: process.env.RESEND_API_KEY ?? "",
    fromEmail: process.env.RESEND_FROM_EMAIL ?? "Cipher AI <onboarding@resend.dev>",
  };
}
