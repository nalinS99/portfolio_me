"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePortfolioData } from "@/lib/clientStore";
import { useTheme } from "@/components/ThemeProvider";

/* ── Apple macOS-style window ───────────────────────── */
function MacWindow() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [tab, setTab] = useState<"about"|"stack"|"stats"|"terminal">("about");
  const [time, setTime] = useState("");
  const [typed, setTyped] = useState("");
  const termLinesRef = React.useRef<string[]>([]);

  // Live clock
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false, timeZone:"Asia/Colombo" }));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  // Terminal typewriter on that tab
  useEffect(() => {
    if (tab !== "terminal") { setTimeout(() => { setTyped(""); }, 0); return; }
    const terminalLines = [
      "$ whoami", "nalin",
      "$ cat role.txt", "Software Engineer",
      "$ ls skills/", "TypeScript  Go  React  PostgreSQL  Docker",
      "$ echo $STATUS", "Available for work ✓",
    ];
    termLinesRef.current = [];
    let lineIdx = 0, charIdx = 0;
    let current = "";
    const tick = setInterval(() => {
      const line = terminalLines[lineIdx];
      if (!line) { clearInterval(tick); return; }
      if (charIdx < line.length) {
        current += line[charIdx];
        charIdx++;
        setTyped([...termLinesRef.current, current].join("\n"));
      } else {
        termLinesRef.current = [...termLinesRef.current, current];
        current = "";
        charIdx = 0;
        lineIdx++;
        setTyped(termLinesRef.current.join("\n"));
        if (lineIdx >= terminalLines.length) clearInterval(tick);
      }
    }, 38);
    return () => clearInterval(tick);
  }, [tab]);

  // Theme tokens
  const win   = isDark ? "#1a1d2e" : "#ffffff";
  const _bar  = isDark ? "#141624" : "#f0f0f0"; void _bar;
  const brd   = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const txt   = isDark ? "#e2e8f0" : "#1e293b";
  const txt2  = isDark ? "#94a3b8" : "#64748b";
  const txt3  = isDark ? "#475569" : "#94a3b8";
  const surf  = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const _surf2 = isDark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)"; void _surf2;
  const mono  = "'Fira Code', monospace";
  const tabActive   = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const tabInactive = "transparent";

  const tabs: { id: "about"|"stack"|"stats"|"terminal"; label: string; icon: string }[] = [
    { id:"about",    label:"about.json", icon:"{ }" },
    { id:"stack",    label:"stack.ts",   icon:"<>" },
    { id:"stats",    label:"stats",      icon:"▣" },
    { id:"terminal", label:"terminal",   icon:"~" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:".875rem" }}>
      {/* ── Window ── */}
      <div style={{
        background: win,
        border: `1px solid ${brd}`,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: isDark
          ? "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "0 8px 40px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
      }}>

        {/* Title bar */}
        <div style={{
          background: isDark
            ? "linear-gradient(180deg, #1e2133 0%, #161826 100%)"
            : "linear-gradient(180deg, #f5f5f5 0%, #ebebeb 100%)",
          padding: "0 1rem",
          height: 44,
          display: "flex", alignItems: "center",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.12)"}`,
          gap: "0.75rem",
          userSelect: "none",
        }}>
          {/* Traffic lights */}
          <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
            {[
              { bg:"#ff5f57", shadow:"rgba(255,95,87,0.5)", hover:"#ff3b30" },
              { bg:"#febc2e", shadow:"rgba(254,188,46,0.5)", hover:"#ff9f0a" },
              { bg:"#28c840", shadow:"rgba(40,200,64,0.5)",  hover:"#30d158" },
            ].map((dot, i) => (
              <div key={i} style={{
                width: 12, height: 12, borderRadius: "50%",
                background: dot.bg,
                boxShadow: `0 0 0 0.5px rgba(0,0,0,0.2), 0 1px 2px ${dot.shadow}`,
                transition: "filter 0.15s",
                cursor: "default",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.filter = "brightness(1.15)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.filter = "brightness(1)"}
              />
            ))}
          </div>

          {/* Window title + clock */}
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem" }}>
            <span style={{ fontSize:".72rem", color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", fontFamily: mono, letterSpacing:"0.02em" }}>
              nalin@portfolio
            </span>
          </div>

          {/* Live clock top-right */}
          <div style={{ flexShrink:0, fontFamily: mono, fontSize:".65rem", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)", letterSpacing:"0.04em" }}>
            {time}
          </div>
        </div>

        {/* Tab bar */}
        <div style={{
          background: isDark ? "#141624" : "#e8e8e8",
          borderBottom: `1px solid ${brd}`,
          display: "flex",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: ".4rem",
              padding: ".5rem 1rem",
              background: tab === t.id ? tabActive : tabInactive,
              border: "none",
              borderRight: `1px solid ${brd}`,
              borderBottom: tab === t.id
                ? `2px solid ${isDark ? "#6366f1" : "#4f46e5"}`
                : "2px solid transparent",
              color: tab === t.id ? txt : txt3,
              fontFamily: mono, fontSize: ".68rem",
              cursor: "pointer", whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}>
              <span style={{ opacity: .7, fontSize:".6rem" }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div style={{
          background: win,
          padding: "1.25rem 1.5rem",
          minHeight: 260,
          fontFamily: mono, fontSize: ".78rem", lineHeight: 1.85,
          color: txt2,
        }}>

          {/* ── ABOUT tab ── */}
          {tab === "about" && (
            <div>
              <div style={{ color: txt3, marginBottom:".25rem" }}>{"// Nalin S Bandara — about.json"}</div>
              <div style={{ color: isDark ? "#94a3b8" : "#64748b" }}>{"{"}</div>
              {[
                { k:"name",       v:'"Nalin S Bandara"',   type:"str" },
                { k:"role",       v:'"Software Engineer"', type:"str" },
                { k:"location",   v:'"Colombo, LK 🇱🇰"',  type:"str" },
                { k:"experience", v:'"2+ years"',          type:"str" },
                { k:"focus",      v:'"Full-Stack & Systems"', type:"str" },
                { k:"available",  v:"true",                type:"bool" },
              ].map(({k,v,type}) => (
                <div key={k} style={{ paddingLeft:"1.25rem", display:"flex", gap:".4rem", flexWrap:"wrap" }}>
                  <span style={{ color: isDark ? "#34d399" : "#059669" }}>&quot;{k}&quot;</span>
                  <span style={{ color: txt3 }}>:</span>
                  <span style={{ color: type==="bool" ? (isDark?"#fb923c":"#d97706") : (isDark?"#c084fc":"#7c3aed") }}>{v}</span>
                  <span style={{ color: txt3 }}>,</span>
                </div>
              ))}
              <div style={{ paddingLeft:"1.25rem", display:"flex", gap:".4rem", flexWrap:"wrap" }}>
                <span style={{ color: isDark?"#34d399":"#059669" }}>&quot;stack&quot;</span>
                <span style={{ color: txt3 }}>:</span>
                <span style={{ color: isDark?"#c084fc":"#7c3aed" }}>[</span>
                {["TypeScript","Go","PostgreSQL","React","Next.js"].map((s,i,arr)=>(
                  <span key={s}>
                    <span style={{ color: isDark?"#60a5fa":"#2563eb" }}>&quot;{s}&quot;</span>
                    {i < arr.length-1 && <span style={{color:txt3}}>, </span>}
                  </span>
                ))}
                <span style={{ color: isDark?"#c084fc":"#7c3aed" }}>]</span>
                <span style={{ color: txt3 }}>,</span>
              </div>
              <div style={{ color: isDark ? "#94a3b8" : "#64748b" }}>{"}"}</div>
            </div>
          )}

          {/* ── STACK tab ── */}
          {tab === "stack" && (
            <div>
              <div style={{ color: txt3, marginBottom:".75rem" }}>{"// tech stack — stack.ts"}</div>
              {[
                { label:"Frontend", items:["Next.js","React","TypeScript","Tailwind CSS"], color: isDark?"#60a5fa":"#2563eb" },
                { label:"Backend",  items:["Node.js","Go","GraphQL","REST APIs"],         color: isDark?"#34d399":"#059669" },
                { label:"Database", items:["PostgreSQL","Redis","MongoDB","Supabase"],    color: isDark?"#fb923c":"#d97706" },
                { label:"Infra",    items:["AWS","Docker","Kubernetes","CI/CD"],          color: isDark?"#c084fc":"#7c3aed" },
              ].map(row => (
                <div key={row.label} style={{ marginBottom:".75rem" }}>
                  <div style={{ display:"flex", gap:".5rem", alignItems:"center", flexWrap:"wrap" }}>
                    <span style={{ color: txt3, minWidth:72 }}>
                      <span style={{ color: isDark?"#c084fc":"#7c3aed" }}>const</span> {row.label.toLowerCase()}
                    </span>
                    <span style={{ color: txt3 }}>= [</span>
                    {row.items.map((item, i) => (
                      <span key={item}>
                        <span style={{ color: row.color }}>&quot;{item}&quot;</span>
                        {i < row.items.length-1 && <span style={{color:txt3}}>, </span>}
                      </span>
                    ))}
                    <span style={{ color: txt3 }}>]</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── STATS tab ── */}
          {tab === "stats" && (
            <div style={{ display:"flex", flexDirection:"column", gap:".6rem" }}>
              <div style={{ color: txt3, marginBottom:".25rem" }}>{"# system stats"}</div>
              {[
                { label:"Experience",   value:"2+ years",    bar:0.85, color:"#6366f1" },
                { label:"Projects",     value:"30+ shipped", bar:0.75, color:"#22d3ee" },
                { label:"Users Served", value:"10M+",        bar:0.92, color:"#a78bfa" },
                { label:"Uptime",       value:"99.9%",       bar:0.999,color:"#34d399" },
                { label:"Coffee/Day",   value:"∞ cups",      bar:1.0,  color:"#fb923c" },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:".2rem" }}>
                    <span style={{ color: txt2, fontSize:".73rem" }}>{stat.label}</span>
                    <span style={{ color: stat.color, fontSize:".7rem" }}>{stat.value}</span>
                  </div>
                  <div style={{ height:4, background: isDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)", borderRadius:999, overflow:"hidden" }}>
                    <div style={{
                      height:"100%", width:`${stat.bar*100}%`,
                      background:`linear-gradient(90deg, ${stat.color}, ${stat.color}99)`,
                      borderRadius:999,
                      boxShadow:`0 0 6px ${stat.color}66`,
                    }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop:".5rem", padding:".6rem .75rem", background: surf, borderRadius:6, border:`1px solid ${brd}`, display:"flex", alignItems:"center", gap:".5rem" }}>
                <span style={{ color:"#34d399", fontSize:".7rem" }}>●</span>
                <span style={{ color: isDark?"#34d399":"#059669", fontSize:".7rem" }}>System status: all green · GMT+5:30 · {time}</span>
              </div>
            </div>
          )}

          {/* ── TERMINAL tab ── */}
          {tab === "terminal" && (
            <div style={{
              background: isDark ? "#0a0c14" : "#1a1b26",
              borderRadius:6, padding:"1rem 1.1rem",
              minHeight:220,
              color: "#e2e8f0",
            }}>
              {typed.split("\n").map((line, i) => (
                <div key={i} style={{
                  color: line.startsWith("$") ? (isDark?"#60a5fa":"#7aa2f7")
                       : line.startsWith("✓") ? "#9ece6a"
                       : line.startsWith("up") ? "#e0af68"
                       : "#a9b1d6",
                  lineHeight:1.8,
                }}>
                  {line}
                </div>
              ))}
              <span style={{ animation:"blink-cursor 1s step-end infinite", borderRight:"1.5px solid #6366f1", marginLeft:1 }}>&nbsp;</span>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div style={{
          background: isDark ? "#141624" : "#e8e8e8",
          borderTop: `1px solid ${brd}`,
          padding:".35rem 1rem",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          fontSize:".62rem", fontFamily: mono,
          color: txt3,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:".75rem" }}>
            <span style={{ display:"flex", alignItems:"center", gap:".3rem" }}>
              <span style={{ color:"#34d399" }}>●</span>
              <span style={{ color: isDark?"#34d399":"#059669" }}>online</span>
            </span>
            <span>{tab === "about" ? "JSON" : tab === "stack" ? "TypeScript" : tab === "stats" ? "Markdown" : "bash"}</span>
          </div>
          <div style={{ display:"flex", gap:".75rem" }}>
            <span>LF</span>
            <span>UTF-8</span>
            <span style={{ color: isDark?"#6366f1":"#4f46e5" }}>Colombo</span>
          </div>
        </div>
      </div>

      {/* ── Quick links row below window ── */}
      <div style={{ display:"flex", gap:".5rem" }}>
        {[["GitHub",aboutInfo.github],["LinkedIn",aboutInfo.linkedin],["Twitter",aboutInfo.twitter]].map(([l,h])=>(
          <a key={l} href={h} target="_blank" rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            style={{ flex:1, justifyContent:"center" }}>
            {l}
          </a>
        ))}
      </div>

      <style>{`
        @keyframes blink-cursor {
          0%, 100% { border-color: #6366f1; }
          50% { border-color: transparent; }
        }
      `}</style>
    </div>
  );
}

function Reveal({ children, delay=0, style={} }: { children:React.ReactNode; delay?:number; style?:React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add("in"); }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return <div ref={ref} className="reveal" style={{ transitionDelay:`${delay}ms`, ...style }}>{children}</div>;
}

function SkillItem({ name, level }: { name:string; level:number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGo(true); }, { threshold:.5 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:".35rem" }}>
        <span style={{ fontSize:".875rem", color:"var(--text2)" }}>{name}</span>
        <span style={{ fontFamily:"'Fira Code',monospace", fontSize:".72rem", color:"var(--text3)" }}>{level}%</span>
      </div>
      <div className="skill-track">
        <div className="skill-fill" style={{ transform: go ? `scaleX(${level/100})` : "scaleX(0)" }} />
      </div>
    </div>
  );
}

export default function About() {
  const { experience, skills, about: aboutInfo } = usePortfolioData();
  return (
    <div style={{ position:"relative", zIndex:10 }}>
      {/* Hero */}
      <section style={{ padding:"9rem 1.5rem 5rem", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 400px", gap:"5rem", alignItems:"start" }}>
          <div>
            <p className="label fade-up d1" style={{ marginBottom:".75rem" }}>About</p>
            <h1 className="fade-up d2" style={{ fontSize:"clamp(2.5rem,6vw,4.5rem)", fontWeight:800, lineHeight:1.05, marginBottom:"2rem" }}>
              Nalin S<br />Bandara
            </h1>
            <div className="fade-up d3" style={{ display:"flex", flexDirection:"column", gap:"1rem", marginBottom:"2.5rem" }}>
              {aboutInfo.bio.map((p,i) => (
                <p key={i} style={{ fontSize:"1rem", color:"var(--text2)", lineHeight:1.8 }}>{p}</p>
              ))}
            </div>
            <div className="fade-up d4" style={{ display:"flex", gap:".75rem", flexWrap:"wrap" }}>
              <Link href="/#contact" className="btn btn-primary">Start a project</Link>
              <a href="#" className="btn btn-outline">Download CV</a>
            </div>
          </div>
          <div className="fade-up d3">
            <MacWindow />
          </div>
        </div>
      </section>

      {/* Experience */}
      <section style={{ padding:"5rem 1.5rem", background:"var(--bg2)", borderTop:"1px solid var(--border2)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <Reveal><p className="label" style={{marginBottom:".75rem"}}>Journey</p><h2 style={{fontSize:"clamp(1.6rem,3vw,2.5rem)",fontWeight:800,marginBottom:"3rem"}}>Experience</h2></Reveal>
          <div style={{ display:"flex", flexDirection:"column" }}>
            {experience.map((exp,i)=>(
              <Reveal key={exp.id} delay={i*70}>
                <div style={{ display:"grid", gridTemplateColumns:"180px 1fr", gap:"2rem", padding:"2rem 0", borderTop:"1px solid var(--border2)" }}>
                  <div>
                    <div style={{ fontFamily:"'Fira Code',monospace", fontSize:".75rem", color:"var(--text3)" }}>{exp.startYear} — {exp.endYear}</div>
                    <div style={{ fontSize:".85rem", color:"var(--text3)", marginTop:".2rem" }}>{exp.company}</div>
                    <div style={{ fontSize:".75rem", color:"var(--text3)", marginTop:".1rem", opacity:.7 }}>{exp.location}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:"1rem", marginBottom:".4rem" }}>{exp.role}</div>
                    <p style={{ fontSize:".875rem", color:"var(--text2)", lineHeight:1.75, marginBottom:".85rem" }}>{exp.description}</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:".4rem" }}>
                      {exp.tech.map(t=><span key={t} className="badge badge-gray">{t}</span>)}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
            <div style={{ borderTop:"1px solid var(--border2)" }} />
          </div>
        </div>
      </section>

      {/* Skills */}
      <section style={{ padding:"5rem 1.5rem" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <Reveal><p className="label" style={{marginBottom:".75rem"}}>Expertise</p><h2 style={{fontSize:"clamp(1.6rem,3vw,2.5rem)",fontWeight:800,marginBottom:"3rem"}}>Skills</h2></Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"2.5rem" }}>
            {(["Frontend","Backend","Infrastructure"] as const).map((cat,ci)=>(
              <Reveal key={cat} delay={ci*80}>
                <p style={{ fontFamily:"'Fira Code',monospace", fontSize:".72rem", textTransform:"uppercase", letterSpacing:".12em", color:"var(--indigo)", marginBottom:"1.25rem", fontWeight:500 }}>{cat}</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>
                  {skills.filter(s=>s.category===cat).map(s=><SkillItem key={s.id} name={s.name} level={s.level}/>)}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"5rem 1.5rem", background:"var(--bg2)", borderTop:"1px solid var(--border2)", textAlign:"center" }}>
        <div style={{ maxWidth:520, margin:"0 auto" }}>
          <Reveal>
            <h2 style={{ fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:800, marginBottom:"1rem" }}>Let&apos;s build something great</h2>
            <p style={{ color:"var(--text2)", marginBottom:"2rem", lineHeight:1.75 }}>Open to interesting projects, full-time roles, and collaborations.</p>
            <Link href="/#contact" className="btn btn-primary">Get in touch</Link>
          </Reveal>
        </div>
      </section>

      <style>{`
        @media(max-width:768px){
          [style*="1fr 400px"]{grid-template-columns:1fr!important;gap:2.5rem!important}
          [style*="180px 1fr"]{grid-template-columns:1fr!important}
          [style*="repeat(3,1fr)"]{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  );
}
