"use client";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setVisible(false), 600);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes pl-bar {
          0%   { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes pl-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes pl-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "var(--bg, #0a0a0f)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "2rem",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.6s ease",
        pointerEvents: fadeOut ? "none" : "all",
      }}>
        {/* Logo / name */}
        <div style={{
          fontFamily: "'Oxanium', sans-serif",
          fontSize: "2rem", fontWeight: 800,
          color: "var(--text, #fff)",
          letterSpacing: "-0.03em",
          animation: "pl-pulse 1.4s ease-in-out infinite",
        }}>
          Nalin<span style={{ color: "var(--indigo, #6366f1)" }}>.</span>
        </div>

        {/* Progress bar */}
        <div style={{
          width: 180, height: 2,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 99,
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            background: "var(--indigo, #6366f1)",
            transformOrigin: "left center",
            animation: "pl-bar 1.6s cubic-bezier(0.4,0,0.2,1) forwards",
          }} />
        </div>

        {/* Small spinner ring */}
        <div style={{
          width: 20, height: 20,
          border: "2px solid rgba(255,255,255,0.1)",
          borderTop: "2px solid var(--indigo, #6366f1)",
          borderRadius: "50%",
          animation: "pl-spin 0.8s linear infinite",
        }} />
      </div>
    </>
  );
}
