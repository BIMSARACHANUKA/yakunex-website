'use client';

import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface CircuitPath {
  points: Point[];
  length: number;
}

interface DataPulse {
  pathIdx: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
}

interface Chip {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

export default function TechArtCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let isVisible = false;
    let width = 0;
    let height = 0;
    let mouse = { x: -1000, y: -1000, active: false };

    // Reduced motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Circuits & Data
    let paths: CircuitPath[] = [];
    let pulses: DataPulse[] = [];
    let chips: Chip[] = [];
    let nodes: Point[] = [];

    const chipLabels = ['YAKUNEX // CORE', 'AI // NEURAL', 'CLOUD // NODE', 'DATA // BUS', 'LOGIC // 01'];

    function buildCircuits() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container?.clientWidth || window.innerWidth;
      height = container?.clientHeight || 450;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx?.setTransform(1, 0, 0, 1, 0, 0); // reset before re-scaling to avoid accumulation on resize
      ctx?.scale(dpr, dpr);

      paths = [];
      pulses = [];
      chips = [];
      nodes = [];

      // 1. Generate Tech IC Microchips
      const chipCount = Math.max(2, Math.min(5, Math.floor(width / 320)));
      const stepX = width / (chipCount + 1);

      for (let i = 0; i < chipCount; i++) {
        const cx = stepX * (i + 1) + (Math.sin(i * 99) * 30);
        const cy = height * 0.45 + (Math.cos(i * 33) * (height * 0.2));
        const chipW = 110;
        const chipH = 46;
        chips.push({
          x: cx - chipW / 2,
          y: cy - chipH / 2,
          w: chipW,
          h: chipH,
          label: chipLabels[i % chipLabels.length],
        });
      }

      // 2. Generate PCB Circuit Tracks with classic 45-degree angle routing
      const trackCount = Math.max(16, Math.floor(width / 60));

      for (let i = 0; i < trackCount; i++) {
        const startX = (width / trackCount) * i + (Math.random() * 20 - 10);
        const startY = Math.random() > 0.5 ? 0 : height;
        const targetY = height * (0.2 + Math.random() * 0.6);
        const doglegX = startX + (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 60);

        const pts: Point[] = [
          { x: startX, y: startY },
          { x: startX, y: targetY * 0.5 },
          { x: doglegX, y: targetY },
          { x: doglegX + (Math.random() > 0.5 ? 80 : -80), y: targetY },
        ];

        // Calculate approximate segment lengths
        let len = 0;
        for (let p = 0; p < pts.length - 1; p++) {
          len += Math.hypot(pts[p + 1].x - pts[p].x, pts[p + 1].y - pts[p].y);
        }

        paths.push({ points: pts, length: len });
        nodes.push(pts[pts.length - 1]);
        if (Math.random() > 0.5) nodes.push(pts[1]);
      }

      // 3. Connect chips to circuits
      chips.forEach((c) => {
        // Pins on left and right
        for (let py = c.y + 10; py <= c.y + c.h - 10; py += 12) {
          // Left pin
          const leftTarget = { x: Math.max(0, c.x - 60 - Math.random() * 40), y: py };
          paths.push({
            points: [{ x: c.x, y: py }, { x: c.x - 20, y: py }, leftTarget],
            length: 80,
          });
          nodes.push(leftTarget);

          // Right pin
          const rightTarget = { x: Math.min(width, c.x + c.w + 60 + Math.random() * 40), y: py };
          paths.push({
            points: [{ x: c.x + c.w, y: py }, { x: c.x + c.w + 20, y: py }, rightTarget],
            length: 80,
          });
          nodes.push(rightTarget);
        }
      });

