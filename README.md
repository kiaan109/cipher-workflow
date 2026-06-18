# Cipher — Visual AI Workflow Builder

Cipher is a visual workflow builder where each workflow can include AI "agent" nodes
(OpenAI, Anthropic, Gemini, and more). Built for the **Band of Agents Hackathon**.

## Band.ai + OpenRouter Integration

### How Band.ai is used

Every workflow execution that contains one or more AI agent nodes automatically gets its
own **Band room** (`src/lib/band.ts`, wired into `src/lib/run-workflow.ts`):

- As each agent node runs, it posts its prompt and response into the shared Band room
  under its own agent name ("OpenAI Agent", "Anthropic Agent", "Gemini Agent"), giving a
  live shared transcript of the agents collaborating on the same task.
- Agents also share context directly: each node's output is merged into a shared `context`
  object and made available to downstream nodes via Handlebars templating
  (e.g. `{{openaiAgent.text}}`), so later agents can build on earlier agents'
  responses — real agent-to-agent handoffs, not just isolated calls.
- Band integration is best-effort: if `BAND_API_KEY` is not configured, workflows still
  execute normally — Band calls are simply skipped.

### How OpenRouter is used

All three AI agent node types run through a single **OpenRouter** client
(`src/lib/openrouter.ts`) using 100% free models:

| Node | Model |
|------|-------|
| OpenAI Agent | `meta-llama/llama-3.3-8b-instruct:free` |
| Anthropic Agent | `deepseek/deepseek-r1:free` |
| Gemini Agent | `google/gemma-3-27b-it:free` |

A workflow with all three agent node types creates a 3-agent Band room out of the box,
at zero cost to the user. No provider API keys (OpenAI, Anthropic, Google) are needed —
only `OPENROUTER_API_KEY`.

## Architecture

Workflow execution runs through `src/lib/run-workflow.ts`:

1. Vercel's execute route (`src/app/api/workflows/[id]/execute/route.ts`) creates an
   execution record and fires a fire-and-forget POST to the runner.
2. If `WORKER_URL` is set, the request goes to a VPS worker (`worker/server.ts`) with no
   timeout limit. Otherwise it self-calls Vercel's `/api/run-workflow` route (max 300s).
3. The runner opens a Band room, iterates through workflow levels in parallel, calls each
   node's executor, posts agent messages to Band, and saves results to the database.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and fill in:

- `DATABASE_URL` — Neon Postgres connection string
- `BETTER_AUTH_SECRET` — random secret (`openssl rand -hex 32`)
- `OPENROUTER_API_KEY` — from [openrouter.ai/keys](https://openrouter.ai/keys)
- `BAND_API_KEY` — from [band.ai](https://band.ai)

All other variables are optional depending on which node types you use.

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | Neon Postgres |
| `BETTER_AUTH_SECRET` | Yes | Auth session signing |
| `OPENROUTER_API_KEY` | Yes | All AI agent nodes |
| `BAND_API_KEY` | Recommended | Band room coordination |
| `BAND_API_BASE_URL` | No | Defaults to `https://api.band.ai/v1` |
| `RESEND_API_KEY` | For email nodes | Email sending |
| `WORKER_URL` | No | VPS worker URL to bypass Vercel timeout |
| `INTERNAL_API_SECRET` | No | Auth between Vercel and VPS worker |

## Deploy on Vercel

```bash
vercel deploy
```

Add all environment variables in Vercel project settings. For long-running workflows
(multi-agent chains), optionally deploy the VPS worker (`worker/server.ts`) to bypass
Vercel's function timeout.
