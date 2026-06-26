"use client";
import Link from "next/link";
import { usePortfolioData } from "@/lib/clientStore";

export default function Footer() {
  const { about: aboutInfo } = usePortfolioData();
  return (
    <footer style={{ position:"relative", background:"var(--bg2)", padding:"3rem 0 2rem", zIndex:10, overflow:"hidden" }}>
      {/* Gradient top border */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg, transparent 0%, var(--indigo) 30%, var(--cyan) 60%, var(--violet) 80%, transparent 100%)" }} />
      {/* Subtle background glow */}
      <div style={{ position:"absolute", bottom:-60, left:"50%", transform:"translateX(-50%)", width:600, height:200, background:"radial-gradient(ellipse, rgba(99,102,241,0.04) 0%, transparent 70%)", pointerEvents:"none" }} />

      <div className="container" style={{ position:"relative" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr", gap:"2.5rem", marginBottom:"2.5rem" }}>
          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.875rem" }}>
              <div style={{ width:28, height:28, background:"linear-gradient(135deg, var(--indigo), var(--cyan))", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 12px rgba(99,102,241,0.3)" }}>
                <span style={{ color:"white", fontFamily:"'Oxanium', sans-serif", fontWeight:800, fontSize:"0.82rem" }}>N</span>
              </div>
              <span style={{ fontFamily:"'Oxanium', sans-serif", fontWeight:700, fontSize:"0.95rem", color:"var(--text)" }}>
                Nalin<span style={{ background:"linear-gradient(90deg, var(--indigo), var(--cyan))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>.</span>
              </span>
            </div>
            <p style={{ fontSize:"0.85rem", color:"var(--text3)", lineHeight:1.7, maxWidth:260 }}>
              Software engineer building fast, reliable, and well-crafted software from Colombo, Sri Lanka.
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginTop:"1rem", padding:"0.3rem 0.75rem", borderRadius:999, border:"1px solid rgba(16,185,129,0.2)", background:"rgba(16,185,129,0.05)", width:"fit-content" }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--green)", boxShadow:"0 0 6px var(--green)", display:"inline-block" }} />
              <span style={{ fontSize:"0.78rem", color:"var(--green)", fontWeight:500 }}>Available for new projects</span>
            </div>
          </div>

          {/* Pages */}
          <div>
            <p style={{ fontSize:"0.7rem", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--text3)", marginBottom:"1rem" }}>Site</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
              {[["Home","/"],["Work","/#projects"],["About","/about"],["Blog","/blog"],["Contact","/#contact"]].map(([l,h])=>(
                <Link key={h} href={h} className="footer-link" style={{ fontSize:"0.875rem", color:"var(--text3)", textDecoration:"none", transition:"color .15s, padding-left .15s" }}>
                  {l}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <p style={{ fontSize:"0.7rem", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--text3)", marginBottom:"1rem" }}>Connect</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
              {[["GitHub",aboutInfo.github],["LinkedIn",aboutInfo.linkedin],["Twitter",aboutInfo.twitter],[`Email`,`mailto:${aboutInfo.email}`]].map(([l,h])=>(
                <a key={l} href={h} target="_blank" rel="noopener noreferrer"
                  className="footer-link" style={{ fontSize:"0.875rem", color:"var(--text3)", textDecoration:"none", transition:"color .15s", display:"flex", alignItems:"center", gap:".35rem" }}>
                  {l} <span style={{ fontSize:".7rem", opacity:.5 }}>↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop:"1px solid var(--border2)", paddingTop:"1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"0.75rem" }}>
          <span style={{ fontSize:"0.8rem", color:"var(--text3)" }}>
            © {new Date().getFullYear()} Nalin S Bandara — Built with Next.js & TypeScript
          </span>
          <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
            <span style={{ fontSize:"0.72rem", color:"var(--text3)", fontFamily:"'Fira Code',monospace", opacity:.6 }}>
              Crafted with ♥
            </span>
            <span style={{ fontSize:"0.78rem", color:"var(--text3)", fontFamily:"'Fira Code',monospace" }}>
              LK 🇱🇰
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: var(--text) !important; padding-left: 0.25rem; }
        @media(max-width: 768px) {
          .container > div:first-child { grid-template-columns: 1fr 1fr !important; }
        }
        @media(max-width: 640px) {
          .container > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