      // 4. Seed Data Packets / Pulses
      const pulseCount = Math.max(12, Math.floor(paths.length * 0.7));
      for (let i = 0; i < pulseCount; i++) {
        pulses.push({
          pathIdx: Math.floor(Math.random() * paths.length),
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.006,
          color: Math.random() > 0.3 ? '#FFD12F' : '#FFF3B3',
          size: 2 + Math.random() * 2,
        });
      }
    }

    function getPointOnPath(path: CircuitPath, progress: number): Point {
      const pts = path.points;
      if (pts.length === 0) return { x: 0, y: 0 };
      if (pts.length === 1) return pts[0];

      const totalDist = path.length;
      const targetDist = totalDist * Math.min(Math.max(progress, 0), 1);

      let accumulated = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        const segDist = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
        if (accumulated + segDist >= targetDist || i === pts.length - 2) {
          const segProgress = segDist === 0 ? 0 : (targetDist - accumulated) / segDist;
          return {
            x: pts[i].x + (pts[i + 1].x - pts[i].x) * segProgress,
            y: pts[i].y + (pts[i + 1].y - pts[i].y) * segProgress,
          };
        }
        accumulated += segDist;
      }
      return pts[pts.length - 1];
    }

    function render(time: number) {
      animId = 0;
      if (!ctx || !isVisible) return;
      ctx.clearRect(0, 0, width, height);

      // A. Draw Circuit Copper/Gold Traces
      ctx.lineWidth = 1.2;
      paths.forEach((p, idx) => {
        ctx.beginPath();
        ctx.moveTo(p.points[0].x, p.points[0].y);
        for (let i = 1; i < p.points.length; i++) {
          ctx.lineTo(p.points[i].x, p.points[i].y);
        }
        // Subtle rhythmic shimmer along lines
        const alpha = 0.12 + Math.sin(time * 0.001 + idx) * 0.04;
        ctx.strokeStyle = `rgba(255, 209, 47, ${alpha})`;
        ctx.stroke();
      });

      // B. Draw Microchips (IC packages)
      chips.forEach((c, idx) => {
        // Chip body
        ctx.fillStyle = '#080808';
        ctx.strokeStyle = 'rgba(255, 209, 47, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(c.x, c.y, c.w, c.h, 6);
        ctx.fill();
        ctx.stroke();

        // Corner notch / Pin 1 indicator
        ctx.fillStyle = '#FFD12F';
        ctx.beginPath();
        ctx.arc(c.x + 8, c.y + 8, 2, 0, Math.PI * 2);
        ctx.fill();

        // Chip IC Pins
        for (let py = c.y + 10; py <= c.y + c.h - 10; py += 12) {
          ctx.fillStyle = 'rgba(255, 209, 47, 0.6)';
          ctx.fillRect(c.x - 3, py - 1.5, 3, 3);
          ctx.fillRect(c.x + c.w, py - 1.5, 3, 3);
        }

        // Chip Label text
        ctx.font = '9px monospace';
        ctx.fillStyle = 'rgba(255, 209, 47, 0.75)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.label, c.x + c.w / 2, c.y + c.h / 2);

        // Blinking status LED on chip
        const ledAlpha = (Math.sin(time * 0.004 + idx * 2) + 1) * 0.5;
        ctx.fillStyle = `rgba(255, 209, 47, ${0.3 + ledAlpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(c.x + c.w - 10, c.y + 8, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // C. Draw Circuit Solder Pads / Nodes
      nodes.forEach((n, idx) => {
        const pulse = (Math.sin(time * 0.002 + idx * 1.5) + 1) * 0.5;
        // Outer glow
        ctx.fillStyle = `rgba(255, 209, 47, ${0.15 + pulse * 0.3})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3 + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Inner solid pad
        ctx.fillStyle = '#FFD12F';
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // D. Draw and Move Active Data Packets (High-speed light signals)
      if (!prefersReducedMotion) {
        pulses.forEach((pulse) => {
          pulse.progress += pulse.speed;
          if (pulse.progress >= 1) {
            pulse.progress = 0;
            pulse.pathIdx = Math.floor(Math.random() * paths.length);
          }

          const path = paths[pulse.pathIdx];
          if (!path) return;

          const pt = getPointOnPath(path, pulse.progress);
          const prevPt = getPointOnPath(path, Math.max(0, pulse.progress - 0.06));

          // Packet trailing glow line
          const grad = ctx.createLinearGradient(prevPt.x, prevPt.y, pt.x, pt.y);
          grad.addColorStop(0, 'rgba(255, 209, 47, 0)');
          grad.addColorStop(1, pulse.color);

          ctx.beginPath();
          ctx.moveTo(prevPt.x, prevPt.y);
          ctx.lineTo(pt.x, pt.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = pulse.size + 1;
          ctx.stroke();

          // Packet head glow
          ctx.fillStyle = pulse.color;
          ctx.shadowColor = '#FFD12F';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pulse.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // E. Interactive Cursor Reactivity
      if (mouse.active) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
        grad.addColorStop(0, 'rgba(255, 209, 47, 0.12)');
        grad.addColorStop(0.5, 'rgba(255, 209, 47, 0.04)');
        grad.addColorStop(1, 'rgba(255, 209, 47, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    }

    // Viewport Visibility Observer (0% CPU when footer is offscreen)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
          if (isVisible && !animId) {
            animId = requestAnimationFrame(render);
          } else if (!isVisible && animId) {
            cancelAnimationFrame(animId);
            animId = 0;
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Resize Handler
    const ro = new ResizeObserver(() => {
      buildCircuits();
      if (!prefersReducedMotion) {
        if (isVisible) {
          if (animId) cancelAnimationFrame(animId);
          animId = requestAnimationFrame(render);
        }
      } else {
        render(0);
      }
    });
    ro.observe(container);

    // Mouse Tracking — listen on window so pointer-events-none on canvas doesn't block it
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      // Only react when cursor is over the footer area
      if (
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom
      ) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    };
    const onMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    container.addEventListener('mouseleave', onMouseLeave, { passive: true });

    buildCircuits();
    if (prefersReducedMotion) {
      render(0);
    }

    return () => {
      observer.disconnect();
      ro.disconnect();
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="h-full w-full opacity-65" />
      {/* Top & bottom gentle gradient fades into the footer background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070707] via-transparent to-[#070707] opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#070707] via-transparent to-[#070707] opacity-60" />
    </div>
  );
}

