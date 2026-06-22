"use client";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      style={{
        position: "fixed", bottom: "2rem", right: "2rem",
        zIndex: 400,
        width: 44, height: 44,
        borderRadius: "50%",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        color: "var(--indigo)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.1rem",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3), 0 0 12px rgba(99,102,241,0.2)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.9)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: visible ? "all" : "none",
      }}
    >
      ↑
    </button>
  );
}
