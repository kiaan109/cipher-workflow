import { createOpenAI } from "@ai-sdk/openai";

/**
 * Single OpenRouter client used by every AI node. OpenRouter exposes an
 * OpenAI-compatible Chat Completions API, so the `@ai-sdk/openai` provider
 * works against it by overriding the base URL.
 */
export const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://cipher.app",
    "X-Title": "Cipher",
  },
});

/**
 * Free-tier OpenRouter model IDs. Each AI node type is mapped to a distinct
 * free model so the three "agent" nodes have different personalities/voices
 * while costing $0 to run.
 */
export const OPENROUTER_FREE_MODELS = {
  OPENAI: "meta-llama/llama-3.3-8b-instruct:free",
  ANTHROPIC: "deepseek/deepseek-r1:free",
  GEMINI: "google/gemma-3-27b-it:free",
  MISTRAL: "mistralai/mistral-7b-instruct:free",
  QWEN: "qwen/qwen3-8b:free",
} as const;

export type OpenRouterAgentRole = keyof typeof OPENROUTER_FREE_MODELS;
