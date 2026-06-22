"use client";
import { useEffect, useRef } from "react";

export default function FlowingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Blob definitions — 4 slow-moving aurora blobs
    const blobs = [
      { x: 0.15, y: 0.2,  r: 0.42, ox: 0.08, oy: 0.06, speed: 0.00018, cr: 99,  cg: 102, cb: 241 }, // indigo
      { x: 0.82, y: 0.75, r: 0.38, ox: 0.07, oy: 0.09, speed: 0.00022, cr: 34,  cg: 211, cb: 238 }, // cyan
      { x: 0.5,  y: 0.5,  r: 0.30, ox: 0.06, oy: 0.05, speed: 0.00015, cr: 139, cg: 92,  cb: 246 }, // violet
      { x: 0.75, y: 0.15, r: 0.25, ox: 0.09, oy: 0.07, speed: 0.00025, cr: 16,  cg: 185, cb: 129 }, // green
    ];

    // Check theme
    const isDark = () => document.documentElement.getAttribute("data-theme") !== "light";

    const draw = () => {
      tRef.current += 1;
      const t = tRef.current;
      const W = canvas.width;
      const H = canvas.height;
      const dark = isDark();

      ctx.clearRect(0, 0, W, H);

      blobs.forEach((b, i) => {
        // Sinusoidal drift
        const phase = t * b.speed * Math.PI * 2 + i * 1.4;
        const cx = (b.x + Math.sin(phase) * b.ox) * W;
        const cy = (b.y + Math.cos(phase * 0.77) * b.oy) * H;
        const r = b.r * Math.min(W, H);

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        const alpha = dark ? 0.055 : 0.04;
        grad.addColorStop(0,   `rgba(${b.cr},${b.cg},${b.cb},${alpha})`);
        grad.addColorStop(0.5, `rgba(${b.cr},${b.cg},${b.cb},${alpha * 0.4})`);
        grad.addColorStop(1,   `rgba(${b.cr},${b.cg},${b.cb},0)`);

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        mixBlendMode: "screen",
      }}
    />
  );
}
