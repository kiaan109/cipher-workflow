"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { whatsappChannel } from "@/inngest/channels/whatsapp";
import { inngest } from "@/inngest/client";

export async function fetchWhatsappCredentials() {
  return {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN ?? "",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ?? "",
  };
}

export type WhatsappToken = Realtime.Token<
  typeof whatsappChannel,
  ["status"]
>;

export async function fetchWhatsappToken(): Promise<WhatsappToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: whatsappChannel(),
    topics: ["status"],
  });

  return token;
};
