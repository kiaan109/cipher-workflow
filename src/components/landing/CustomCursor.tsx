'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = mx + 'px';
        dotRef.current.style.top = my + 'px';
      }
    };

    const animate = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.left = rx + 'px';
        ringRef.current.style.top = ry + 'px';
      }
      raf = requestAnimationFrame(animate);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(!!(t.closest('a') || t.closest('button') || t.tagName === 'A' || t.tagName === 'BUTTON'));
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    raf = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed', width: 8, height: 8, borderRadius: '50%',
          background: '#fff', transform: 'translate(-50%, -50%)',
          pointerEvents: 'none', zIndex: 9999,
          transition: 'width 0.15s, height 0.15s',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          width: hovering ? 54 : 32, height: hovering ? 54 : 32,
          borderRadius: '50%',
          border: hovering ? '1.5px solid #3b82f6' : '1px solid rgba(255,255,255,0.4)',
          background: hovering ? 'rgba(59,130,246,0.08)' : 'transparent',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none', zIndex: 9998,
          transition: 'width 0.25s, height 0.25s, border-color 0.25s, background 0.25s',
        }}
      />
    </>
  );
}
