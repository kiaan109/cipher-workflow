"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { linkedinChannel } from "@/inngest/channels/linkedin";
import { inngest } from "@/inngest/client";

export type LinkedinToken = Realtime.Token<
  typeof linkedinChannel,
  ["status"]
>;

export async function fetchLinkedinToken(): Promise<LinkedinToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: linkedinChannel(),
    topics: ["status"],
  });

  return token;
};

export async function fetchLinkedinCredentials() {
  return {
    accessToken: process.env.LINKEDIN_ACCESS_TOKEN ?? "",
    personUrn: process.env.LINKEDIN_PERSON_URN ?? "",
  };
}
