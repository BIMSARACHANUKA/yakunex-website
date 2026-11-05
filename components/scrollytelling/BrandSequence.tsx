'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue,
} from 'framer-motion';
import CascadeHeading from '@/components/ui/CascadeHeading';

const COUNT = 300; // frame_000.webp ... frame_299.webp in public/sequence/
const frameSrc = (i: number) => `/sequence/frame_${String(i).padStart(3, '0')}.webp`;

function Beat({ p, stops, align, children }: { p: MotionValue<number>; stops: [number, number, number, number]; align: string; children: ReactNode }) {
  const [a, b, c, d] = stops;
  const stay = d >= 1; // final beat stays visible
  const opacity = useTransform(p, [a, b, c, d], [0, 1, 1, stay ? 1 : 0]);
  const y = useTransform(p, [a, b, c, d], [20, 0, 0, stay ? 0 : -20]);
  return (
    <motion.div style={{ opacity, y }} className={`pointer-events-none absolute inset-0 z-10 flex items-center p-6 sm:p-12 ${align}`}>
      <div className="pointer-events-auto max-w-xl">{children}</div>
    </motion.div>
  );
}

function ScrollHint({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0, 0.08, 0.12], [1, 1, 0]);
  return (
    <motion.p style={{ opacity }} className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-gold/80">
      Scroll to Explore
    </motion.p>
  );
}

function Hero({ note }: { note?: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
      <Image src="/images/logo.webp" alt="Yakunex circuit-lion emblem" width={256} height={256} priority className="mb-6 h-48 w-auto object-contain sm:h-64" />
      <CascadeHeading as="h1" centered className="gold-text text-4xl font-bold sm:text-6xl">Technology. Without Limits.</CascadeHeading>
      <p className="mt-4 max-w-xl text-white/70">We turn ambitious ideas into intelligent digital experiences.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/services" className="btn btn-gold">Explore Our Services</Link>
        <Link href="/contact" className="btn btn-line">Start a Project</Link>
      </div>
      {note && <p className="mt-6 max-w-md text-xs text-white/40">{note}</p>}
    </div>
  );
}

