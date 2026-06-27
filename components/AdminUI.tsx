"use client";
import React, { useState } from "react";

/* ── Toast ──────────────────────────────────────────── */
export function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: "success"|"error" } | null>(null);
  const show = (msg: string, type: "success"|"error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, show };
}

export function Toast({ toast }: { toast: { msg: string; type: string } | null }) {
  if (!toast) return null;
  return (
    <div className="toast" style={{
      position:"fixed", bottom:"1.5rem", right:"1.5rem", zIndex:9999,
      display:"flex", alignItems:"center", gap:".75rem",
      background: toast.type==="success" ? "rgba(16,185,129,.12)" : "rgba(244,63,94,.12)",
      border: `1px solid ${toast.type==="success" ? "rgba(16,185,129,.25)" : "rgba(244,63,94,.25)"}`,
      borderRadius:10, padding:".875rem 1.25rem",
      backdropFilter:"blur(12px)",
    }}>
      <span style={{ fontSize:"1rem" }}>{toast.type==="success" ? "✓" : "✕"}</span>
      <span style={{ fontSize:".875rem", color: toast.type==="success" ? "var(--green)" : "var(--rose)" }}>{toast.msg}</span>
    </div>
  );
}

/* ── Page header ────────────────────────────────────── */
export function AdminPageHeader({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"2rem", gap:"1rem", flexWrap:"wrap" }}>
      <div>
        <h1 style={{ fontFamily:"'Oxanium', sans-serif", fontSize:"1.5rem", fontWeight:800, marginBottom:".3rem" }}>{title}</h1>
        {desc && <p style={{ fontSize:".875rem", color:"var(--text3)" }}>{desc}</p>}
      </div>
      {action}
    </div>
  );
}

/* ── Confirm dialog ─────────────────────────────────── */
export function ConfirmDialog({ open, message, onConfirm, onCancel }: {
  open: boolean; message: string;
  onConfirm: () => void; onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
      <div className="card" style={{ padding:"2rem", maxWidth:360, width:"100%" }}>
        <h3 style={{ fontFamily:"'Oxanium', sans-serif", fontWeight:700, marginBottom:".5rem" }}>Are you sure?</h3>
        <p style={{ fontSize:".875rem", color:"var(--text3)", marginBottom:"1.5rem", lineHeight:1.6 }}>{message}</p>
        <div style={{ display:"flex", gap:".75rem", justifyContent:"flex-end" }}>
          <button className="btn btn-outline btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger btn-sm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── Modal ──────────────────────────────────────────── */
export function Modal({ open, title, onClose, children, width=560 }: {
  open: boolean; title: string; onClose: () => void;
  children: React.ReactNode; width?: number;
}) {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:900, display:"flex", alignItems:"center", justifyContent:"center", padding:"1.5rem" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="card" style={{ width:"100%", maxWidth:width, maxHeight:"90vh", overflow:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1.25rem 1.5rem", borderBottom:"1px solid var(--border2)" }}>
          <h2 style={{ fontFamily:"'Oxanium', sans-serif", fontWeight:700, fontSize:"1rem" }}>{title}</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"var(--text3)", fontSize:"1.2rem", padding:".2rem .4rem", borderRadius:4 }}>✕</button>
        </div>
        <div style={{ padding:"1.5rem" }}>{children}</div>
      </div>
    </div>
  );
}

/* ── Form field ─────────────────────────────────────── */
export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:"1rem" }}>
      <label className="input-label">{label}</label>
      {children}
      {hint && <p style={{ fontSize:".75rem", color:"var(--text3)", marginTop:".35rem" }}>{hint}</p>}
    </div>
  );
}

/* ── Tag input ──────────────────────────────────────── */
export function TagInput({ value, onChange, placeholder="Add tag..." }: {
  value: string[]; onChange: (v: string[]) => void; placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim();
    if (t && !value.includes(t)) { onChange([...value, t]); }
    setInput("");
  };
  const remove = (t: string) => onChange(value.filter(x => x !== t));

  return (
    <div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:".4rem", marginBottom:".5rem" }}>
        {value.map(t => (
          <span key={t} className="badge badge-indigo" style={{ display:"flex", alignItems:"center", gap:".35rem" }}>
            {t}
            <button onClick={() => remove(t)} style={{ background:"none", border:"none", color:"inherit", fontSize:".9rem", lineHeight:1, padding:0 }}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display:"flex", gap:".5rem" }}>
        <input className="input" placeholder={placeholder} value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key==="Enter"||e.key===",") { e.preventDefault(); add(); } }}
          style={{ flex:1 }} />
        <button className="btn btn-outline btn-sm" onClick={add}>Add</button>
      </div>
    </div>
  );
}

