'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
  { id:1, abbr:'PL', color:'#3b82f6', name:'@Planner', msg:'Breaking down your auth system request into 8 tasks...', status:'APPROVED ✓', sc:'#4ade80' },
  { id:2, abbr:'AR', color:'#8b5cf6', name:'@Architect', msg:'Designing file structure: /auth /middleware /routes /models', status:'APPROVED ✓', sc:'#4ade80' },
  { id:3, abbr:'EN', color:'#f97316', name:'@Engineer', msg:'JWT auth implementation complete. Passing to reviewer...', status:null, sc:'' },
  { id:4, abbr:'RV', color:'#ef4444', name:'@Reviewer', msg:'REJECTED ✗ — Missing rate limiting on /login endpoint', status:'NEEDS_REVISION', sc:'#ef4444' },
  { id:5, abbr:'EN', color:'#f97316', name:'@Engineer', msg:'Fixed: Added express-rate-limit. Rate: 5 req/min per IP', status:'APPROVED ✓', sc:'#4ade80' },
  { id:6, abbr:'TS', color:'#10b981', name:'@Tester', msg:'23 unit tests written. All passing ✓ Coverage: 94%', status:'COMPLETE ✓', sc:'#4ade80' },
];

export default function BandIntegrationSection() {
  const [visibleCount, setVisibleCount] = useState(1);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setVisibleCount(c => c >= MESSAGES.length ? 1 : c + 1);
      }, 1100);
    }, 2400);
    return () => clearInterval(t);
  }, []);

  const shown = MESSAGES.slice(0, visibleCount);

  return (
    <section style={{ background: '#000', padding: '7rem 1.5rem', overflow: 'hidden' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '4rem', alignItems: 'center' }}>

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>// Powered by Band.ai</p>
          <h2 className="font-heading" style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', color: '#fff', lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: '2rem' }}>
            Every agent lives<br />in Band
          </h2>

          {[
            'Real agent-to-agent communication through Band rooms',
            'Agents debate, reject, retry — all visible in real time',
            'Band is the CORE coordination layer — not a wrapper',
          ].map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.6 }}
              style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: '0.875rem' }}
            >
              <span style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: '#fff',
              }}>✓</span>
              <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }}>{text}</p>
            </motion.div>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="font-heading accent-gradient-text"
            style={{ fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', marginTop: '2rem', lineHeight: 1.3 }}
          >
            &ldquo;Every message flows through Band.&rdquo;
          </motion.p>
        </motion.div>

        {/* Right — Band Room */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="liquid-glass-strong"
          style={{ borderRadius: '1.5rem', padding: '1.5rem', maxWidth: 420, width: '100%', margin: '0 auto' }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Band Room — Session #4721</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="lp-pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
              <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 600 }}>Live</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 280 }}>
            <AnimatePresence initial={false}>
              {shown.map(m => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    display: 'flex', gap: 10, padding: '0.75rem',
                    borderRadius: '0.75rem', background: 'rgba(255,255,255,0.04)',
                    borderLeft: `2.5px solid ${m.color}`,
                  }}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    background: m.color + '25', border: `1px solid ${m.color}50`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: m.color,
                  }}>{m.abbr}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: m.color, marginBottom: 3 }}>{m.name}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{m.msg}</p>
                    {m.status && <p style={{ fontSize: 10, color: m.sc, fontWeight: 700, marginTop: 4 }}>STATUS: {m.status}</p>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing */}
            {typing && (
              <div style={{ display: 'flex', gap: 10, padding: '0.75rem' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 6 }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.35)',
                      display: 'inline-block',
                      animation: `lp-typing-dot 1s ease ${i * 0.18}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
