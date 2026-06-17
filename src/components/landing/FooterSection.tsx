'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const MARQUEE_TEXT = 'CIPHER · AI AGENTS · VISUAL WORKFLOWS · BAND ROOMS · ZERO CODE · RUNTIME ERROR · HACKATHON 2026 · BUILD THE FUTURE · ';

export default function FooterSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tween: { kill: () => void } | null = null;
    import('gsap').then(({ gsap: g }) => {
      if (!trackRef.current) return;
      tween = g.to(trackRef.current, {
        xPercent: -50,
        duration: 22,
        ease: 'none',
        repeat: -1,
      });
    });
    return () => { tween?.kill(); };
  }, []);

  return (
    <footer style={{ background: '#000', borderTop: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
      {/* CTA block */}
      <div style={{ padding: '7rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>// Build something new</p>
        <h2 className="font-heading" style={{ fontSize: 'clamp(3rem,10vw,7rem)', color: '#fff', lineHeight: 0.88, letterSpacing: '-0.05em', marginBottom: '2.5rem' }}>
          Start building<br /><span className="accent-gradient-text">your agent team</span><br />today.
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <div className="lp-pulse-glow" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              borderRadius: 9999, padding: '1.125rem 2.5rem',
              background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
              fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'none',
            }}>
              Start Building Free →
            </div>
          </Link>
          <Link href="https://github.com/kiaan109/cipher-workflow" target="_blank" className="liquid-glass" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            borderRadius: 9999, padding: '1.125rem 2.5rem',
            fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
          }}>
            View on GitHub →
          </Link>
        </div>
      </div>

      {/* GSAP Marquee */}
      <div style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem 0' }}>
        <div ref={trackRef} style={{ display: 'flex', width: 'max-content', willChange: 'transform' }}>
          {[MARQUEE_TEXT, MARQUEE_TEXT].map((t, i) => (
            <span key={i} className="font-heading" style={{
              fontSize: 'clamp(1.75rem,5vw,3.5rem)', color: 'rgba(255,255,255,0.06)',
              whiteSpace: 'nowrap', padding: '0 2rem', letterSpacing: '-0.02em',
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Footer bar */}
      <div style={{
        maxWidth: '80rem', margin: '0 auto', padding: '2rem 1.5rem',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" />
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="7" x2="22" y2="17" />
              <line x1="22" y1="7" x2="2" y2="17" />
            </svg>
          </div>
          <span className="font-heading" style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>CIPHER</span>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          © 2026 Cipher by Runtime Error. Built for Band of Agents Hackathon.
        </p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy','Terms','GitHub','Discord'].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)'}
            >{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
