"use client";
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body style={{ background: "#060810", color: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "monospace" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#00f5ff", fontSize: "4rem", marginBottom: "1rem" }}>ERR</div>
          <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>Something went wrong.</p>
          <button onClick={reset} style={{ border: "1px solid #00f5ff", color: "#00f5ff", background: "none", padding: "0.5rem 1.5rem", cursor: "pointer" }}>
            RETRY
          </button>
        </div>
      </body>
    </html>
  );
}
