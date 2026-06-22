"use client";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

/* ── Mini site preview inside laptop screen ─────────── */
function MiniSitePreview({ isDark }: { isDark: boolean }) {
  const [tab, setTab] = useState<"about"|"stack"|"stats">("about");
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Colombo" }));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const bg     = isDark ? "#07090f" : "#f8fafc";
  const surf   = isDark ? "#111520" : "#ffffff";
  const surf2  = isDark ? "#181c2e" : "#f1f5f9";
  const brd    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const txt    = isDark ? "#f1f5f9" : "#0f172a";
  const txt2   = isDark ? "#94a3b8" : "#334155";
  const txt3   = isDark ? "#475569" : "#94a3b8";
  const indigo = isDark ? "#6366f1" : "#4f46e5";
  const cyan   = isDark ? "#22d3ee" : "#0891b2";
  const green  = isDark ? "#10b981" : "#059669";
  const mono   = "'Fira Code', monospace";

  const tabs = [
    { id: "about" as const,  label: "about.json", icon: "{ }" },
    { id: "stack" as const,  label: "stack.ts",   icon: "<>" },
    { id: "stats" as const,  label: "stats",      icon: "▣" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: bg, overflow: "hidden", display: "flex", flexDirection: "column", fontFamily: mono }}>
      {/* Mini navbar */}
      <div style={{ height: 28, background: surf2, borderBottom: `1px solid ${brd}`, display: "flex", alignItems: "center", padding: "0 10px", gap: 6, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {["#ff5f57","#febc2e","#28c840"].map((c,i) => (
            <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: c, boxShadow: `0 0 0 0.5px rgba(0,0,0,0.2)` }} />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ background: surf, border: `1px solid ${brd}`, borderRadius: 4, padding: "1px 10px", fontSize: 7, color: txt3, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ opacity: .5 }}>🔒</span> nalin.dev/about
          </div>
        </div>
        <span style={{ fontSize: 7, color: txt3 }}>{time}</span>
      </div>

      {/* Window chrome */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", margin: 8, background: surf, border: `1px solid ${brd}`, borderRadius: 6, overflow: "hidden", boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 2px 12px rgba(0,0,0,0.1)" }}>
        {/* Title bar */}
        <div style={{ height: 26, background: isDark ? "#141624" : "#ebebeb", borderBottom: `1px solid ${brd}`, display: "flex", alignItems: "center", padding: "0 8px", gap: 5, flexShrink: 0 }}>
          {["#ff5f57","#febc2e","#28c840"].map((c,i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c, boxShadow: `0 0 0 0.5px rgba(0,0,0,0.2)` }} />
          ))}
          <span style={{ flex: 1, textAlign: "center", fontSize: 7, color: txt3 }}>nalin@portfolio — about.json</span>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", background: isDark ? "#141624" : "#e8e8e8", borderBottom: `1px solid ${brd}`, flexShrink: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "4px 8px", border: "none", borderRight: `1px solid ${brd}`,
              background: tab === t.id ? (isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)") : "transparent",
              borderBottom: tab === t.id ? `1.5px solid ${indigo}` : "1.5px solid transparent",
              color: tab === t.id ? txt : txt3,
              fontSize: 7, fontFamily: mono, cursor: "pointer", display: "flex", alignItems: "center", gap: 3,
            }}>
              <span style={{ opacity: .6, fontSize: 6 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "8px 10px", fontSize: 7.5, lineHeight: 1.8, color: txt2, overflowY: "auto" }}>

          {tab === "about" && (
            <div>
              <div style={{ color: txt3, marginBottom: 2, fontSize: 7 }}>{"// Nalin S Bandara"}</div>
              <div style={{ color: txt2 }}>{"{"}</div>
              {[
                { k: "name",       v: '"Nalin S Bandara"',      vc: isDark?"#c084fc":"#7c3aed" },
                { k: "role",       v: '"Software Engineer"',    vc: isDark?"#c084fc":"#7c3aed" },
                { k: "location",   v: '"Colombo, LK 🇱🇰"',    vc: isDark?"#c084fc":"#7c3aed" },
                { k: "experience", v: '"5+ years"',             vc: isDark?"#c084fc":"#7c3aed" },
                { k: "available",  v: "true",                   vc: isDark?"#fb923c":"#d97706" },
              ].map(({ k, v, vc }) => (
                <div key={k} style={{ paddingLeft: 10, display: "flex", gap: 3 }}>
                  <span style={{ color: isDark ? "#34d399" : "#059669" }}>"{k}"</span>
                  <span style={{ color: txt3 }}>:</span>
                  <span style={{ color: vc }}>{v}</span><span style={{ color: txt3 }}>,</span>
                </div>
              ))}
              <div style={{ paddingLeft: 10, display: "flex", gap: 3, flexWrap: "wrap" }}>
                <span style={{ color: isDark?"#34d399":"#059669" }}>"stack"</span>
                <span style={{ color: txt3 }}>: [</span>
                {["TS","Go","SQL","React"].map((s,i,a)=>(
                  <span key={s} style={{ color: isDark?"#60a5fa":"#2563eb" }}>"{s}"{i<a.length-1?<span style={{color:txt3}}>,</span>:null}</span>
                ))}
                <span style={{ color: txt3 }}>],</span>
              </div>
              <div style={{ color: txt2 }}>{"}"}</div>
            </div>
          )}

          {tab === "stack" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ color: txt3, fontSize: 7 }}>{"// tech stack"}</div>
              {[
                { label: "Frontend", items: ["Next.js","React","TypeScript"], color: isDark?"#60a5fa":"#2563eb" },
                { label: "Backend",  items: ["Node.js","Go","GraphQL"],       color: isDark?"#34d399":"#059669" },
                { label: "Infra",    items: ["AWS","Docker","Kubernetes"],    color: isDark?"#c084fc":"#7c3aed" },
              ].map(row => (
                <div key={row.label}>
                  <div style={{ color: txt3, marginBottom: 2, fontSize: 7 }}>
                    <span style={{ color: isDark?"#c084fc":"#7c3aed" }}>const</span> {row.label.toLowerCase()} = [
                  </div>
                  <div style={{ paddingLeft: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {row.items.map(item => (
                      <span key={item} style={{ color: row.color, background: `${row.color}18`, padding: "1px 5px", borderRadius: 3, fontSize: 7 }}>"{item}"</span>
                    ))}
                  </div>
                  <div style={{ color: txt3 }}>]</div>
                </div>
              ))}
            </div>
          )}

          {tab === "stats" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <div style={{ color: txt3, fontSize: 7, marginBottom: 2 }}>{"# system stats"}</div>
              {[
                { label: "Experience",   value: "5+ yrs", pct: 85, color: indigo },
                { label: "Projects",     value: "30+",    pct: 75, color: cyan },
                { label: "Users",        value: "10M+",   pct: 92, color: "#a78bfa" },
                { label: "Uptime",       value: "99.9%",  pct: 99, color: green },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2, fontSize: 7 }}>
                    <span style={{ color: txt2 }}>{s.label}</span>
                    <span style={{ color: s.color }}>{s.value}</span>
                  </div>
                  <div style={{ height: 3, background: isDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.07)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 4, padding: "4px 7px", background: isDark?"rgba(16,185,129,0.08)":"rgba(5,150,105,0.06)", border: `1px solid rgba(16,185,129,0.2)`, borderRadius: 5, display: "flex", alignItems: "center", gap: 4, fontSize: 7 }}>
                <span style={{ color: green }}>●</span>
                <span style={{ color: isDark?"#34d399":"#059669" }}>online · GMT+5:30 · {time}</span>
              </div>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div style={{ height: 16, background: isDark?"#141624":"#e8e8e8", borderTop: `1px solid ${brd}`, display: "flex", alignItems: "center", padding: "0 8px", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 6.5, color: txt3 }}>
            <span style={{ color: green }}>●</span>
            <span style={{ color: isDark?"#34d399":"#059669" }}>online</span>
            <span>·</span>
            <span>{tab === "about" ? "JSON" : tab === "stack" ? "TypeScript" : "Markdown"}</span>
          </div>
          <div style={{ display: "flex", gap: 6, fontSize: 6.5, color: txt3 }}>
            <span>UTF-8</span>
            <span style={{ color: indigo }}>LK 🇱🇰</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Tablet preview ──────────────────────────────────── */
