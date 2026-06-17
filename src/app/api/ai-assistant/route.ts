import { streamText } from "ai";
import { openrouter } from "@/lib/openrouter";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const result = streamText({
      model: openrouter("google/gemma-3-27b-it:free"),
      system: "You are Cipher AI, an expert at building workflow automations. Help users connect apps, write prompts for AI nodes, debug workflows, and get the most out of Cipher. Be concise and practical.",
      messages,
    });
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("[ai-assistant]", error);
    return new Response(JSON.stringify({ error: "AI assistant unavailable" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
