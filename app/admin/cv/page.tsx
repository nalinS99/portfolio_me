"use client";
import { useState, useRef } from "react";
import { AdminPageHeader, useToast, Toast } from "@/components/AdminUI";

const STORAGE_KEY = "admin_cv_base64";
const NAME_KEY    = "admin_cv_filename";

function getStoredCv(): { data: string; name: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const name = localStorage.getItem(NAME_KEY);
    return data && name ? { data, name } : null;
  } catch { return null; }
}

export default function AdminCV() {
  const [cv, setCv]         = useState<{ data: string; name: string } | null>(getStoredCv);
  const [dragging, setDrag] = useState(false);
  const [loading, setLoad]  = useState(false);
  const inputRef            = useRef<HTMLInputElement>(null);
  const { toast, show }     = useToast();

  const loadFile = (file: File) => {
    if (file.type !== "application/pdf") { show("Please upload a PDF file.", "error"); return; }
    if (file.size > 10 * 1024 * 1024)   { show("File must be under 10 MB.", "error"); return; }
    setLoad(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      try {
        localStorage.setItem(STORAGE_KEY, base64);
        localStorage.setItem(NAME_KEY, file.name);
        setCv({ data: base64, name: file.name });
        show("CV uploaded successfully!");
      } catch {
        show("Storage full — try a smaller file.", "error");
      }
      setLoad(false);
    };
    reader.readAsDataURL(file);
  };

  const remove = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(NAME_KEY);
    setCv(null);
    show("CV removed.");
  };

  const preview = () => {
    if (!cv) return;
    const blob = b64toBlob(cv.data, "application/pdf");
    const url  = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div style={{ padding:"2.5rem", maxWidth:700 }}>
      <AdminPageHeader title="CV / Resume" desc="Upload your PDF CV. Visitors can download it from the navbar." />
      <Toast toast={toast} />

      {/* Upload zone */}
      {!cv && (
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
          onClick={() => inputRef.current?.click()}
          style={{
            border:`2px dashed ${dragging ? "var(--indigo)" : "var(--border2)"}`,
            borderRadius:12, padding:"3.5rem 2rem", textAlign:"center",
            background: dragging ? "rgba(99,102,241,0.05)" : "var(--surface2)",
            cursor:"pointer", transition:"all .2s",
          }}>
          <div style={{ fontSize:"2.5rem", marginBottom:"1rem" }}>📄</div>
          <p style={{ fontWeight:600, color:"var(--text)", marginBottom:".4rem" }}>
            {loading ? "Uploading…" : "Drop your PDF here"}
          </p>
          <p style={{ fontSize:".85rem", color:"var(--text3)" }}>or click to browse · max 10 MB</p>
          <input ref={inputRef} type="file" accept="application/pdf" style={{ display:"none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
        </div>
      )}

      {/* Uploaded state */}
      {cv && (
        <div style={{ border:"1px solid var(--border2)", borderRadius:12, overflow:"hidden" }}>
          {/* Header */}
          <div style={{ padding:"1.25rem 1.5rem", background:"var(--surface2)", borderBottom:"1px solid var(--border2)", display:"flex", alignItems:"center", gap:"1rem" }}>
            <div style={{ width:44,height:44,borderRadius:10,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",flexShrink:0 }}>
              📋
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:600, color:"var(--text)", fontSize:".95rem", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{cv.name}</div>
              <div style={{ fontSize:".75rem", color:"var(--text3)", marginTop:".15rem", fontFamily:"'Fira Code',monospace" }}>
                {Math.round(atob(cv.data).length / 1024)} KB · PDF
              </div>
            </div>
            <span style={{ fontSize:".72rem", padding:".25rem .75rem", borderRadius:999, background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.25)", color:"var(--green)", fontWeight:600 }}>
              Active
            </span>
          </div>

          {/* Actions */}
          <div style={{ padding:"1.25rem 1.5rem", display:"flex", gap:".75rem", flexWrap:"wrap" }}>
            <button className="btn btn-primary btn-sm" onClick={preview}>Preview PDF</button>
            <button className="btn btn-outline btn-sm" onClick={() => inputRef.current?.click()}>Replace</button>
            <button className="btn btn-danger btn-sm" style={{ marginLeft:"auto" }} onClick={remove}>Remove</button>
          </div>
          <input ref={inputRef} type="file" accept="application/pdf" style={{ display:"none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
        </div>
      )}

      {/* Info box */}
      <div style={{ marginTop:"1.5rem", padding:"1rem 1.25rem", borderRadius:10, background:"rgba(99,102,241,0.06)", border:"1px solid rgba(99,102,241,0.15)" }}>
        <p style={{ fontSize:".82rem", color:"var(--text2)", lineHeight:1.7 }}>
          <span style={{ color:"var(--indigo)", fontWeight:600 }}>How it works: </span>
          The PDF is stored in your browser&apos;s localStorage. When visitors click <strong>Download CV</strong> in the navbar, it downloads directly — no server needed.
          The file persists across sessions on this device.
        </p>
      </div>
    </div>
  );
}

function b64toBlob(b64: string, type: string) {
  const bytes = atob(b64);
  const arr   = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type });
}
