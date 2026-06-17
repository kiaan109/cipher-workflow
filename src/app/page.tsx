import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Demo", href: "/demo" },
  { label: "Pricing", href: "/workflows" },
  { label: "Docs", href: "/workflows" },
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-6" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    title: "Multi-Model AI Agents",
    desc: "Chain GPT-4, Claude, Gemini, Mistral — any model — into autonomous agents that collaborate, reason, and act in real time.",
    color: "from-indigo-500/10 to-purple-500/10",
    border: "border-indigo-500/20",
    iconColor: "text-indigo-400",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-6" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    title: "100+ App Integrations",
    desc: "Connect Slack, Notion, HubSpot, Shopify, GitHub, Airtable — everything wires up in one click with no code required.",
    color: "from-cyan-500/10 to-blue-500/10",
    border: "border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-6" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Live Execution View",
    desc: "Watch your workflow run node-by-node in real time. Every step is logged, inspectable, and re-runnable from the dashboard.",
    color: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
];

const LOGO_STRIP = [
  { src: "/logos/slack.svg", name: "Slack" },
  { src: "/logos/notion.svg", name: "Notion" },
  { src: "/logos/github.svg", name: "GitHub" },
  { src: "/logos/discord.svg", name: "Discord" },
  { src: "/logos/shopify.svg", name: "Shopify" },
  { src: "/logos/airtable.svg", name: "Airtable" },
  { src: "/logos/jira.svg", name: "Jira" },
  { src: "/logos/stripe.svg", name: "Stripe" },
  { src: "/logos/telegram.svg", name: "Telegram" },
  { src: "/logos/zoom.svg", name: "Zoom" },
  { src: "/logos/linear.svg", name: "Linear" },
  { src: "/logos/trello.svg", name: "Trello" },
  { src: "/logos/supabase.svg", name: "Supabase" },
  { src: "/logos/google-sheets.svg", name: "Sheets" },
  { src: "/logos/openai.svg", name: "OpenAI" },
  { src: "/logos/anthropic.svg", name: "Anthropic" },
  { src: "/logos/gemini.svg", name: "Gemini" },
];

const WORKFLOW_NODES = [
  { label: "Trigger", color: "#22c55e", icon: "▶", x: 60, y: 90 },
  { label: "Gemini", color: "#6366f1", icon: "✦", x: 220, y: 40 },
  { label: "OpenAI", color: "#818cf8", icon: "⬡", x: 380, y: 90 },
  { label: "Slack", color: "#E01E5A", icon: "✉", x: 540, y: 40 },
  { label: "Notion", color: "#000", icon: "N", x: 540, y: 140 },
];

const HOW_STEPS = [
  { n: "01", title: "Build visually", desc: "Drag nodes onto the canvas. Connect any trigger, AI model, or app integration." },
  { n: "02", title: "Configure in seconds", desc: "Set prompts, credentials, and data mappings with simple forms — no JSON, no code." },
  { n: "03", title: "Execute & watch live", desc: "Hit run. Watch each node execute in real time, see every output, re-run anytime." },
];

