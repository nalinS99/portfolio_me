"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

const ANCHOR_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#projects", label: "Work" },
  { href: "/#contact", label: "Contact" },
];
const PAGE_LINKS = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

function SunIcon() {
  return <svg width="15" height="15" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
}
function DownloadIcon() {
  return <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
}
function MoonIcon() {
  return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  const downloadCV = () => {
    if (typeof window === "undefined") return;
    const data = localStorage.getItem("admin_cv_base64");
    const name = localStorage.getItem("admin_cv_filename") || "CV-Nalin-Bandara.pdf";
    if (!data) { alert("CV not available yet."); return; }
    const bytes = atob(data);
    const arr   = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    const blob  = new Blob([arr], { type: "application/pdf" });
    const url   = URL.createObjectURL(blob);
    const a     = document.createElement("a");
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const isPageActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const allLinks = [...ANCHOR_LINKS, ...PAGE_LINKS];

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
        padding: scrolled ? "0" : "0.75rem 0",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{
          maxWidth: scrolled ? "100%" : "900px",
          margin: "0 auto",
          background: scrolled
            ? (theme === "dark" ? "var(--bg)" : "rgba(248,250,252,0.95)")
            : (theme === "dark" ? "rgba(10,10,20,0.55)" : "rgba(255,255,255,0.6)"),
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderRadius: scrolled ? 0 : "999px",
          border: scrolled ? "none" : `1px solid ${theme === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
          borderBottom: scrolled ? "1px solid var(--border2)" : `1px solid ${theme === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
          boxShadow: scrolled ? "none" : "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
          overflow: "hidden",
        }}>
          <div style={{
            padding: scrolled ? "0 max(1.5rem, calc((100% - 1200px)/2))" : "0 1.5rem",
            height: 60,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
            transition: "padding 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}>

            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexShrink: 0, textDecoration: "none" }}>
              <div style={{
                width: 30, height: 30,
                background: "linear-gradient(135deg, var(--indigo), var(--cyan))",
                borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 16px rgba(99,102,241,0.4)",
              }}>
                <span style={{ color: "white", fontFamily: "'Oxanium', sans-serif", fontWeight: 800, fontSize: "0.88rem" }}>N</span>
              </div>
              <span style={{ fontFamily: "'Oxanium', sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>
                Nalin<span style={{ background: "linear-gradient(90deg, var(--indigo), var(--cyan))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>.</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav style={{ display: "flex", alignItems: "center", gap: "0.1rem" }} className="hide-md">
              {allLinks.map(l => {
                const isActive = l.href === "/" ? pathname === "/" : isPageActive(l.href);
                const isHov = hoveredLink === l.href;
                return (
                  <Link key={l.href} href={l.href}
                    onMouseEnter={() => setHoveredLink(l.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={{
                      position: "relative",
                      padding: "0.42rem 0.875rem",
                      borderRadius: 999,
                      fontSize: "0.875rem",
                      fontWeight: isActive ? 600 : 450,
                      color: isActive ? "var(--text)" : isHov ? "var(--text)" : "var(--text2)",
                      background: isActive ? "rgba(99,102,241,0.12)" : isHov ? "rgba(255,255,255,0.05)" : "transparent",
                      border: isActive ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
                      textDecoration: "none",
                      transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                      whiteSpace: "nowrap",
                      display: "flex", alignItems: "center", gap: "0.35rem",
                    }}>
                    {l.label}
                    {isActive && (
                      <span style={{
                        width: 4, height: 4, borderRadius: "50%",
                        background: "var(--indigo)",
                        boxShadow: "0 0 6px var(--indigo)",
                        flexShrink: 0,
                      }} />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className="hide-md">
              <div style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.28rem 0.75rem", borderRadius: 999,
                border: "1px solid rgba(16,185,129,0.25)",
                background: "rgba(16,185,129,0.06)",
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "var(--green)", boxShadow: "0 0 8px var(--green)",
                  display: "inline-block", animation: "pulse-dot 2s ease-in-out infinite",
                }} />
                <span style={{ fontSize: "0.72rem", color: "var(--green)", whiteSpace: "nowrap", fontWeight: 500 }}>Available</span>
              </div>
              <button className="theme-btn" onClick={toggle} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </button>
              <button onClick={downloadCV} title="Download CV" style={{
                display: "flex", alignItems: "center", gap: "0.35rem",
                padding: "0.45rem 0.9rem", borderRadius: 999,
                fontSize: "0.82rem", fontWeight: 600,
                background: "transparent",
                color: "var(--text2)",
                border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                transition: "all 0.2s", whiteSpace: "nowrap", cursor: "pointer",
              }}>
                <DownloadIcon />
                CV
              </button>
              <Link href="/#contact" style={{
                padding: "0.45rem 1.1rem", borderRadius: 999,
                fontSize: "0.82rem", fontWeight: 600,
                background: "linear-gradient(135deg, var(--indigo), #7c3aed)",
                color: "white", textDecoration: "none",
                boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                transition: "all 0.2s", whiteSpace: "nowrap",
              }}>Hire me</Link>
            </div>

            {/* Mobile right */}
            <div style={{ display: "none", alignItems: "center", gap: "0.5rem" }} className="show-md">
              <button className="theme-btn" onClick={toggle}>{theme === "dark" ? <SunIcon /> : <MoonIcon />}</button>
              <button onClick={() => setOpen(o => !o)}
                style={{ background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: 8, padding: "0.5rem", display: "flex", flexDirection: "column", gap: 4 }}>
                {[0,1,2].map(i => (
                  <span key={i} style={{
                    display: "block", width: 18, height: 1.5, background: "var(--text2)", borderRadius: 2, transition: "all .25s",
                    opacity: open && i===1 ? 0 : 1,
                    transform: open ? (i===0?"rotate(45deg) translate(3px,4px)":i===2?"rotate(-45deg) translate(3px,-4px)":"none"):"none",
                  }} />
                ))}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div style={{
        position: "fixed", top: 60, left: 0, right: 0, zIndex: 499,
        background: "var(--bg2)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border2)",
        maxHeight: open ? "420px" : "0", overflow: "hidden",
        transition: "max-height 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{ padding: "1rem 1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
          <p style={{ fontSize: "0.62rem", fontFamily: "'Fira Code',monospace", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text3)", padding: "0.25rem 0.75rem 0.5rem" }}>Sections</p>
          {ANCHOR_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="nav-item" style={{ fontSize: "0.95rem", padding: "0.65rem 0.75rem" }}>{l.label}</Link>
          ))}
          <div style={{ height: 1, background: "var(--border2)", margin: "0.5rem 0.75rem" }} />
          <p style={{ fontSize: "0.62rem", fontFamily: "'Fira Code',monospace", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text3)", padding: "0.25rem 0.75rem 0.5rem" }}>Pages</p>
          {PAGE_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={`nav-item${isPageActive(l.href) ? " active" : ""}`}
              style={{ fontSize: "0.95rem", padding: "0.65rem 0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {l.label}
              <span style={{ fontSize: "0.68rem", color: "var(--indigo)", fontFamily: "'Fira Code',monospace" }}>page →</span>
            </Link>
          ))}
          <div style={{ marginTop: "0.75rem", display:"flex", flexDirection:"column", gap:"0.5rem" }}>
            <button onClick={downloadCV} style={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
              padding:"0.65rem 1.25rem", borderRadius:999, width:"100%",
              background:"transparent", border:"1px solid var(--border2)",
              color:"var(--text2)", fontWeight:600, fontSize:"0.9rem", cursor:"pointer",
            }}>
              <DownloadIcon /> Download CV
            </button>
            <Link href="/#contact" onClick={() => setOpen(false)} style={{
              display: "flex", justifyContent: "center",
              padding: "0.65rem 1.25rem", borderRadius: 999,
              background: "linear-gradient(135deg, var(--indigo), #7c3aed)",
              color: "white", fontWeight: 600, fontSize: "0.9rem",
              textDecoration: "none", boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
            }}>Hire me</Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
        .show-md { display: none; }
        @media(max-width: 768px) {
          .hide-md { display: none !important; }
          .show-md { display: flex !important; }
        }
      `}</style>
    </>
  );
}
