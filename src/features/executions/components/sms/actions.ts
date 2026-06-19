"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { smsChannel } from "@/inngest/channels/sms";
import { inngest } from "@/inngest/client";

export type SmsToken = Realtime.Token<
  typeof smsChannel,
  ["status"]
>;

export async function fetchSmsToken(): Promise<SmsToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: smsChannel(),
    topics: ["status"],
  });

  return token;
};

export async function fetchSmsCredentials() {
  return {
    accountSid: process.env.TWILIO_ACCOUNT_SID ?? "",
    authToken: process.env.TWILIO_AUTH_TOKEN ?? "",
    from: process.env.TWILIO_FROM_NUMBER ?? "",
  };
}
