"use client";
import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setPct(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0,
      height: 2, zIndex: 9999, pointerEvents: "none",
    }}>
      <div style={{
        height: "100%",
        width: `${pct}%`,
        background: "linear-gradient(90deg, var(--indigo), var(--cyan), var(--violet))",
        backgroundSize: "200% 100%",
        animation: "aurora-shift 3s linear infinite",
        transition: "width 0.1s ease",
        boxShadow: "0 0 8px rgba(99,102,241,0.6)",
      }} />
    </div>
  );
}
