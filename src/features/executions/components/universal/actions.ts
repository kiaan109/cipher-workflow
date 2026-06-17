"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { cipherChannel } from "@/inngest/channels/cipher";
import { inngest } from "@/inngest/client";

export type CipherToken = Realtime.Token<typeof cipherChannel, ["status"]>;

export async function fetchCipherToken(): Promise<CipherToken> {
  return getSubscriptionToken(inngest, { channel: cipherChannel(), topics: ["status"] });
}
