import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", zIndex: 10 }}>
      <div style={{ textAlign: "center", maxWidth: 560 }}>
        {/* Glitchy 404 */}
        <div style={{ position: "relative", marginBottom: "2rem" }}>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "clamp(6rem, 18vw, 12rem)",
            fontWeight: 700,
            lineHeight: 1,
            color: "transparent",
            WebkitTextStroke: "1px rgba(0,245,255,0.3)",
            userSelect: "none",
          }}>
            404
          </div>
          <div style={{
            position: "absolute", inset: 0,
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "clamp(6rem, 18vw, 12rem)",
            fontWeight: 700,
            lineHeight: 1,
            color: "var(--cyan)",
            opacity: 0.15,
            filter: "blur(8px)",
            userSelect: "none",
          }}>
            404
          </div>
        </div>

        {/* Terminal block */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", marginBottom: "2.5rem", textAlign: "left" }}>
          <div style={{ background: "var(--surface2)", padding: "0.6rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map(c => (
              <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
            ))}
            <span style={{ marginLeft: "0.5rem", fontFamily: "'Fira Code', monospace", fontSize: "0.68rem", color: "var(--muted)" }}>error.log</span>
          </div>
          <div style={{ padding: "1.5rem", fontFamily: "'Fira Code', monospace", fontSize: "0.82rem", lineHeight: 2 }}>
            <div><span style={{ color: "var(--green)" }}>$</span> <span style={{ color: "var(--muted)" }}>curl</span> <span style={{ color: "rgba(255,255,255,0.6)" }}>{`{requested_url}`}</span></div>
            <div style={{ color: "var(--pink)" }}>ERROR 404: Route not found in filesystem</div>
            <div style={{ color: "var(--muted)" }}>{">"} Page may have moved or never existed.</div>
            <div style={{ color: "var(--muted)" }}>{">"} Check the URL and try again.</div>
            <div style={{ marginTop: "0.5rem" }}>
              <span style={{ color: "var(--cyan)" }}>suggest</span>
              <span style={{ color: "var(--muted)" }}>: navigate to </span>
              <span style={{ color: "var(--green)" }}>/home</span>
              <span style={{ color: "var(--muted)" }}> or </span>
              <span style={{ color: "var(--green)" }}>/blog</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn-cyber">
            <span style={{ opacity: 0.5, marginRight: "0.3rem" }}>&gt;</span> Go Home
          </Link>
          <Link href="/blog" className="btn-ghost">
            Read Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
