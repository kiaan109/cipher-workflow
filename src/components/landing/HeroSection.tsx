'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import BlurText from './BlurText';
import NodeCanvas from './NodeCanvas';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] as const },
});

export default function HeroSection() {
  return (
    <section style={{
      position: 'relative', minHeight: '100dvh', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#000',
    }}>
      {/* Node canvas background */}
      <NodeCanvas />

      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(59,130,246,0.07) 0%, transparent 70%)',
      }} />

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
        background: 'linear-gradient(to top, #000 0%, transparent 100%)',
        zIndex: 3, pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '8rem 1.5rem 4rem', width: '100%', maxWidth: '72rem',
      }}>
        {/* Badge */}
        <motion.div {...fadeUp(0.2)} style={{ marginBottom: '2rem' }}>
          <div className="liquid-glass" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            borderRadius: 9999, padding: '0.4rem 1.1rem 0.4rem 0.6rem',
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#4ade80',
              flexShrink: 0, display: 'inline-block',
            }} className="lp-pulse-dot" />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>
              Band of Agents Hackathon 2026
            </span>
            <span className="accent-gradient-text" style={{ fontSize: 12, fontWeight: 600 }}>Live →</span>
          </div>
        </motion.div>

        {/* Headline */}
        <BlurText
          text="Build AI Agent Workflows Visually"
          className="font-heading"
          delay={0.3}
          center
        />
        <style>{`.font-heading span { font-family:'Instrument Serif',serif; font-style:italic; font-size:clamp(2.8rem,8vw,6.5rem); color:#fff; line-height:0.88; letter-spacing:-0.04em; }`}</style>

        {/* Sub */}
        <motion.p {...fadeUp(0.75)} className="font-heading accent-gradient-text" style={{
          fontSize: 'clamp(1.1rem,2.8vw,1.75rem)', letterSpacing: '-0.01em',
          marginTop: '1.25rem', marginBottom: 0,
        }}>
          Unlimited Agents. Real Debates. Zero Code.
        </motion.p>

        {/* Description */}
        <motion.p {...fadeUp(0.9)} style={{
          fontSize: 'clamp(0.875rem,1.5vw,1rem)', color: 'rgba(255,255,255,0.45)',
          maxWidth: '38rem', lineHeight: 1.75, marginTop: '1.25rem',
        }}>
          Drag, connect, and run unlimited AI agents that communicate through Band rooms in real time.
          Watch agents debate, push back, and collaborate to complete any task — from software teams to content pipelines.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(1.05)} style={{
          display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem',
        }}>
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <div className="liquid-glass-strong lp-pulse-glow" style={{
              borderRadius: 9999, padding: '1rem 2.25rem',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 15, fontWeight: 600, color: '#fff', cursor: 'none',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
            >
              Start Building Free →
            </div>
          </Link>
          <Link href="/demo" style={{ textDecoration: 'none' }}>
            <div style={{
              borderRadius: 9999, padding: '1rem 2.25rem', border: '1px solid rgba(255,255,255,0.18)',
              fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.7)', background: 'transparent',
              cursor: 'none', transition: 'background 0.2s, color 0.2s', display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
            >Watch Demo ▶</div>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div {...fadeUp(1.25)} style={{
          display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '3rem',
        }}>
          {[
            { n: '1,431+', l: 'Integrations' },
            { n: '∞', l: 'Agent Nodes' },
            { n: 'Real-Time', l: 'Band Coordination', small: true },
          ].map(s => (
            <div key={s.l} className="liquid-glass" style={{
              borderRadius: '1.25rem', padding: '1.25rem 1.75rem', textAlign: 'center', minWidth: 140,
            }}>
              <p className="font-heading accent-gradient-text" style={{ fontSize: s.small ? '1.6rem' : '2.25rem', lineHeight: 1.1 }}>{s.n}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        zIndex: 10, opacity: 0.5,
      }}>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>SCROLL</span>
        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.15)', position: 'relative', overflow: 'hidden' }}>
          <div className="lp-scroll-down accent-gradient" style={{ position: 'absolute', inset: 0 }} />
        </div>
      </div>
    </section>
  );
}
