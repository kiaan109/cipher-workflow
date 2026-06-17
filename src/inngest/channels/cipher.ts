import { channel, topic } from "@inngest/realtime";

export const CIPHER_CHANNEL_NAME = "cipher-execution";

export const cipherChannel = channel(CIPHER_CHANNEL_NAME)
  .addTopic(
    topic("status").type<{
      nodeId: string;
      status: "loading" | "success" | "error";
    }>(),
  );
