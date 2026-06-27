"use client";
import { useEffect, useRef } from "react";

type Ripple = { x: number; y: number; t: number; id: number };

export default function CursorEffect() {
  const cursorRef  = useRef<HTMLDivElement>(null);
  const ringRef    = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const pos        = useRef({ x: 0, y: 0 });
  const ringPos    = useRef({ x: 0, y: 0 });
  const raf        = useRef<number>(0);
  const ripples    = useRef<Ripple[]>([]);
  const rippleId   = useRef(0);

  useEffect(() => {
    // Don't run on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };

      // Dot follows instantly
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top  = e.clientY + "px";
      }

      // Spawn a ripple at cursor position
      ripples.current.push({ x: e.clientX, y: e.clientY, t: 0, id: rippleId.current++ });
      // Keep max 12 ripples alive at once
      if (ripples.current.length > 12) ripples.current.shift();
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const loop = () => {
      // Trailing ring
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.1);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.1);
      if (ringRef.current) {
        ringRef.current.style.left = ringPos.current.x + "px";
        ringRef.current.style.top  = ringPos.current.y + "px";
      }

      // Water ripple canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ripples.current = ripples.current.filter(r => r.t < 1);
      ripples.current.forEach(r => {
        r.t += 0.022; // speed of expansion
        const radius  = r.t * 80;          // max radius 80px
        const opacity = (1 - r.t) * 0.35;  // fades out

        // Outer ring
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99,102,241,${opacity})`;
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        // Inner ring (slightly behind)
        if (r.t > 0.1) {
          const r2 = (r.t - 0.1) * 80;
          const o2 = (1 - r.t) * 0.2;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(139,92,246,${o2})`;
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      });

      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move);
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("resize",    resize);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* Water ripple canvas — behind everything else */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed", inset: 0,
          pointerEvents: "none",
          zIndex: 99990,
        }}
      />
      {/* Dot cursor */}
      <div id="cursor" ref={cursorRef} />
      {/* Trailing ring */}
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}