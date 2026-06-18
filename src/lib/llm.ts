/**
 * Shared LLM call helper used by all AI executor nodes.
 * Tries models in order, each with a hard 25s timeout, falls through on failure.
 * max_tokens capped at 800 to keep responses fast on free-tier models.
 */

const FAST_MODELS = [
  "liquid/lfm-2.5-1.2b-instruct:free",   // ~2-5s tiny model
  "openai/gpt-oss-20b:free",              // ~5-10s
  "nex-agi/nex-n2-pro:free",             // fallback
];

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
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          const json = await r.json() as { choices?: { message?: { content?: string } }[]; error?: { message: string } };
          if (json.error) throw new Error(json.error.message);
          const text = json.choices?.[0]?.message?.content;
          if (!text) throw new Error("Empty response");
          return text;
        }),
        8000, // 8s hard timeout per model
      );
      return result;
    } catch (err) {
      console.warn(`[llm] model ${model} failed:`, err instanceof Error ? err.message : err);
      lastError = err;
    }
  }
  throw new Error(`All LLM models failed. Last error: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}
