/**
 * Shared LLM call helper used by all AI executor nodes.
 * Tries models in order, each with a hard 15s timeout, falls through on failure.
 * On 429 rate-limit, waits 2s before trying the next model.
 * max_tokens capped at 800 to keep responses fast on free-tier models.
 */

const FAST_MODELS = [
  "liquid/lfm-2.5-1.2b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "openai/gpt-oss-20b:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "poolside/laguna-xs.2:free",
  "poolside/laguna-m.1:free",
  "google/gemma-4-26b-a4b-it:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "openai/gpt-oss-120b:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "liquid/lfm-2.5-1.2b-thinking:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "nvidia/nemotron-nano-12b-v2-vl:free",
  "cohere/north-mini-code:free",
  "nex-agi/nex-n2-pro:free",
];

// Unavailable/removed models — treated as instant fallback without API call
const DEAD_MODELS = new Set([
  "google/gemma-3-27b-it:free",
  "google/gemma-2-9b-it:free",
  "google/gemma-3-1b-it:free",
  "google/gemma-3-12b-it:free",
  "mistralai/mistral-7b-instruct:free",
  "qwen/qwen-2.5-7b-instruct:free",
]);

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`LLM timeout after ${ms}ms`)), ms),
    ),
  ]);
}

export async function callLLM(
  messages: { role: string; content: string }[],
  preferredModel?: string,
  maxTokens = 800,
): Promise<string> {
  const models = preferredModel
    ? [preferredModel, ...FAST_MODELS.filter((m) => m !== preferredModel)]
    : FAST_MODELS;

  let lastError: unknown;
  for (const model of models) {
    if (DEAD_MODELS.has(model)) {
      console.warn(`[llm] model ${model} skipped (known unavailable)`);
      lastError = new Error(`Model ${model} is unavailable`);
      continue;
    }
    try {
      const result = await withTimeout(
        fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://cipher-app-tau.vercel.app",
            "X-Title": "Cipher",
          },
          body: JSON.stringify({ model, messages, max_tokens: maxTokens }),
        }).then(async (r) => {
          if (r.status === 429) {
            // Rate limited — wait 2s before caller tries next model
            await new Promise(res => setTimeout(res, 2000));
            throw new Error(`HTTP 429 (rate limited)`);
          }
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          const json = await r.json() as { choices?: { message?: { content?: string } }[]; error?: { message: string } };
          if (json.error) throw new Error(json.error.message);
          const text = json.choices?.[0]?.message?.content;
          if (!text) throw new Error("Empty response");
          return text;
        }),
        15000, // 15s hard timeout per model
      );
      return result;
    } catch (err) {
      console.warn(`[llm] model ${model} failed:`, err instanceof Error ? err.message : err);
      lastError = err;
    }
  }
  throw new Error(`All LLM models failed. Last error: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}