/* ── Range input ────────────────────────────────────── */
export function RangeInput({ value, onChange, min=0, max=100 }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
      <input type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ flex:1, accentColor:"var(--indigo)" }} />
      <span style={{ fontFamily:"'Fira Code',monospace", fontSize:".875rem", color:"var(--cyan)", minWidth:36, textAlign:"right" }}>{value}%</span>
    </div>
  );
}

/* ── Toggle ─────────────────────────────────────────── */
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:".75rem" }}>
      <button onClick={() => onChange(!checked)} style={{
        width:44, height:24, borderRadius:12, border:"none",
        background: checked ? "var(--indigo)" : "var(--surface2)",
        position:"relative", transition:"background .2s", flexShrink:0,
        boxShadow: checked ? "0 0 12px rgba(99,102,241,0.4)" : "none",
      }}>
        <span style={{
          position:"absolute", top:2, left: checked ? 22 : 2,
          width:20, height:20, borderRadius:"50%",
          background:"white", transition:"left .2s",
        }} />
      </button>
      {label && <span style={{ fontSize:".875rem", color:"var(--text2)" }}>{label}</span>}
    </div>
  );
}

/* ── Rich Text Editor ───────────────────────────────── */
export function RichTextEditor({ value, onChange, placeholder = "Write something..." }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isUpdating = React.useRef(false);

  // Sync external value → editor (only when not typing)
  React.useEffect(() => {
    if (!ref.current || isUpdating.current) return;
    if (ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    ref.current?.focus();
    syncOut();
  };

  const syncOut = () => {
    isUpdating.current = true;
    onChange(ref.current?.innerHTML ?? "");
    setTimeout(() => { isUpdating.current = false; }, 50);
  };

  const tools = [
    { label: "B",    title: "Bold",          cmd: "bold",           style: { fontWeight: 800 } },
    { label: "I",    title: "Italic",        cmd: "italic",         style: { fontStyle: "italic" } },
    { label: "U",    title: "Underline",     cmd: "underline",      style: { textDecoration: "underline" } },
    { label: "• —",  title: "Bullet list",   cmd: "insertUnorderedList", style: {} },
    { label: "1. —", title: "Numbered list", cmd: "insertOrderedList",   style: {} },
    { label: "H2",   title: "Heading",       cmd: "formatBlock",    val: "h2", style: { fontWeight: 700, fontSize: ".8rem" } },
    { label: "¶",    title: "Paragraph",     cmd: "formatBlock",    val: "p",  style: {} },
    { label: "—",    title: "Clear format",  cmd: "removeFormat",   style: { opacity: .6 } },
  ] as const;

  return (
    <div style={{ border: "1px solid var(--border2)", borderRadius: 8, overflow: "hidden", background: "var(--surface)" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: ".25rem", padding: ".4rem .6rem", borderBottom: "1px solid var(--border2)", background: "var(--bg2)", flexWrap: "wrap" }}>
        {tools.map(t => (
          <button
            key={t.title}
            title={t.title}
            onMouseDown={e => { e.preventDefault(); exec(t.cmd, "val" in t ? t.val : undefined); }}
            style={{
              padding: ".25rem .5rem",
              border: "1px solid var(--border2)",
              borderRadius: 4,
              background: "var(--surface2)",
              color: "var(--text2)",
              fontSize: ".72rem",
              cursor: "pointer",
              fontFamily: "'Fira Code', monospace",
              ...t.style,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Editor area */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={syncOut}
        data-placeholder={placeholder}
        style={{
          minHeight: 120,
          padding: ".75rem 1rem",
          outline: "none",
          fontSize: ".875rem",
          lineHeight: 1.75,
          color: "var(--text)",
        }}
      />
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: var(--text3);
          pointer-events: none;
        }
        [contenteditable] ul { padding-left: 1.25rem; list-style: disc; }
        [contenteditable] ol { padding-left: 1.25rem; list-style: decimal; }
        [contenteditable] h2 { font-size: 1rem; font-weight: 700; margin: .4rem 0; }
        [contenteditable] p  { margin: .2rem 0; }
        [contenteditable] b, [contenteditable] strong { font-weight: 700; color: var(--text); }
      `}</style>
    </div>
  );
}