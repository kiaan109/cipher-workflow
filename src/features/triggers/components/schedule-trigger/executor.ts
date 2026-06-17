import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { cipherChannel } from "@/inngest/channels/cipher";

type ScheduleData = { variableName?: string; cron?: string; timezone?: string };

export const scheduleTriggerExecutor: NodeExecutor<ScheduleData> = async ({ data, nodeId, context, step, publish }) => {
  await publish(cipherChannel().status({ nodeId, status: "loading" }));
  if (!data.variableName) { await publish(cipherChannel().status({ nodeId, status: "error" })); throw new NonRetriableError("Schedule: Variable name required"); }
  const result = await step.run("schedule-trigger", async () => {
    return { ...context, [data.variableName!]: { triggered: true, cron: data.cron || "0 9 * * *", timezone: data.timezone || "UTC", triggeredAt: new Date().toISOString() } };
  });
  await publish(cipherChannel().status({ nodeId, status: "success" }));
  return result;
};
