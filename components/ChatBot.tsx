"use client";
import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTED = [
  "What are your skills?",
  "Tell me about your projects",
  "Are you available for hire?",
  "How can I contact you?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Nalin's assistant 👋 Ask me anything about his skills, projects, or experience!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    setError("");

    const newMessages: Message[] = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setMessages([...newMessages, { role: "assistant", content: data.message }]);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes chat-in {
          from { opacity:0; transform:translateY(20px) scale(0.95); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes bounce-dot {
          0%,80%,100% { transform:translateY(0); }
          40%          { transform:translateY(-6px); }
        }
        .chat-dot { animation: bounce-dot 1.2s ease-in-out infinite; }
        .chat-dot:nth-child(2) { animation-delay:.15s; }
        .chat-dot:nth-child(3) { animation-delay:.3s; }
        @keyframes pulse-btn {
          0%,100% { box-shadow:0 0 0 0 rgba(99,102,241,0.4); }
          50%      { box-shadow:0 0 0 12px rgba(99,102,241,0); }
        }
      `}</style>

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Chat with Nalin's assistant"
        style={{
          position:"fixed", bottom:24, right:24, zIndex:9000,
          width:56, height:56, borderRadius:"50%",
          background:"linear-gradient(135deg,#6366f1,#7c3aed)",
          border:"none", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 4px 24px rgba(99,102,241,0.5)",
          animation:"pulse-btn 2.5s ease-in-out infinite",
          transition:"transform 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        }
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position:"fixed", bottom:92, right:24, zIndex:8999,
          width:"min(380px, calc(100vw - 32px))",
          height:"min(520px, calc(100vh - 120px))",
          background:"var(--bg2, #1a1d2e)",
          border:"1px solid rgba(99,102,241,0.2)",
          borderRadius:16,
          display:"flex", flexDirection:"column",
          boxShadow:"0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)",
          animation:"chat-in 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards",
          overflow:"hidden",
        }}>

          {/* Header */}
          <div style={{
            padding:"0.875rem 1rem",
            borderBottom:"1px solid rgba(255,255,255,0.06)",
            background:"linear-gradient(135deg,rgba(99,102,241,0.15),rgba(124,58,237,0.1))",
            display:"flex", alignItems:"center", gap:"0.75rem",
          }}>
            <div style={{
              width:36, height:36, borderRadius:"50%",
              background:"linear-gradient(135deg,#6366f1,#7c3aed)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"1rem", flexShrink:0,
            }}>🤖</div>
            <div>
              <div style={{ fontWeight:600, fontSize:".875rem", color:"var(--text,#e2e8f0)" }}>Nalin's Assistant</div>
              <div style={{ fontSize:".68rem", color:"#34d399", display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#34d399", display:"inline-block" }}/>
                Online
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex:1, overflowY:"auto", padding:"0.875rem",
            display:"flex", flexDirection:"column", gap:"0.625rem",
            scrollbarWidth:"thin",
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display:"flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth:"82%",
                  padding:"0.5rem 0.875rem",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.role === "user"
                    ? "linear-gradient(135deg,#6366f1,#7c3aed)"
                    : "rgba(255,255,255,0.06)",
                  color: m.role === "user" ? "#fff" : "var(--text2,#94a3b8)",
                  fontSize:".82rem", lineHeight:1.6,
                  border: m.role === "assistant" ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}>
                  {m.content}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div style={{ display:"flex" }}>
                <div style={{
                  padding:"0.5rem 0.875rem",
                  borderRadius:"16px 16px 16px 4px",
                  background:"rgba(255,255,255,0.06)",
                  border:"1px solid rgba(255,255,255,0.06)",
                  display:"flex", gap:4, alignItems:"center",
                }}>
                  {[0,1,2].map(i => (
                    <div key={i} className="chat-dot" style={{
                      width:6, height:6, borderRadius:"50%",
                      background:"#6366f1",
                    }}/>
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                padding:"0.5rem 0.875rem", borderRadius:8,
                background:"rgba(239,68,68,0.1)",
                border:"1px solid rgba(239,68,68,0.2)",
                color:"#fca5a5", fontSize:".78rem",
              }}>{error}</div>
            )}

            <div ref={bottomRef}/>
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div style={{
              padding:"0 0.875rem 0.5rem",
              display:"flex", gap:"0.375rem", flexWrap:"wrap",
            }}>
              {SUGGESTED.map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  padding:"0.3rem 0.65rem",
                  borderRadius:99,
                  background:"rgba(99,102,241,0.12)",
                  border:"1px solid rgba(99,102,241,0.25)",
                  color:"#a5b4fc", fontSize:".7rem",
                  cursor:"pointer", whiteSpace:"nowrap",
                  transition:"all 0.15s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.25)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(99,102,241,0.12)")}
                >{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding:"0.75rem",
            borderTop:"1px solid rgba(255,255,255,0.06)",
            display:"flex", gap:"0.5rem",
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask me anything..."
              disabled={loading}
              style={{
                flex:1, padding:"0.5rem 0.875rem",
                borderRadius:99,
                background:"rgba(255,255,255,0.05)",
                border:"1px solid rgba(255,255,255,0.1)",
                color:"var(--text,#e2e8f0)",
                fontSize:".82rem", outline:"none",
                transition:"border-color 0.15s",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              style={{
                width:38, height:38, borderRadius:"50%", flexShrink:0,
                background: input.trim() ? "linear-gradient(135deg,#6366f1,#7c3aed)" : "rgba(255,255,255,0.05)",
                border:"none", cursor: input.trim() ? "pointer" : "default",
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all 0.15s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}