export default function LandingPage() {
  return (
    <div className="bg-[#08080a] text-white min-h-screen overflow-x-hidden">
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track { animation: marquee 30s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .float { animation: float 6s ease-in-out infinite; }
        .float-slow { animation: float 9s ease-in-out infinite; animation-delay: -3s; }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }
        .glow-pulse { animation: pulse-glow 3s ease-in-out infinite; }

        @keyframes flow-dash {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -40; }
        }
        .flow-line { animation: flow-dash 1.5s linear infinite; }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.8s ease forwards; }
        .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.25s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.4s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.55s; opacity: 0; }

        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] backdrop-blur-xl bg-[#08080a]/80">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg viewBox="0 0 24 24" fill="none" className="size-4 text-white" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <span className="font-bold text-white tracking-tight text-lg">Cipher</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <Link key={l.label} href={l.href} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 font-medium">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-sm text-zinc-400 hover:text-white transition-colors font-medium px-4 py-2">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get started free →
            </Link>
          </div>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 grain" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-600/10 blur-[120px] glow-pulse pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/8 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-600/6 blur-[100px] pointer-events-none" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="fade-up fade-up-1 mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium">
            <span className="size-2 rounded-full bg-indigo-400 glow-pulse" />
            AI workflow automation — no-code, no limits
          </div>

          {/* Headline */}
          <h1 className="fade-up fade-up-2 text-5xl sm:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            <span className="text-white">Build AI agents</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              that actually work.
            </span>
          </h1>

          <p className="fade-up fade-up-3 text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10">
            Cipher is a visual workflow builder that connects AI models, APIs, and your favourite apps into autonomous pipelines — with live execution you can watch in real time.
          </p>

          {/* CTAs */}
          <div className="fade-up fade-up-4 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-base shadow-2xl shadow-indigo-500/30 transition-all duration-200 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start building free
              <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-base transition-all duration-200 hover:border-white/20"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-indigo-400">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
              Watch demo
            </Link>
          </div>

          {/* Social proof */}
          <p className="fade-up fade-up-4 mt-8 text-zinc-600 text-sm font-medium">
            No credit card required · Free forever plan · Deploy in 60 seconds
          </p>
        </div>

        {/* Animated workflow preview */}
        <div className="relative z-10 w-full max-w-3xl mx-auto mt-20 px-6">
          <div className="float relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/60">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="size-3 rounded-full bg-red-500/60" />
              <div className="size-3 rounded-full bg-yellow-500/60" />
              <div className="size-3 rounded-full bg-green-500/60" />
              <div className="ml-3 text-xs text-zinc-600 font-mono">cipher — workflow editor</div>
            </div>

            {/* Canvas mock */}
            <div className="relative h-52 bg-[#0d0d12] overflow-hidden" style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }}>
              {/* SVG flow connections */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 620 200" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="rgba(99,102,241,0.6)" />
                  </marker>
                </defs>
                {/* Trigger → Gemini */}
                <path d="M 120 90 C 160 90 180 60 200 60" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" fill="none" strokeDasharray="6 4" className="flow-line" markerEnd="url(#arrow)" />
                {/* Gemini → OpenAI */}
                <path d="M 290 60 C 330 60 350 90 370 90" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" fill="none" strokeDasharray="6 4" className="flow-line" markerEnd="url(#arrow)" />
                {/* OpenAI → Slack */}
                <path d="M 450 80 C 480 70 500 55 510 55" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" fill="none" strokeDasharray="6 4" className="flow-line" markerEnd="url(#arrow)" />
                {/* OpenAI → Notion */}
                <path d="M 450 100 C 480 110 500 135 510 145" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" fill="none" strokeDasharray="6 4" className="flow-line" markerEnd="url(#arrow)" />
              </svg>

              {/* Nodes */}
              {[
                { label: "Trigger", sub: "Manual", x: 25, y: 70, color: "#22c55e", bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.4)" },
                { label: "Gemini", sub: "AI Generate", x: 185, y: 40, color: "#6366f1", bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.4)" },
                { label: "OpenAI", sub: "Summarize", x: 350, y: 70, color: "#818cf8", bg: "rgba(129,140,248,0.15)", border: "rgba(129,140,248,0.4)" },
                { label: "Slack", sub: "Send message", x: 505, y: 32, color: "#E01E5A", bg: "rgba(224,30,90,0.15)", border: "rgba(224,30,90,0.4)" },
                { label: "Notion", sub: "Create page", x: 505, y: 122, color: "#6b7280", bg: "rgba(107,114,128,0.15)", border: "rgba(107,114,128,0.4)" },
              ].map((node) => (
                <div
                  key={node.label}
                  className="absolute"
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                >
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold shadow-lg select-none"
                    style={{ background: node.bg, border: `1px solid ${node.border}`, color: node.color, minWidth: "90px" }}
                  >
                    <span className="size-2 rounded-full shrink-0" style={{ background: node.color }} />
                    <div>
                      <div style={{ color: "rgba(255,255,255,0.9)" }}>{node.label}</div>
                      <div className="text-[10px] font-normal" style={{ color: "rgba(255,255,255,0.4)" }}>{node.sub}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Running indicator */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <span className="size-2 rounded-full bg-emerald-400 glow-pulse" />
                Running live
              </div>
            </div>

            {/* Execution panel mock */}
            <div className="p-4 border-t border-white/[0.06] grid grid-cols-3 gap-3">
              {[
                { label: "Gemini", status: "Done", color: "text-emerald-400", icon: "✓" },
                { label: "OpenAI", status: "Running", color: "text-blue-400", icon: "…" },
                { label: "Slack", status: "Pending", color: "text-zinc-500", icon: "○" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2 text-xs">
                  <span className={`font-mono ${s.color}`}>{s.icon}</span>
                  <span className="text-zinc-400">{s.label}</span>
                  <span className={`ml-auto font-medium ${s.color}`}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Glow under canvas */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-indigo-600/20 blur-3xl rounded-full pointer-events-none" />
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600 animate-bounce">
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <svg viewBox="0 0 24 24" fill="none" className="size-4" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── LOGO MARQUEE ── */}
      <section className="py-16 border-y border-white/[0.05] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] via-transparent to-[#08080a] z-10 pointer-events-none" />
        <p className="text-center text-zinc-600 text-xs font-semibold uppercase tracking-widest mb-8">Connects with everything you already use</p>
        <div className="flex gap-10 marquee-track">
          {[...LOGO_STRIP, ...LOGO_STRIP].map((logo, i) => (
            <div key={i} className="flex items-center gap-3 shrink-0 opacity-40 hover:opacity-70 transition-opacity cursor-default">
              <div className="size-8 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center p-1">
                <Image src={logo.src} alt={logo.name} width={24} height={24} className="object-contain" />
              </div>
              <span className="text-sm text-zinc-400 font-medium whitespace-nowrap">{logo.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-4">Why Cipher</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-5">
            Everything an AI workflow needs.
            <br />
            <span className="text-zinc-500">Nothing it doesn&apos;t.</span>
          </h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            Built for builders who need results today, not after a week of setup.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`group relative rounded-2xl border p-8 bg-gradient-to-br ${f.color} ${f.border} hover:scale-[1.02] hover:shadow-xl transition-all duration-300`}
            >
              <div className={`mb-5 ${f.iconColor}`}>{f.icon}</div>
              <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 group-hover:ring-white/10 transition-all" />
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest mb-4">How it works</p>
            <h2 className="text-4xl font-black tracking-tight text-white">
              From idea to running agent <br />
              <span className="text-zinc-500">in under 5 minutes.</span>
            </h2>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-[27px] top-12 bottom-12 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/30 to-transparent hidden md:block" />

            <div className="space-y-10">
              {HOW_STEPS.map((step) => (
                <div key={step.n} className="flex gap-8 items-start group">
                  <div className="shrink-0 size-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-xl font-black text-indigo-400 relative z-10 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all">
                    {step.n}
                  </div>
                  <div className="pt-3">
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-zinc-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS GRID ── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-white mb-4">Connect any app, trigger any action.</h2>
          <p className="text-zinc-500">100+ built-in integrations — more added weekly.</p>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-9 gap-3">
          {[
            { src: "/logos/slack.svg", name: "Slack" },
            { src: "/logos/discord.svg", name: "Discord" },
            { src: "/logos/notion.svg", name: "Notion" },
            { src: "/logos/github.svg", name: "GitHub" },
            { src: "/logos/shopify.svg", name: "Shopify" },
            { src: "/logos/airtable.svg", name: "Airtable" },
            { src: "/logos/jira.svg", name: "Jira" },
            { src: "/logos/stripe.svg", name: "Stripe" },
            { src: "/logos/telegram.svg", name: "Telegram" },
            { src: "/logos/zoom.svg", name: "Zoom" },
            { src: "/logos/linear.svg", name: "Linear" },
            { src: "/logos/trello.svg", name: "Trello" },
            { src: "/logos/supabase.svg", name: "Supabase" },
            { src: "/logos/google-sheets.svg", name: "Sheets" },
            { src: "/logos/openai.svg", name: "OpenAI" },
            { src: "/logos/anthropic.svg", name: "Claude" },
            { src: "/logos/gemini.svg", name: "Gemini" },
            { src: "/logos/mistral.svg", name: "Mistral" },
            { src: "/logos/hubspot.svg", name: "HubSpot" },
            { src: "/logos/salesforce.svg", name: "Salesforce" },
            { src: "/logos/mailchimp.svg", name: "Mailchimp" },
            { src: "/logos/zendesk.svg", name: "Zendesk" },
            { src: "/logos/firebase.svg", name: "Firebase" },
            { src: "/logos/youtube.svg", name: "YouTube" },
            { src: "/logos/spotify.svg", name: "Spotify" },
            { src: "/logos/twitter.svg", name: "X / Twitter" },
            { src: "/logos/instagram.svg", name: "Instagram" },
          ].map((app) => (
            <div
              key={app.name}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-indigo-500/30 transition-all duration-200 group cursor-default"
            >
              <div className="size-8 flex items-center justify-center">
                <Image src={app.src} alt={app.name} width={28} height={28} className="object-contain" />
              </div>
              <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400 transition-colors text-center leading-none">{app.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            Your workflows.<br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Supercharged by AI.
            </span>
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-lg mx-auto">
            Join builders shipping faster with AI workflows that actually execute. Start free, upgrade when you scale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-base shadow-2xl shadow-indigo-500/40 transition-all duration-200 hover:shadow-indigo-500/60 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get started — it&apos;s free
              <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link href="/demo" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors underline underline-offset-4">
              See a live demo first
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.05] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="size-3.5 text-white" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <span className="font-bold text-white text-sm">Cipher</span>
          </div>

          <div className="flex items-center gap-6">
            {[
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" },
              { label: "GitHub", href: "#" },
            ].map(l => (
              <Link key={l.label} href={l.href} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          <p className="text-xs text-zinc-700">© 2025 Cipher. Built for the Band Hackathon.</p>
        </div>
      </footer>
    </div>
  );
}
