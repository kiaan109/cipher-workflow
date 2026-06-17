import { realtimeMiddleware } from "@inngest/realtime/middleware";
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "cipher",
  eventKey: process.env.INNGEST_EVENT_KEY ?? "local",
  middleware: [realtimeMiddleware()],
});
