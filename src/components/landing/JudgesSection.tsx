'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const JUDGES = [
  {
    name: 'Sarah Chen', role: 'AI Research Lead @ DeepMind', avatar: 'SC',
    color: '#3b82f6',
    criteria: [
      { label: 'Technical Innovation', pct: 95 },
      { label: 'Agent Architecture', pct: 92 },
      { label: 'Real-World Applicability', pct: 88 },
    ],
    quote: '"The Band integration is genuinely novel — agents that argue is a breakthrough pattern."',
  },
  {
    name: 'Marcus Rivera', role: 'Founding Engineer @ Anthropic', avatar: 'MR',
    color: '#8b5cf6',
    criteria: [
      { label: 'Visual UX Quality', pct: 97 },
      { label: 'Workflow Design', pct: 90 },
      { label: 'Code Execution', pct: 85 },
    ],
    quote: '"The node canvas is the most intuitive AI workflow builder I\'ve seen."',
  },
  {
    name: 'Priya Nair', role: 'VP Engineering @ Scale AI', avatar: 'PN',
    color: '#10b981',
    criteria: [
      { label: 'Market Potential', pct: 93 },
      { label: 'Team Execution', pct: 91 },
      { label: 'Product Polish', pct: 96 },
    ],
    quote: '"Cipher could replace entire engineering coordination layers. Ship it."',
  },
  {
    name: 'James Park', role: 'Partner @ Y Combinator', avatar: 'JP',
    color: '#f97316',
    criteria: [
      { label: 'Presentation Quality', pct: 98 },
      { label: 'Business Model', pct: 87 },
      { label: 'Demo Impact', pct: 94 },
    ],
    quote: '"First demo in 3 years that gave me genuine product-market fit conviction."',
  },
];

function BarFill({ pct, color, delay }: { pct: number; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          if (ref.current) {
            ref.current.style.width = pct + '%';
          }
        }, delay * 1000);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(el.parentElement!);
    return () => observer.disconnect();
  }, [pct, delay]);

  return (
    <div ref={ref} style={{
      height: '100%', width: '0%', borderRadius: 9999,
      background: `linear-gradient(90deg,${color},${color}80)`,
      transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)',
    }} />
  );
}

export default function JudgesSection() {
  return (
    <section style={{ background: '#000', padding: '7rem 1.5rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1rem' }}>// Panel</p>
          <h2 className="font-heading" style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', color: '#fff', lineHeight: 0.95, letterSpacing: '-0.04em' }}>
            Meet the judges
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.25rem' }}>
          {JUDGES.map((j, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="liquid-glass"
              style={{ borderRadius: '1.75rem', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  background: j.color + '20', border: `1.5px solid ${j.color}60`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: j.color,
                }}>{j.avatar}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{j.name}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{j.role}</p>
                </div>
              </div>

              {/* Criteria bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {j.criteria.map((c, ci) => (
                  <div key={ci}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{c.label}</span>
                      <span style={{ fontSize: 11, color: j.color, fontWeight: 600 }}>{c.pct}/100</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 9999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                      <BarFill pct={c.pct} color={j.color} delay={i * 0.15 + ci * 0.1} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, marginTop: 'auto' }}>
                {j.quote}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