export default function BrandSequence() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const frames = useRef<(HTMLImageElement | null)[]>(Array(COUNT).fill(null));
  const dimsRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const gradRef = useRef<{ grad: CanvasGradient; key: string } | null>(null);
  const isVisibleRef = useRef(true);
  const lastIdx = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] });
  // Highly tuned spring for fluid 300-frame scrollytelling
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 25, mass: 0.18, restDelta: 0.0005 });

  const draw = (value: number, force = false) => {
    if (!isVisibleRef.current && !force) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!ctxRef.current) {
      ctxRef.current = canvas.getContext('2d', { alpha: false });
    }
    const ctx = ctxRef.current;
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    const w = dimsRef.current.w || canvas.width || Math.round((canvas.clientWidth || 800) * dpr);
    const h = dimsRef.current.h || canvas.height || Math.round((canvas.clientHeight || 600) * dpr);
    if (w === 0 || h === 0) return;

    const idx = Math.min(COUNT - 1, Math.max(0, Math.round(value * (COUNT - 1))));
    if (!force && idx === lastIdx.current) return;
    lastIdx.current = idx;

    // Safely retrieve current or nearest loaded frame
    let img: HTMLImageElement | null = null;
    if (frames.current[idx]) {
      img = frames.current[idx];
    } else {
      for (let d = 1; d < COUNT; d++) {
        if (idx - d >= 0 && frames.current[idx - d]) {
          img = frames.current[idx - d];
          break;
        }
        if (idx + d < COUNT && frames.current[idx + d]) {
          img = frames.current[idx + d];
          break;
        }
      }
    }

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, h);
    if (!img || !img.naturalWidth) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const s = Math.min(w / img.naturalWidth, h / img.naturalHeight);
    const dw = Math.round(img.naturalWidth * s);
    const dh = Math.round(img.naturalHeight * s);
    const dx = Math.round((w - dw) / 2);
    const dy = Math.round((h - dh) / 2);

    ctx.drawImage(img, dx, dy, dw, dh);

    // Native canvas edge feathering: softly fade borders into #050505
    // so all 300 frames shape and mix smoothly into the dark background
    const cx = w / 2;
    const cy = h / 2;
    const innerR = Math.min(dw, dh) * 0.32;
    const outerR = Math.max(dw, dh) * 0.52;

    const gradKey = `${Math.round(cx)}_${Math.round(cy)}_${Math.round(innerR)}_${Math.round(outerR)}`;
    let grad: CanvasGradient;
    if (gradRef.current && gradRef.current.key === gradKey) {
      grad = gradRef.current.grad;
    } else {
      grad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
      grad.addColorStop(0, 'rgba(5, 5, 5, 0)');
      grad.addColorStop(0.55, 'rgba(5, 5, 5, 0.25)');
      grad.addColorStop(0.82, 'rgba(5, 5, 5, 0.75)');
      grad.addColorStop(1, '#050505');
      gradRef.current = { grad, key: gradKey };
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  };

  // Preload all 300 frames with keyframe prioritization & off-thread decoding
  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    let done = 0;
    let ok = 0;
    const loadedSet = new Set<number>();

    const tick = (success: boolean, i: number, im?: HTMLImageElement) => {
      if (cancelled) return;
      if (success && im) {
        frames.current[i] = im;
        ok++;
        if (i === 0 || ok === 1) {
          draw(p.get(), true);
          setStatus('ready');
        }
      }
      done++;
      if (done === COUNT && ok === 0) {
        setStatus('failed');
      }
    };

    const loadOne = (i: number) => {
      if (loadedSet.has(i)) return Promise.resolve();
      loadedSet.add(i);

      return new Promise<void>((res) => {
        const im = new window.Image();
        im.decoding = 'async';
        im.onload = async () => {
          if (i < 5 && 'decode' in im) {
            try {
              await im.decode();
            } catch {
              // fallback
            }
          }
          tick(true, i, im);
          res();
        };
        im.onerror = () => {
          tick(false, i);
          res();
        };
        im.src = frameSrc(i);
      });
    };

    (async () => {
      // 1. Initial critical batch: load frames 0-4 for immediate display
      await Promise.all([0, 1, 2, 3, 4].map(loadOne));
      if (cancelled) return;

      if (ok > 0) {
        setStatus('ready');
        draw(p.get(), true);
      }

      // 2. Keyframe stride batch: load every 10th frame across all 300 frames
      // This ensures smooth navigation across the whole scroll progress immediately
      const keyframes: number[] = [];
      for (let i = 10; i < COUNT; i += 10) {
        keyframes.push(i);
      }
      const keyframeBatchSize = 15;
      for (let i = 0; i < keyframes.length; i += keyframeBatchSize) {
        await Promise.all(keyframes.slice(i, i + keyframeBatchSize).map(loadOne));
        if (cancelled) return;
      }

      // 3. Fill in all remaining frames across 0-299 in concurrent batches
      const remaining: number[] = [];
      for (let i = 0; i < COUNT; i++) {
        if (!loadedSet.has(i)) remaining.push(i);
      }

      const batchSize = 20;
      for (let i = 0; i < remaining.length; i += batchSize) {
        await Promise.all(remaining.slice(i, i + batchSize).map(loadOne));
        if (cancelled) return;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (status === 'ready') draw(p.get(), true);
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  useMotionValueEvent(p, 'change', (v) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => draw(v));
  });

  // Handle resizing without layout thrashing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDims = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round((canvas.clientWidth || window.innerWidth) * dpr);
      const h = Math.round((canvas.clientHeight || window.innerHeight) * dpr);
      if (w > 0 && h > 0) {
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
        dimsRef.current = { w, h };
        draw(p.get(), true);
      }
    };

    updateDims();
    const ro = new ResizeObserver(updateDims);
    ro.observe(canvas);

    window.addEventListener('resize', updateDims, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateDims);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Viewport Observer: Pause hero rendering when scrolled past the hero section
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisibleRef.current = e.isIntersecting;
          if (e.isIntersecting && status === 'ready') {
            draw(p.get(), true);
          }
        });
      },
      { rootMargin: '100px 0px' }
    );
    observer.observe(wrap);

    return () => observer.disconnect();
  }, [status, p]); // eslint-disable-line react-hooks/exhaustive-deps

  if (mounted && reduce) return <div className="relative h-[calc(100vh-4rem)] overflow-hidden bg-[#050505]"><Hero /></div>;

  return (
    <div ref={wrapRef} className="relative h-[500vh]">
      <div className="sticky top-16 h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#050505]">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        />

        {/* Soft edge darkening vignette overlay - smoothly mixes frames into black background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background: `
              radial-gradient(ellipse 70% 65% at 50% 50%, transparent 35%, rgba(5,5,5,0.4) 60%, rgba(5,5,5,0.85) 80%, #050505 100%),
              linear-gradient(to bottom, #050505 0%, rgba(5,5,5,0.8) 6%, transparent 18%, transparent 82%, rgba(5,5,5,0.8) 94%, #050505 100%),
              linear-gradient(to right, #050505 0%, rgba(5,5,5,0.8) 6%, transparent 18%, transparent 82%, rgba(5,5,5,0.8) 94%, #050505 100%)
            `,
          }}
        />

        {status === 'failed' && (
          <Hero note="Sequence frames are missing. Add frame_000.webp to frame_299.webp to public/sequence/ to enable the animation." />
        )}

        {status === 'loading' && <Hero />}

        {status === 'ready' && (
          <>
            <ScrollHint p={p} />
            <Beat p={p} stops={[0, 0.02, 0.18, 0.24]} align="justify-center text-center">
              <CascadeHeading as="h1" centered className="gold-text text-4xl font-bold sm:text-6xl">Technology. Without Limits.</CascadeHeading>
              <p className="mt-4 text-white/70">We turn ambitious ideas into intelligent digital experiences.</p>
            </Beat>
            <Beat p={p} stops={[0.25, 0.3, 0.42, 0.5]} align="justify-start text-left">
              <p className="text-xs tracking-[0.3em] text-gold">01 / ENGINEER</p>
              <CascadeHeading as="h2" className="mt-2 text-3xl font-bold sm:text-5xl">Intelligence, Engineered.</CascadeHeading>
              <p className="mt-4 text-white/70">AI, software, and modern engineering work together to solve meaningful business problems.</p>
            </Beat>
            <Beat p={p} stops={[0.5, 0.55, 0.67, 0.75]} align="justify-end text-right">
              <p className="text-xs tracking-[0.3em] text-gold">02 / BUILD</p>
              <CascadeHeading as="h2" className="mt-2 text-3xl font-bold sm:text-5xl">Ideas Into Impact.</CascadeHeading>
              <p className="mt-4 text-white/70">From first concept to deployment, we build digital solutions with purpose.</p>
            </Beat>
            <Beat p={p} stops={[0.75, 0.8, 0.95, 1]} align="justify-center text-center">
              <CascadeHeading as="h2" centered className="gold-text text-3xl font-bold sm:text-5xl">Build What Comes Next.</CascadeHeading>
              <p className="mt-4 text-white/70">Pioneering the future of digital engineering and AI systems.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/services" className="btn btn-gold">Explore Our Services</Link>
                <Link href="/contact" className="btn btn-line">Start a Project</Link>
              </div>
            </Beat>
          </>
        )}
      </div>
    </div>
  );
}
