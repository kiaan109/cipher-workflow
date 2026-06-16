This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Band of Agents Hackathon

Nodebase is a visual workflow builder where each workflow can include AI "agent" nodes
(OpenAI, Anthropic, and Gemini). This project uses **Band.ai as its core agent
coordination layer**:

- Every workflow execution that contains one or more AI agent nodes automatically
  gets its own **Band room** (`src/lib/band.ts`, wired up in `src/inngest/functions.ts`).
- As each agent node runs, it posts its prompt and response into the shared Band room
  under its own agent name ("OpenAI Agent", "Anthropic Agent", "Gemini Agent"), giving
  a live, shared transcript of the agents collaborating on the same task.
- Agents also share context directly: each node's output is merged into a shared
  `context` object and made available to downstream nodes via Handlebars templating
  (e.g. `{{openaiAgent.text}}`), so later agents can build on earlier agents'
  responses — real agent-to-agent handoffs, not just isolated calls.
- All three agent types (OpenAI, Anthropic, Gemini) run through a single
  **OpenRouter** client (`src/lib/openrouter.ts`) using 100% free models:
  - OpenAI agent → `meta-llama/llama-3.3-8b-instruct:free`
  - Anthropic agent → `deepseek/deepseek-r1:free`
  - Gemini agent → `google/gemma-3-27b-it:free`

  This means a workflow with all three agent types is a 3-agent Band room out of the
  box, at zero cost to the user.
- Band integration is best-effort: if `BAND_API_KEY` is not configured, workflows still
  execute normally — Band calls are simply skipped.

Configure `OPENROUTER_API_KEY`, `BAND_API_KEY`, and (optionally) `BAND_API_BASE_URL` in
your `.env` file — see `.env.example`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
