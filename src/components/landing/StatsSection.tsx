'use client';

import { motion } from 'framer-motion';

const STATS = [
  { n: '$10K', label: 'Prize Pool', sub: 'Winner takes all', accent: true },
  { n: '4', label: 'Days Left', sub: 'Submission deadline: June 21', accent: false },
  { n: '∞', label: 'Agent Nodes', sub: 'Unlimited on every plan', accent: true },
];

export default function StatsSection() {
  return (
    <section style={{ background: '#000', padding: '7rem 1.5rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.5rem' }}>
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
              className="liquid-glass"
              style={{
                borderRadius: '1.75rem', padding: '2.5rem 2rem',
                textAlign: 'center', position: 'relative', overflow: 'hidden',
              }}
            >
              {s.accent && (
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.1) 0%, transparent 70%)',
                }} />
              )}
              <p className="font-heading accent-gradient-text" style={{ fontSize: 'clamp(3rem,8vw,5.5rem)', lineHeight: 0.9, letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>
                {s.n}
              </p>
              <p style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{s.label}</p>
              <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.35)' }}>{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
