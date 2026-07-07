"use client";
import { useEffect, useState, useRef } from "react";

export default function Preloader() {
  const [phase, setPhase] = useState<"matrix"|"assemble"|"glitch"|"out"|"done">("matrix");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // Matrix rain canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols = Math.floor(canvas.width / 16);
    const drops: number[] = Array(cols).fill(1);
    const chars = "ナリンABCDEF0123456789@#$%<>[]{}|/\\あいうえお";

    function draw() {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx.font = "14px 'Fira Code', monospace";

      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const progress = y / (canvas!.height / 16);
        if (progress < 0.3) {
          ctx.fillStyle = "#ffffff";
        } else if (progress < 0.6) {
          ctx.fillStyle = "#6366f1";
        } else {
          ctx.fillStyle = "rgba(99,102,241,0.3)";
        }
        ctx.fillText(ch, i * 16, y * 16);
        if (y * 16 > canvas!.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Phase timeline — wait for fonts first
  useEffect(() => {
    let t1: ReturnType<typeof setTimeout>, t2: ReturnType<typeof setTimeout>,
        t3: ReturnType<typeof setTimeout>, t4: ReturnType<typeof setTimeout>;

    const start = () => {
      t1 = setTimeout(() => setPhase("assemble"), 800);
      t2 = setTimeout(() => setPhase("glitch"),   1600);
      t3 = setTimeout(() => setPhase("out"),      2400);
      t4 = setTimeout(() => setPhase("done"),     3100);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }

    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, []);

  if (phase === "done") return null;

  const isOut = phase === "out";
  const showName = phase === "assemble" || phase === "glitch" || phase === "out";
  const isGlitch = phase === "glitch";

  const name = "NALIN";

  return (
    <>
      <style>{`
        @keyframes matrix-fade {
          from { opacity: 1 } to { opacity: 0 }
        }
        @keyframes char-drop {
          0%   { opacity:0; transform: translateY(-40px) scale(1.4); filter: blur(12px); color:#fff; }
          60%  { opacity:1; transform: translateY(4px) scale(0.98); filter: blur(0); }
          100% { opacity:1; transform: translateY(0) scale(1); }
        }
        @keyframes glitch-skew {
          0%,100% { transform: skewX(0deg); }
          10%     { transform: skewX(-4deg); }
          20%     { transform: skewX(3deg); }
          30%     { transform: skewX(-2deg); }
          40%     { transform: skewX(0deg); }
          70%     { transform: skewX(2deg); }
          80%     { transform: skewX(-1deg); }
        }
        @keyframes glitch-r {
          0%,100%{ clip-path:inset(0 0 100% 0); transform:translate(6px,-2px); opacity:.8; }
          15%    { clip-path:inset(20% 0 60% 0); transform:translate(-6px,2px); }
          30%    { clip-path:inset(55% 0 25% 0); transform:translate(4px,-1px); }
          50%    { clip-path:inset(10% 0 75% 0); transform:translate(-4px,3px); }
          70%    { clip-path:inset(75% 0 8%  0); transform:translate(5px,-2px); }
          85%    { clip-path:inset(40% 0 42% 0); transform:translate(-3px,1px); }
        }
        @keyframes glitch-b {
          0%,100%{ clip-path:inset(60% 0 10% 0); transform:translate(-5px,3px); opacity:.6; }
          20%    { clip-path:inset(5%  0 80% 0); transform:translate(5px,-3px); }
          45%    { clip-path:inset(35% 0 45% 0); transform:translate(-4px,2px); }
          65%    { clip-path:inset(80% 0 5%  0); transform:translate(3px,-4px); }
          90%    { clip-path:inset(15% 0 70% 0); transform:translate(-2px,1px); }
        }
        @keyframes scanline-move {
          0%   { top: -10% }
          100% { top: 110% }
        }
        @keyframes curtain-l {
          from { transform: scaleX(1); transform-origin: right; }
          to   { transform: scaleX(0); transform-origin: right; }
        }
        @keyframes curtain-r {
          from { transform: scaleX(1); transform-origin: left; }
          to   { transform: scaleX(0); transform-origin: left; }
        }
        @keyframes bar-grow {
          from { width: 0; box-shadow: none; }
          to   { width: 100%; box-shadow: 0 0 20px #6366f1, 0 0 40px #6366f188; }
        }
        @keyframes tag-fade {
          from { opacity:0; letter-spacing:.8em; filter:blur(6px); }
          to   { opacity:1; letter-spacing:.3em; filter:blur(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.8); opacity: .8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes corner-in {
          from { opacity:0; transform: scale(0.5); }
          to   { opacity:1; transform: scale(1); }
        }
        .pl-char {
          display: inline-block;
          animation: char-drop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
          opacity: 0;
        }
      `}</style>

      {/* Curtain exit */}
      {isOut && <>
        <div style={{ position:"fixed", inset:"0 50% 0 0", zIndex:100001, background:"#000",
          animation:"curtain-l 0.65s cubic-bezier(0.76,0,0.24,1) forwards" }} />
        <div style={{ position:"fixed", inset:"0 0 0 50%", zIndex:100001, background:"#000",
          animation:"curtain-r 0.65s cubic-bezier(0.76,0,0.24,1) forwards" }} />
      </>}

      {/* Main overlay */}
      <div style={{
        position:"fixed", inset:0, zIndex:100000,
        background:"#000",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        gap:"1.75rem",
        opacity: isOut ? 0 : 1,
        transition: isOut ? "opacity 0.4s ease" : "none",
        pointerEvents: isOut ? "none" : "all",
        overflow:"hidden",
      }}>

        {/* Matrix canvas */}
        <canvas ref={canvasRef} style={{
          position:"absolute", inset:0,
          opacity: showName ? 0 : 0.85,
          transition: "opacity 0.6s ease",
          zIndex:0,
        }} />

        {/* Dark vignette over matrix */}
        <div style={{
          position:"absolute", inset:0, zIndex:1,
          background:"radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)",
          opacity: showName ? 1 : 0,
          transition:"opacity 0.5s",
        }}/>

        {/* Horizontal scanline */}
        <div style={{
          position:"absolute", left:0, right:0, height:2,
          background:"linear-gradient(90deg, transparent, #6366f188, #6366f1, #6366f188, transparent)",
          zIndex:2,
          animation:"scanline-move 3s linear infinite",
          boxShadow:"0 0 10px #6366f1",
        }}/>

        {/* Name block */}
        <div style={{ position:"relative", zIndex:3, textAlign:"center" }}>

          {/* Glitch layers — SVG clones */}
          {isGlitch && <>
            <svg aria-hidden viewBox="0 0 520 120" width="min(520px, 80vw)" height="auto"
              style={{ position:"absolute", inset:0, animation:"glitch-r 0.4s steps(1) infinite", pointerEvents:"none" }}>
              <text x="260" y="92" textAnchor="middle"
                fontFamily="system-ui,-apple-system,'Segoe UI',Arial,sans-serif"
                fontWeight="900" fontSize="96" letterSpacing="-2" fill="#6366f1">NALIN</text>
            </svg>
            <svg aria-hidden viewBox="0 0 520 120" width="min(520px, 80vw)" height="auto"
              style={{ position:"absolute", inset:0, animation:"glitch-b 0.4s steps(1) infinite 0.05s", pointerEvents:"none" }}>
              <text x="260" y="92" textAnchor="middle"
                fontFamily="system-ui,-apple-system,'Segoe UI',Arial,sans-serif"
                fontWeight="900" fontSize="96" letterSpacing="-2" fill="#22d3ee">NALIN</text>
            </svg>
          </>}

          {/* Main name — SVG so font always renders */}
          <svg viewBox="0 0 520 120" width="min(520px, 80vw)" height="auto"
            style={{
              position:"relative", zIndex:1,
              filter: showName ? "drop-shadow(0 0 30px rgba(99,102,241,0.6))" : "none",
              animation: isGlitch ? "glitch-skew 0.4s steps(1) infinite" : "none",
              transition:"filter 0.5s",
            }}>
            <defs>
              <linearGradient id="ng" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#ffffff" />
                <stop offset="50%"  stopColor="#a5b4fc" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            {!showName ? null : "NALIN".split("").map((c,i) => (
              <text key={i}
                x={52 + i * 86} y="92"
                textAnchor="middle"
                fontFamily="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif"
                fontWeight="900"
                fontSize="96"
                letterSpacing="-2"
                fill="url(#ng)"
                filter="url(#glow)"
                style={{
                  animation: `char-drop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i*90}ms forwards`,
                  opacity: 0,
                }}
              >{c}</text>
            ))}
          </svg>

          {/* Pulse rings */}
          {showName && <>
            <div style={{
              position:"absolute", inset:"-20px", borderRadius:"50%",
              border:"1px solid rgba(99,102,241,0.4)",
              animation:"pulse-ring 1.5s ease-out infinite",
              pointerEvents:"none",
            }}/>
            <div style={{
              position:"absolute", inset:"-20px", borderRadius:"50%",
              border:"1px solid rgba(34,211,238,0.3)",
              animation:"pulse-ring 1.5s ease-out infinite 0.5s",
              pointerEvents:"none",
            }}/>
          </>}
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily:"'Fira Code',monospace",
          fontSize:"clamp(.6rem,.85vw,.78rem)",
          color:"#6366f1",
          letterSpacing:".3em",
          textTransform:"uppercase",
          opacity: (phase==="glitch"||phase==="out") ? 1 : 0,
          animation: phase==="glitch" ? "tag-fade 0.6s cubic-bezier(0.16,1,0.3,1) forwards" : "none",
          zIndex:3,
          textShadow:"0 0 20px #6366f1",
        }}>
          Software Engineer · Colombo, LK
        </div>

        {/* Progress bar */}
        <div style={{
          width:220, height:1,
          background:"rgba(255,255,255,0.06)",
          borderRadius:99, overflow:"hidden",
          zIndex:3,
          opacity: showName ? 1 : 0,
          transition:"opacity 0.4s",
        }}>
          <div style={{
            height:"100%",
            background:"linear-gradient(90deg,#6366f1,#22d3ee,#a78bfa)",
            animation: showName ? "bar-grow 1.6s cubic-bezier(0.4,0,0.2,1) forwards" : "none",
          }}/>
        </div>

        {/* Corner brackets */}
        {(["tl","tr","bl","br"] as const).map(pos => (
          <div key={pos} style={{
            position:"absolute",
            top:    pos.startsWith("t") ? 28 : "auto",
            bottom: pos.startsWith("b") ? 28 : "auto",
            left:   pos.endsWith("l")   ? 28 : "auto",
            right:  pos.endsWith("r")   ? 28 : "auto",
            width:24, height:24,
            borderTop:    pos.startsWith("t") ? "2px solid rgba(99,102,241,0.5)" : "none",
            borderBottom: pos.startsWith("b") ? "2px solid rgba(99,102,241,0.5)" : "none",
            borderLeft:   pos.endsWith("l")   ? "2px solid rgba(99,102,241,0.5)" : "none",
            borderRight:  pos.endsWith("r")   ? "2px solid rgba(99,102,241,0.5)" : "none",
            opacity: showName ? 1 : 0,
            animation: showName ? "corner-in 0.4s ease forwards" : "none",
            zIndex:3,
          }}/>
        ))}

        {/* Bottom status */}
        <div style={{
          position:"absolute", bottom:32,
          fontFamily:"'Fira Code',monospace",
          fontSize:".55rem", color:"rgba(255,255,255,0.18)",
          letterSpacing:".2em", zIndex:3,
          opacity: showName ? 1 : 0,
          transition:"opacity 0.6s 0.3s",
        }}>
          INITIALIZING PORTFOLIO...
        </div>
      </div>
    </>
  );
}