function TabletPreview({ isDark }: { isDark: boolean }) {
  const surf  = isDark ? "#111520" : "#ffffff";
  const surf2 = isDark ? "#181c2e" : "#f1f5f9";
  const brd   = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const txt   = isDark ? "#f1f5f9" : "#0f172a";
  const txt2  = isDark ? "#94a3b8" : "#334155";
  const txt3  = isDark ? "#475569" : "#94a3b8";
  const indigo = isDark ? "#6366f1" : "#4f46e5";
  const bg     = isDark ? "#07090f" : "#f8fafc";

  return (
    <div style={{ width: "100%", height: "100%", background: bg, overflow: "hidden", display: "flex", flexDirection: "column", fontFamily: "'Fira Code', monospace", fontSize: 8 }}>
      {/* Mini nav */}
      <div style={{ height: 22, background: surf2, borderBottom: `1px solid ${brd}`, display: "flex", alignItems: "center", padding: "0 8px", gap: 4, flexShrink: 0 }}>
        <span style={{ fontSize: 7, color: txt3 }}>nalin.dev</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 6, color: txt3 }}>work · about · blog</span>
      </div>
      {/* Hero content */}
      <div style={{ padding: "12px 12px 8px", flex: 1 }}>
        <div style={{ fontSize: 6, color: indigo, marginBottom: 4, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Available for work</div>
        <div style={{ fontSize: 11, fontWeight: 800, lineHeight: 1.2, marginBottom: 6, color: txt, fontFamily: "'Oxanium', sans-serif" }}>
          Hi, I'm<br />Nalin.
        </div>
        <div style={{ fontSize: 7, color: txt2, lineHeight: 1.7, marginBottom: 10 }}>
          Software engineer from Colombo.<br />Full-stack & scalable systems.
        </div>
        <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
          <div style={{ padding: "4px 10px", borderRadius: 999, background: indigo, color: "white", fontSize: 6.5, fontWeight: 600 }}>View work</div>
          <div style={{ padding: "4px 10px", borderRadius: 999, border: `1px solid ${brd}`, color: txt2, fontSize: 6.5 }}>Contact</div>
        </div>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, borderTop: `1px solid ${brd}`, paddingTop: 10 }}>
          {[
            { n: "5+", l: "Years exp.", c: indigo },
            { n: "30+", l: "Projects", c: isDark?"#22d3ee":"#0891b2" },
            { n: "10M+", l: "Users", c: "#a78bfa" },
            { n: "99%", l: "Coffee ratio", c: isDark?"#10b981":"#059669" },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: 12, fontWeight: 800, color: s.c, fontFamily: "'Oxanium', sans-serif", lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 6, color: txt3, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Phone preview ───────────────────────────────────── */
function PhonePreview({ isDark }: { isDark: boolean }) {
  const bg     = isDark ? "#07090f" : "#f8fafc";
  const surf   = isDark ? "#111520" : "#ffffff";
  const surf2  = isDark ? "#181c2e" : "#f1f5f9";
  const brd    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const txt    = isDark ? "#f1f5f9" : "#0f172a";
  const txt2   = isDark ? "#94a3b8" : "#334155";
  const txt3   = isDark ? "#475569" : "#94a3b8";
  const indigo = isDark ? "#6366f1" : "#4f46e5";
  const green  = isDark ? "#10b981" : "#059669";

  return (
    <div style={{ width: "100%", height: "100%", background: bg, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Status bar */}
      <div style={{ height: 18, background: bg, display: "flex", alignItems: "center", padding: "0 10px", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ fontSize: 6.5, color: txt, fontWeight: 600, fontFamily: "sans-serif" }}>9:41</span>
        <div style={{ width: 30, height: 10, borderRadius: 5, background: surf2, border: `1px solid ${brd}` }} />
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 1 }}>
            {[3,4,5,5].map((h,i)=><div key={i} style={{ width: 2, height: h, background: txt3, borderRadius: 1 }} />)}
          </div>
          <span style={{ fontSize: 6.5, color: txt, fontFamily: "sans-serif" }}>●●</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "6px 10px 8px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {/* Pill badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: green, display: "inline-block", boxShadow: `0 0 5px ${green}` }} />
          <span style={{ fontSize: 6.5, color: green, fontFamily: "'Fira Code',monospace", fontWeight: 600 }}>Available</span>
        </div>

        {/* Hero text */}
        <div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.15, color: txt, fontFamily: "'Oxanium', sans-serif", marginBottom: 6 }}>
          Hi, I'm<br />
          <span style={{ background: `linear-gradient(135deg, ${indigo}, ${isDark?"#22d3ee":"#0891b2"})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Nalin.
          </span>
        </div>
        <div style={{ fontSize: 7.5, color: txt2, lineHeight: 1.7, marginBottom: 10, fontFamily: "sans-serif" }}>
          Software engineer<br />Colombo, Sri Lanka
        </div>

        {/* CTA */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
          <div style={{ padding: "7px 0", borderRadius: 999, background: `linear-gradient(135deg, ${indigo}, #7c3aed)`, color: "white", fontSize: 7.5, fontWeight: 700, textAlign: "center", fontFamily: "sans-serif", boxShadow: `0 4px 12px ${indigo}55` }}>View my work →</div>
          <div style={{ padding: "6px 0", borderRadius: 999, border: `1px solid ${brd}`, color: txt2, fontSize: 7.5, textAlign: "center", fontFamily: "sans-serif" }}>Get in touch</div>
        </div>

        {/* Mini project card */}
        <div style={{ background: surf, border: `1px solid ${brd}`, borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 7.5, fontWeight: 700, color: txt, fontFamily: "'Oxanium', sans-serif" }}>NexaCommerce</span>
            <span style={{ fontSize: 6, padding: "1px 5px", borderRadius: 999, background: "rgba(16,185,129,0.12)", color: green, border: `1px solid rgba(16,185,129,0.25)` }}>live</span>
          </div>
          <div style={{ fontSize: 6.5, color: txt3, lineHeight: 1.6, marginBottom: 5, fontFamily: "sans-serif" }}>High-performance e-commerce platform with 500K+ daily transactions</div>
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {["Next.js","Go","Redis"].map(t => (
              <span key={t} style={{ fontSize: 6, padding: "1px 5px", borderRadius: 3, background: surf2, color: txt3, border: `1px solid ${brd}` }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${brd}`, paddingTop: 8 }}>
          {[["5+","yrs"],["30+","projects"],["10M+","users"]].map(([n,l])=>(
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: indigo, fontFamily: "'Oxanium', sans-serif", lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 6, color: txt3, fontFamily: "sans-serif" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Home bar */}
      <div style={{ height: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <div style={{ width: 40, height: 3, borderRadius: 999, background: isDark?"rgba(255,255,255,0.2)":"rgba(0,0,0,0.15)" }} />
      </div>
    </div>
  );
}

/* ── Main DeviceMockup ───────────────────────────────── */
export default function DeviceMockup() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const laptopBg  = isDark ? "linear-gradient(135deg, #1e2133 0%, #141624 100%)" : "linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)";
  const laptopEdge = isDark ? "#2a2d42" : "#b0b4bd";
  const hingeClr  = isDark ? "#1a1d2e" : "#c4c7cf";
  const baseBg    = isDark ? "linear-gradient(135deg, #252839 0%, #1a1d2e 100%)" : "linear-gradient(135deg, #c4c7cf 0%, #a8acb5 100%)";
  const phoneBg   = isDark ? "linear-gradient(145deg, #1e2133, #141624)" : "linear-gradient(145deg, #e5e7eb, #d1d5db)";
  const tabletBg  = isDark ? "linear-gradient(135deg, #1e2133, #141624)" : "linear-gradient(135deg, #d1d5db, #b8bcc6)";
  const screenBrd = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.12)";

  return (
    <div style={{ position: "relative", width: "100%", paddingBottom: "72%" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>

        {/* ════ LAPTOP ════ */}
        <div style={{ position: "absolute", left: 0, top: 0, width: "88%", zIndex: 1 }}>
          {/* Lid / screen */}
          <div style={{ background: laptopBg, borderRadius: "10px 10px 3px 3px", padding: "10px 10px 6px", boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)" : "0 12px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.1)" }}>
            {/* Apple logo notch area */}
            <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 12, height: 12, borderRadius: "50%", background: isDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="7" height="8" viewBox="0 0 7 8" fill="none">
                <path d="M3.5 0.5 C2.8 0.5 2 1 1.5 1.8 C1 2.6 1 3.4 1.3 4.2 C1.6 5 2.2 5.5 2.8 5.5 C3.1 5.5 3.3 5.4 3.5 5.4 C3.7 5.4 3.9 5.5 4.2 5.5 C4.8 5.5 5.4 5 5.7 4.2 C6 3.4 6 2.6 5.5 1.8 C5 1 4.2 0.5 3.5 0.5 Z" fill={isDark?"rgba(255,255,255,0.2)":"rgba(0,0,0,0.2)"} />
                <path d="M3.5 0.5 C3.5 -0.1 4 -0.2 4.3 0.2" stroke={isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.15)"} strokeWidth="0.6" fill="none" />
              </svg>
            </div>
            {/* Screen bezel */}
            <div style={{ background: "#000", borderRadius: 6, overflow: "hidden", border: `1px solid ${screenBrd}`, aspectRatio: "16/10", position: "relative" }}>
              <MiniSitePreview isDark={isDark} />
              {/* Screen glare */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%)", pointerEvents: "none", borderRadius: 6 }} />
            </div>
          </div>
          {/* Hinge */}
          <div style={{ height: 4, background: hingeClr, borderRadius: "0 0 2px 2px", margin: "0 5%" }} />
          {/* Base */}
          <div style={{ background: baseBg, borderRadius: "0 0 8px 8px", padding: "8px 0 10px", boxShadow: isDark?"0 8px 24px rgba(0,0,0,0.4)":"0 4px 16px rgba(0,0,0,0.15)", position: "relative" }}>
            {/* Trackpad */}
            <div style={{ width: "28%", height: 20, margin: "0 auto", borderRadius: 4, border: `1px solid ${isDark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.12)"}`, background: isDark?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.4)" }} />
            {/* Bottom edge */}
            <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 2, borderRadius: "0 0 6px 6px", background: isDark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.1)" }} />
          </div>
        </div>

        {/* ════ TABLET ════ */}
        <div style={{ position: "absolute", right: "4%", top: "8%", width: "32%", zIndex: 2, filter: isDark?"drop-shadow(0 16px 40px rgba(0,0,0,0.6))":"drop-shadow(0 8px 24px rgba(0,0,0,0.2))" }}>
          {/* Outer frame */}
          <div style={{ background: tabletBg, borderRadius: 14, padding: "10px 6px", border: `1px solid ${isDark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.12)"}` }}>
            {/* Top camera */}
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: isDark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.15)", margin: "0 auto 5px" }} />
            {/* Screen */}
            <div style={{ background: "#000", borderRadius: 8, overflow: "hidden", border: `1px solid ${screenBrd}`, aspectRatio: "3/4" }}>
              <TabletPreview isDark={isDark} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.04) 0%, transparent 35%)", pointerEvents: "none" }} />
            </div>
            {/* Home indicator */}
            <div style={{ width: 30, height: 3, borderRadius: 999, background: isDark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.15)", margin: "6px auto 0" }} />
          </div>
          {/* Side button */}
          <div style={{ position: "absolute", right: -2, top: "22%", width: 3, height: 20, borderRadius: "0 2px 2px 0", background: isDark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.2)" }} />
        </div>

        {/* ════ PHONE ════ */}
        <div style={{ position: "absolute", right: "0%", bottom: "2%", width: "18%", zIndex: 3, filter: isDark?"drop-shadow(0 12px 30px rgba(0,0,0,0.7))":"drop-shadow(0 6px 20px rgba(0,0,0,0.25))" }}>
          {/* Outer frame */}
          <div style={{ background: phoneBg, borderRadius: 18, padding: "8px 5px", border: `1px solid ${isDark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.14)"}`, position: "relative" }}>
            {/* Dynamic island */}
            <div style={{ width: 20, height: 5, borderRadius: 999, background: "#000", margin: "0 auto 5px", boxShadow: `0 0 0 1px ${isDark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.12)"}` }} />
            {/* Screen */}
            <div style={{ background: "#000", borderRadius: 12, overflow: "hidden", border: `1px solid ${screenBrd}`, aspectRatio: "9/19.5" }}>
              <PhonePreview isDark={isDark} />
            </div>
            {/* Home indicator */}
            <div style={{ width: 20, height: 2.5, borderRadius: 999, background: isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.2)", margin: "5px auto 0" }} />
          </div>
          {/* Side buttons */}
          <div style={{ position: "absolute", right: -2, top: "18%", width: 2.5, height: 18, borderRadius: "0 2px 2px 0", background: isDark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.2)" }} />
          <div style={{ position: "absolute", left: -2, top: "22%", width: 2.5, height: 12, borderRadius: "2px 0 0 2px", background: isDark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.2)" }} />
          <div style={{ position: "absolute", left: -2, top: "34%", width: 2.5, height: 12, borderRadius: "2px 0 0 2px", background: isDark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.2)" }} />
        </div>

      </div>
    </div>
  );
}
