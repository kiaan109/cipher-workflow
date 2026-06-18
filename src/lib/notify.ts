/**
 * Sends workflow notification emails via Resend.
 * Used by both the execute route and Inngest function.
 */

const RESEND_API = "https://api.resend.com/emails";

export async function sendWorkflowEmail({
  to,
  workflowName,
  executionId,
  status,
  error,
  appUrl,
}: {
  to: string;
  workflowName: string;
  executionId: string;
  status: "started" | "success" | "failed";
  error?: string;
  appUrl?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "noreply@arabyshanaya.com";
  const base = appUrl || process.env.NEXT_PUBLIC_APP_URL || "https://cipher-app-tau.vercel.app";
  const link = `${base}/executions/${executionId}`;

  const subjects: Record<typeof status, string> = {
    started: `⚡ Workflow "${workflowName}" is running`,
    success: `✅ Workflow "${workflowName}" completed successfully`,
    failed: `❌ Workflow "${workflowName}" failed`,
  };

  const bodies: Record<typeof status, string> = {
    started: `Hi,\n\nYour Cipher workflow "${workflowName}" has started running.\n\nYou can safely close the tab — we'll email you as soon as it finishes.\n\nWatch it live:\n${link}\n\n— Cipher`,
    success: `Hi,\n\nGreat news! Your Cipher workflow "${workflowName}" completed successfully.\n\nView the full results here:\n${link}\n\n— Cipher`,
    failed: `Hi,\n\nYour Cipher workflow "${workflowName}" encountered an error and stopped.\n\n${error ? `Error: ${error}\n\n` : ""}View the execution details:\n${link}\n\n— Cipher`,
  };

  try {
    await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: subjects[status],
        text: bodies[status],
      }),
    });
  } catch (e) {
    console.warn("[notify] Failed to send workflow email:", e);
  }
}
