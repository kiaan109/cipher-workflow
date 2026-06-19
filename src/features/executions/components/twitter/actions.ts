"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { twitterChannel } from "@/inngest/channels/twitter";
import { inngest } from "@/inngest/client";

export type TwitterToken = Realtime.Token<
  typeof twitterChannel,
  ["status"]
>;

export async function fetchTwitterToken(): Promise<TwitterToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: twitterChannel(),
    topics: ["status"],
  });

  return token;
};

export async function fetchTwitterCredentials() {
  return {
    apiKey: process.env.TWITTER_API_KEY ?? "",
    apiKeySecret: process.env.TWITTER_API_KEY_SECRET ?? "",
    accessToken: process.env.TWITTER_ACCESS_TOKEN ?? "",
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET ?? "",
  };
}
