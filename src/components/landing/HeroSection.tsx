'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import NodeCanvas from './NodeCanvas';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] as const },
});

export default function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #fff 0%, #fafafa 100%)',
        color: '#111827',
      }}
    >
      <NodeCanvas />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(59,130,246,0.05) 0%, transparent 70%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '28%',
          background: 'linear-gradient(to top, #fff 0%, transparent 100%)',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '7rem 1.5rem 4rem',
          width: '100%',
          maxWidth: '74rem',
        }}
      >
        <motion.div {...fadeUp(0.15)} style={{ marginBottom: '1.5rem' }}>
          <div
            className="liquid-glass"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              borderRadius: 9999,
              padding: '0.45rem 1rem 0.45rem 0.65rem',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#4ade80',
                flexShrink: 0,
                display: 'inline-block',
              }}
              className="lp-pulse-dot"
            />
            <span style={{ fontSize: 12, color: 'rgba(17,24,39,0.72)' }}>
              Band of Agents Hackathon 2026
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#2563eb' }}>
              Track 2 ready
            </span>
          </div>
        </motion.div>

        <motion.p
          {...fadeUp(0.28)}
          style={{
            fontSize: 12,
            color: 'rgba(17,24,39,0.6)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          Multi-Agent Software Development
        </motion.p>

        <motion.h1
          {...fadeUp(0.32)}
          className="font-heading"
          style={{
            fontSize: 'clamp(2.8rem,8vw,6.5rem)',
            color: '#111827',
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
            maxWidth: '12ch',
          }}
        >
          Build AI Agent Workflows Visually
        </motion.h1>

        <motion.p
          {...fadeUp(0.7)}
          className="font-heading"
          style={{
            fontSize: 'clamp(1.05rem,2.5vw,1.6rem)',
            letterSpacing: '-0.01em',
            marginTop: '1rem',
            marginBottom: 0,
            color: '#111827',
            fontStyle: 'normal',
          }}
        >
          Enterprise workflows. Agents that coordinate. Everything online.
        </motion.p>

        <motion.p
          {...fadeUp(0.84)}
          style={{
            fontSize: 'clamp(0.92rem,1.5vw,1rem)',
            color: 'rgba(17,24,39,0.72)',
            maxWidth: '42rem',
            lineHeight: 1.8,
            marginTop: '1rem',
          }}
        >
          Built for the LabLab AI Band of Agents track: a working online prototype where AI agents communicate,
          coordinate, exchange context, and complete work together.
        </motion.p>

        <motion.div
          {...fadeUp(0.98)}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
            gap: '0.9rem',
            width: '100%',
            maxWidth: '56rem',
            marginTop: '2rem',
          }}
        >
          {[
            'Working prototype online',
            'Video presentation ready',
            'Pitch deck included',
            'Band + Codeband aligned',
          ].map(item => (
            <div key={item} className="liquid-glass" style={{ padding: '0.95rem 1rem', textAlign: 'left' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{item}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          {...fadeUp(1.08)}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            marginTop: '2.5rem',
          }}
        >
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <div
              className="liquid-glass-strong lp-pulse-glow"
              style={{
                borderRadius: 9999,
                padding: '1rem 2.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 15,
                fontWeight: 700,
                color: '#111827',
                cursor: 'none',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
            >
              Start Building Free →
            </div>
          </Link>
          <Link href="/demo" style={{ textDecoration: 'none' }}>
            <div
              style={{
                borderRadius: 9999,
                padding: '1rem 2.25rem',
                border: '1px solid rgba(17,24,39,0.12)',
                fontSize: 15,
                fontWeight: 600,
                color: 'rgba(17,24,39,0.75)',
                background: 'transparent',
                cursor: 'none',
                transition: 'background 0.2s, color 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(17,24,39,0.04)';
                (e.currentTarget as HTMLElement).style.color = '#111827';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'rgba(17,24,39,0.75)';
              }}
            >
              Watch Demo ▶
            </div>
          </Link>
        </motion.div>

        <motion.div
          {...fadeUp(1.2)}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            marginTop: '2.75rem',
          }}
        >
          {[
            { n: '1,431+', l: 'Integrations' },
            { n: '∞', l: 'Agent Nodes' },
            { n: 'Real-Time', l: 'Band Coordination', small: true },
          ].map(s => (
            <div
              key={s.l}
              className="liquid-glass"
              style={{ borderRadius: '1.25rem', padding: '1.15rem 1.5rem', textAlign: 'center', minWidth: 140 }}
            >
              <p
                className="font-heading accent-gradient-text"
                style={{ fontSize: s.small ? '1.6rem' : '2.1rem', lineHeight: 1.1 }}
              >
                {s.n}
              </p>
              <p style={{ fontSize: 11, color: 'rgba(17,24,39,0.5)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {s.l}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          zIndex: 10,
          opacity: 0.6,
        }}
      >
        <span style={{ fontSize: 9, color: 'rgba(17,24,39,0.5)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <div style={{ width: 1, height: 40, background: 'rgba(17,24,39,0.15)', position: 'relative', overflow: 'hidden' }}>
          <div className="lp-scroll-down accent-gradient" style={{ position: 'absolute', inset: 0 }} />
        </div>
      </div>
    </section>
  );
}
