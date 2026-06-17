import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#000", color: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes marquee { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
        @keyframes pulse { 0%,100% { opacity:.4; } 50% { opacity:1; } }
        @keyframes flowDash { 0% { stroke-dashoffset:0; } 100% { stroke-dashoffset:-24; } }
        @keyframes nodeAppear { from { opacity:0; transform:scale(0.7); } to { opacity:1; transform:scale(1); } }
        @keyframes float { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-10px);} }

        .anim-fade-up { animation: fadeUp .7s ease both; }
        .anim-delay-1 { animation-delay: .1s; }
        .anim-delay-2 { animation-delay: .25s; }
        .anim-delay-3 { animation-delay: .4s; }
        .anim-delay-4 { animation-delay: .55s; }

        .marquee-wrap { overflow:hidden; position:relative; }
        .marquee-wrap::before,.marquee-wrap::after { content:''; position:absolute; top:0; width:140px; height:100%; z-index:2; pointer-events:none; }
        .marquee-wrap::before { left:0; background:linear-gradient(90deg,#000,transparent); }
        .marquee-wrap::after { right:0; background:linear-gradient(-90deg,#000,transparent); }
        .marquee-track { display:flex; gap:56px; width:max-content; animation:marquee 40s linear infinite; align-items:center; }
        .marquee-track:hover { animation-play-state:paused; }

        .feature-card { background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.06); border-radius:20px; padding:36px; transition:all .25s ease; }
        .feature-card:hover { background:rgba(99,102,241,.07); border-color:rgba(99,102,241,.22); transform:translateY(-3px); }

        .btn-primary { display:inline-flex; align-items:center; gap:8px; padding:15px 34px; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; font-weight:700; font-size:15px; border-radius:12px; text-decoration:none; transition:all .18s ease; box-shadow:0 0 40px rgba(99,102,241,.3); }
        .btn-primary:hover { transform:translateY(-1px) scale(1.02); box-shadow:0 0 60px rgba(99,102,241,.5); }
        .btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:15px 28px; color:rgba(255,255,255,.55); font-weight:600; font-size:15px; border-radius:12px; text-decoration:none; border:1px solid rgba(255,255,255,.09); transition:all .18s ease; }
        .btn-ghost:hover { color:#fff; border-color:rgba(255,255,255,.2); background:rgba(255,255,255,.05); }

        .section-pill { display:inline-flex; align-items:center; gap:7px; padding:7px 16px; border-radius:100px; background:rgba(99,102,241,.1); border:1px solid rgba(99,102,241,.18); color:#a5b4fc; font-size:12px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; }
        .section-pill::before { content:''; width:5px; height:5px; border-radius:50%; background:#6366f1; animation:pulse 2s ease infinite; flex-shrink:0; }

        .g-text { background:linear-gradient(135deg,#fff 50%,rgba(255,255,255,.45)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .g-text-purple { background:linear-gradient(135deg,#818cf8,#c084fc,#60a5fa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

        .node-flow { animation:flowDash 2s linear infinite; }
        .node-box { animation:nodeAppear .45s ease both; }

        .step-connector { position:absolute; left:27px; top:62px; bottom:-10px; width:1px; background:linear-gradient(180deg,rgba(99,102,241,.35),transparent); }

        .nav-link { font-size:14px; font-weight:500; color:rgba(255,255,255,.45); text-decoration:none; transition:color .15s; padding:6px 0; }
        .nav-link:hover { color:rgba(255,255,255,.9); }

        .stat-val { font-size:56px; font-weight:900; line-height:1; background:linear-gradient(135deg,#fff,rgba(255,255,255,.4)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

        @media (max-width:768px) {
          .hide-mobile { display:none !important; }
          .features-grid { grid-template-columns:1fr !important; }
          .stats-grid { grid-template-columns:1fr 1fr !important; }
          .h1-text { font-size:46px !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, height:64, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px", borderBottom:"1px solid rgba(255,255,255,.055)", backdropFilter:"blur(24px)", background:"rgba(0,0,0,.78)" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:9, textDecoration:"none" }}>
          <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 18px rgba(99,102,241,.45)" }}>
            <svg viewBox="0 0 24 24" fill="none" width="15" height="15" stroke="white" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
          </div>
          <span style={{ fontWeight:800, fontSize:16, color:"#fff", letterSpacing:"-.025em" }}>Cipher</span>
        </Link>

        <div className="hide-mobile" style={{ display:"flex", alignItems:"center", gap:32 }}>
          {[["Integrations","/workflows"],["Pricing","/workflows"],["Docs","/workflows"],["Demo","/demo"]].map(([l,h]) => (
            <Link key={l} href={h} className="nav-link">{l}</Link>
          ))}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Link href="/login" style={{ fontSize:14, fontWeight:600, color:"rgba(255,255,255,.4)", textDecoration:"none", padding:"9px 16px" }}>Sign in</Link>
          <Link href="/signup" className="btn-primary" style={{ padding:"9px 20px", fontSize:14 }}>
            Get started →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"120px 24px 80px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"25%", left:"50%", transform:"translate(-50%,-50%)", width:1000, height:700, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(99,102,241,.1) 0%,transparent 68%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"15%", right:"15%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(139,92,246,.07) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", inset:0, opacity:.022, backgroundImage:"linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)", backgroundSize:"56px 56px", pointerEvents:"none" }} />

        <div style={{ position:"relative", zIndex:1, maxWidth:860 }}>
          <div className="anim-fade-up anim-delay-1 section-pill" style={{ marginBottom:32 }}>
            Visual AI Workflow Builder
          </div>

          <h1 className="anim-fade-up anim-delay-2 h1-text" style={{ fontSize:"clamp(50px,8.5vw,92px)", fontWeight:900, lineHeight:1.02, letterSpacing:"-.045em", marginBottom:28 }}>
            <span className="g-text">Build AI workflows</span><br />
            <span style={{ color:"rgba(255,255,255,.22)" }}>that actually ship.</span>
          </h1>

          <p className="anim-fade-up anim-delay-3" style={{ fontSize:"clamp(16px,2vw,19px)", color:"rgba(255,255,255,.4)", lineHeight:1.75, maxWidth:540, margin:"0 auto 48px", fontWeight:400 }}>
            Connect any AI model, any app, any trigger — then watch it execute live, node by node, with zero code required.
          </p>

          <div className="anim-fade-up anim-delay-4" style={{ display:"flex", flexWrap:"wrap", gap:12, justifyContent:"center", marginBottom:20 }}>
            <a href="/signup" className="btn-primary" style={{ fontSize:15, padding:"16px 38px" }}>
              Start building free
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd"/></svg>
            </a>
            <a href="/demo" className="btn-ghost">
              <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15" style={{ color:"#818cf8" }}><path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l3.5 2.25a.75.75 0 010 1.262l-3.5 2.25A.75.75 0 018 12.25v-4.5a.75.75 0 01.39-.658z" clipRule="evenodd"/></svg>
              Live demo
            </a>
          </div>
          <p style={{ fontSize:12, color:"rgba(255,255,255,.18)", fontWeight:500 }}>No credit card · Free tier forever</p>
        </div>

        {/* Canvas preview */}
        <div style={{ position:"relative", zIndex:1, marginTop:72, width:"100%", maxWidth:800, animation:"fadeIn 1.1s ease both", animationDelay:".65s" }}>
          <div style={{ borderRadius:22, border:"1px solid rgba(255,255,255,.075)", background:"rgba(255,255,255,.018)", backdropFilter:"blur(16px)", overflow:"hidden", boxShadow:"0 48px 130px rgba(0,0,0,.65), 0 0 80px rgba(99,102,241,.08)" }}>
            {/* Chrome bar */}
            <div style={{ display:"flex", alignItems:"center", gap:7, padding:"13px 18px", borderBottom:"1px solid rgba(255,255,255,.055)", background:"rgba(255,255,255,.018)" }}>
              {["rgba(255,59,48,.75)","rgba(255,149,0,.75)","rgba(40,205,65,.75)"].map((c,i) => (
                <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:c }} />
              ))}
              <span style={{ marginLeft:10, fontSize:11, color:"rgba(255,255,255,.22)", fontFamily:"monospace" }}>cipher — untitled workflow</span>
            </div>

            {/* Node canvas */}
            <div style={{ height:196, background:"#070710", position:"relative", backgroundImage:"radial-gradient(rgba(255,255,255,.038) 1px,transparent 1px)", backgroundSize:"26px 26px" }}>
              <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", overflow:"visible" }} viewBox="0 0 800 196" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <marker id="arr" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                    <path d="M0,0 L5,2.5 L0,5 Z" fill="rgba(99,102,241,.55)"/>
                  </marker>
                </defs>
                {[
                  "M 148 98 C 175 98 182 68 202 68",
                  "M 148 98 C 175 98 182 128 202 128",
                  "M 328 68 C 355 68 362 98 382 98",
                  "M 328 128 C 355 128 362 98 382 98",
                  "M 512 98 C 539 98 546 68 566 68",
                  "M 512 98 C 539 98 546 128 566 128",
                ].map((d,i) => (
                  <path key={i} d={d} stroke="rgba(99,102,241,.45)" strokeWidth="1.5" fill="none" strokeDasharray="5 4" className="node-flow" style={{ animationDelay:`${i*0.22}s` }} markerEnd="url(#arr)"/>
                ))}
              </svg>

              {[
                { l:"Webhook", s:"HTTP Trigger", c:"#22c55e", bg:"rgba(34,197,94,.1)", x:14, y:76 },
                { l:"Gemini", s:"AI Generate", c:"#6366f1", bg:"rgba(99,102,241,.13)", x:186, y:44 },
                { l:"Claude", s:"Reasoning", c:"#c084fc", bg:"rgba(192,132,252,.1)", x:186, y:106 },
                { l:"OpenAI", s:"Summarize", c:"#38bdf8", bg:"rgba(56,189,248,.1)", x:366, y:76 },
                { l:"Slack", s:"Notify", c:"#e01e5a", bg:"rgba(224,30,90,.1)", x:550, y:44 },
                { l:"Notion", s:"Save log", c:"#94a3b8", bg:"rgba(148,163,184,.07)", x:550, y:106 },
              ].map((n,i) => (
                <div key={n.l} className="node-box" style={{ position:"absolute", left:n.x, top:n.y, animationDelay:`${i*0.08}s` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 13px", borderRadius:12, background:n.bg, border:`1px solid ${n.c}35`, whiteSpace:"nowrap" }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:n.c, flexShrink:0 }} />
                    <div>
                      <div style={{ color:"rgba(255,255,255,.88)", fontWeight:600, fontSize:12 }}>{n.l}</div>
                      <div style={{ color:"rgba(255,255,255,.3)", fontSize:10 }}>{n.s}</div>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ position:"absolute", bottom:10, right:14, display:"flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:8, background:"rgba(34,197,94,.09)", border:"1px solid rgba(34,197,94,.22)", fontSize:11, color:"#4ade80", fontWeight:600 }}>
                <span style={{ width:5, height:5, borderRadius:"50%", background:"#4ade80", animation:"pulse 1.5s ease infinite" }} />
                Executing live
              </div>
            </div>

            {/* Status strip */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1px", background:"rgba(255,255,255,.04)" }}>
              {[["Webhook","✓ Done","#4ade80"],["Gemini","✓ Done","#4ade80"],["OpenAI","● Running","#818cf8"],["Slack","○ Pending","rgba(255,255,255,.2)"]].map(([n,s,c]) => (
                <div key={n} style={{ padding:"9px 13px", background:"rgba(0,0,0,.5)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>{n}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:c }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position:"absolute", bottom:-36, left:"50%", transform:"translateX(-50%)", width:"55%", height:48, background:"rgba(99,102,241,.14)", filter:"blur(36px)", borderRadius:"50%", pointerEvents:"none" }} />
        </div>
      </section>

      {/* MARQUEE */}
      <section style={{ padding:"56px 0", borderTop:"1px solid rgba(255,255,255,.045)", borderBottom:"1px solid rgba(255,255,255,.045)" }}>
        <p style={{ textAlign:"center", fontSize:11, fontWeight:700, color:"rgba(255,255,255,.18)", letterSpacing:".14em", textTransform:"uppercase", marginBottom:28 }}>
          Integrates with everything you already use
        </p>
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...Array(2)].flatMap((_,ti) =>
              [
                {src:"/logos/slack.svg",n:"Slack"},{src:"/logos/notion.svg",n:"Notion"},{src:"/logos/github.svg",n:"GitHub"},
                {src:"/logos/discord.svg",n:"Discord"},{src:"/logos/shopify.svg",n:"Shopify"},{src:"/logos/airtable.svg",n:"Airtable"},
                {src:"/logos/stripe.svg",n:"Stripe"},{src:"/logos/openai.svg",n:"OpenAI"},{src:"/logos/anthropic.svg",n:"Claude"},
                {src:"/logos/gemini.svg",n:"Gemini"},{src:"/logos/mistral.svg",n:"Mistral"},{src:"/logos/jira.svg",n:"Jira"},
                {src:"/logos/linear.svg",n:"Linear"},{src:"/logos/telegram.svg",n:"Telegram"},{src:"/logos/zoom.svg",n:"Zoom"},
                {src:"/logos/supabase.svg",n:"Supabase"},{src:"/logos/hubspot.svg",n:"HubSpot"},{src:"/logos/salesforce.svg",n:"Salesforce"},
                {src:"/logos/google-sheets.svg",n:"Sheets"},{src:"/logos/trello.svg",n:"Trello"},{src:"/logos/zendesk.svg",n:"Zendesk"},
              ].map((l,i) => (
                <div key={`${ti}-${i}`} style={{ display:"flex", alignItems:"center", gap:9, flexShrink:0 }}>
                  <div style={{ width:26, height:26, borderRadius:7, background:"rgba(255,255,255,.055)", display:"flex", alignItems:"center", justifyContent:"center", padding:4 }}>
                    <Image src={l.src} alt={l.n} width={18} height={18} style={{ objectFit:"contain" }} />
                  </div>
                  <span style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,.45)", whiteSpace:"nowrap" }}>{l.n}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding:"100px 24px", maxWidth:1080, margin:"0 auto" }}>
        <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:32, textAlign:"center" }}>
          {[["1,300+","Integrations"],["100%","No code needed"],["< 5s","Avg run time"],["∞","Workflow runs"]].map(([n,l]) => (
            <div key={l}>
              <div className="stat-val">{n}</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,.28)", fontWeight:500, marginTop:10 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:"60px 24px 110px", maxWidth:1080, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <div className="section-pill" style={{ margin:"0 auto 22px" }}>Why Cipher</div>
          <h2 style={{ fontSize:"clamp(34px,5vw,58px)", fontWeight:900, letterSpacing:"-.04em", lineHeight:1.07, marginBottom:18 }}>
            <span className="g-text">Everything you need.</span>
            <br />
            <span style={{ color:"rgba(255,255,255,.18)" }}>Nothing you don&apos;t.</span>
          </h2>
          <p style={{ fontSize:16, color:"rgba(255,255,255,.32)", maxWidth:460, margin:"0 auto", lineHeight:1.75 }}>
            Built for teams who ship fast. Cut the gap between idea and automation to zero.
          </p>
        </div>

        <div className="features-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
          {[
            { icon:"M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z", c:"#6366f1", t:"Multi-Model AI", d:"Chain GPT-4o, Claude 4, Gemini, Mistral — any model — into autonomous agents that reason, adapt, and deliver." },
            { icon:"M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244", c:"#38bdf8", t:"1,300+ Integrations", d:"Every major app — Slack, Notion, Stripe, HubSpot, Shopify, GitHub — wired in one click. 1,327 nodes and counting." },
            { icon:"M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", c:"#4ade80", t:"Live Execution", d:"Every node fires in real time. Full step logs, outputs, and errors — inspectable, re-runnable, always." },
            { icon:"M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z", c:"#c084fc", t:"Visual Canvas", d:"Drag, drop, connect. Build complex multi-step agents visually. No YAML, no JSON, no config files." },
            { icon:"M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", c:"#fb923c", t:"Any Trigger", d:"Webhook, cron schedule, form submission, Stripe event — fire your workflow from anything, anytime." },
            { icon:"M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", c:"#f43f5e", t:"Secure by default", d:"Credentials encrypted at rest. OAuth via GitHub or Google. Your data stays in your control, always." },
          ].map(f => (
            <div key={f.t} className="feature-card">
              <div style={{ width:44, height:44, borderRadius:12, background:`${f.c}16`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
                <svg viewBox="0 0 24 24" fill="none" width="21" height="21" stroke={f.c} strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d={f.icon}/></svg>
              </div>
              <h3 style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:10, letterSpacing:"-.02em" }}>{f.t}</h3>
              <p style={{ fontSize:14, color:"rgba(255,255,255,.36)", lineHeight:1.72 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:"60px 24px 110px", borderTop:"1px solid rgba(255,255,255,.045)" }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <div className="section-pill" style={{ margin:"0 auto 22px" }}>How it works</div>
            <h2 style={{ fontSize:"clamp(34px,5vw,54px)", fontWeight:900, letterSpacing:"-.04em", lineHeight:1.07 }}>
              Idea to running agent<br />
              <span className="g-text-purple">in under 5 minutes.</span>
            </h2>
          </div>

          {[
            { n:"01", t:"Build visually", d:"Drag nodes onto the canvas. Connect any trigger — webhook, cron, form — to AI models and app integrations. It looks exactly like what it does." },
            { n:"02", t:"Configure in seconds", d:"Set prompts, credentials, and data mappings in simple inline panels. No JSON, no YAML, no environment files to wrestle with." },
            { n:"03", t:"Execute and watch", d:"Hit run. Watch each node fire in real time. Every output is logged, inspectable, and re-runnable from the execution history." },
          ].map((step, i) => (
            <div key={step.n} style={{ display:"flex", gap:28, marginBottom:52, position:"relative" }}>
              {i < 2 && <div className="step-connector" />}
              <div style={{ flexShrink:0, width:54, height:54, borderRadius:15, background:"rgba(99,102,241,.1)", border:"1px solid rgba(99,102,241,.22)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:900, color:"#818cf8", position:"relative", zIndex:1 }}>
                {step.n}
              </div>
              <div style={{ paddingTop:10 }}>
                <h3 style={{ fontSize:19, fontWeight:700, color:"#fff", marginBottom:9, letterSpacing:"-.025em" }}>{step.t}</h3>
                <p style={{ fontSize:14.5, color:"rgba(255,255,255,.36)", lineHeight:1.73 }}>{step.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"110px 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 70% 50% at 50% 50%,rgba(99,102,241,.09),transparent)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:700, height:500, background:"rgba(99,102,241,.05)", filter:"blur(90px)", borderRadius:"50%", pointerEvents:"none" }} />

        <div style={{ position:"relative", zIndex:1, maxWidth:680, margin:"0 auto" }}>
          <h2 style={{ fontSize:"clamp(38px,6vw,70px)", fontWeight:900, letterSpacing:"-.045em", lineHeight:1.04, marginBottom:22 }}>
            Your workflows.<br />
            <span className="g-text-purple">Supercharged by AI.</span>
          </h2>
          <p style={{ fontSize:17, color:"rgba(255,255,255,.33)", marginBottom:44, lineHeight:1.75 }}>
            Join builders automating smarter. Start free — no card needed.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <a href="/signup" className="btn-primary" style={{ fontSize:16, padding:"17px 44px" }}>
              Get started free →
            </a>
            <a href="/demo" className="btn-ghost" style={{ fontSize:15 }}>
              See a live demo
            </a>
          </div>
          <p style={{ marginTop:22, fontSize:12, color:"rgba(255,255,255,.12)" }}>
            Band × OpenRouter Hackathon · Open source
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,.045)", padding:"36px 32px" }}>
        <div style={{ maxWidth:1080, margin:"0 auto", display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:22, height:22, borderRadius:6, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg viewBox="0 0 24 24" fill="none" width="11" height="11" stroke="white" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
            </div>
            <span style={{ fontWeight:700, fontSize:13, color:"#fff" }}>Cipher</span>
          </div>
          <div style={{ display:"flex", gap:28 }}>
            {["Privacy","Terms","GitHub","Status"].map(l => (
              <Link key={l} href="#" style={{ fontSize:13, color:"rgba(255,255,255,.18)", textDecoration:"none" }}>{l}</Link>
            ))}
          </div>
          <p style={{ fontSize:12, color:"rgba(255,255,255,.1)" }}>© 2025 Cipher</p>
        </div>
      </footer>
    </div>
  );
}
