"use client";
import { useState, useRef } from "react";
import { useLocalStorage } from "@/lib/hooks";
import { projects as initialData, type Project } from "@/lib/data";
import { Modal, Field, TagInput, Toggle, ConfirmDialog, AdminPageHeader, useToast, Toast } from "@/components/AdminUI";

const EMPTY: Project = { id:"", title:"", description:"", tech:[], status:"production", url:"", github:"", image:"", accentColor:"#6366f1", featured:false };
const STATUS_OPTS = ["production","beta","open-source","wip"] as const;
const STATUS_BADGE: Record<string,string> = { production:"badge-green", beta:"badge-amber", "open-source":"badge-cyan", wip:"badge-gray" };
const ACCENT_PRESETS = ["#6366f1","#22d3ee","#10b981","#f59e0b","#f43f5e","#8b5cf6","#ec4899","#14b8a6"];

function ProjectThumb({ image, title, accent }: { image?:string; title:string; accent?:string }) {
  const color = accent || "#6366f1";
  const initials = title.split(" ").map((w:string)=>w[0]).join("").slice(0,2).toUpperCase() || "?";
  if (image) return <img src={image} alt={title} style={{ width:48,height:36,objectFit:"cover",borderRadius:6,border:"1px solid var(--border2)" }} />;
  return (
    <div style={{ width:48,height:36,borderRadius:6,background:`${color}18`,border:`1px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Oxanium', sans-serif",fontWeight:800,fontSize:".7rem",color,flexShrink:0 }}>
      {initials}
    </div>
  );
}

function ImagePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [tab, setTab]       = useState<"upload"|"url">(value.startsWith("data:") ? "upload" : "url");
  const [drag, setDrag]     = useState(false);
  const [loading, setLoad]  = useState(false);
  const inputRef            = useRef<HTMLInputElement>(null);

  const loadFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5 MB."); return; }
    setLoad(true);
    const reader = new FileReader();
    reader.onload = e => { onChange(e.target?.result as string); setLoad(false); };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginBottom:"1rem" }}>
      <label className="input-label">Project Image</label>

      {/* Tab switch */}
      <div style={{ display:"flex", marginBottom:".75rem", background:"var(--surface2)", borderRadius:8, padding:3, width:"fit-content", border:"1px solid var(--border2)" }}>
        {(["upload","url"] as const).map(t => (
          <button key={t} onClick={()=>setTab(t)} style={{
            padding:".3rem .9rem", borderRadius:6, fontSize:".78rem", fontWeight:600,
            background: tab===t ? "var(--surface)" : "transparent",
            color: tab===t ? "var(--text)" : "var(--text3)",
            border: tab===t ? "1px solid var(--border2)" : "1px solid transparent",
            cursor:"pointer", transition:"all .15s",
          }}>
            {t === "upload" ? "📁 Upload" : "🔗 URL"}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", gap:"1rem", alignItems:"flex-start" }}>
        {/* Preview */}
        <div style={{ width:120,height:80,borderRadius:8,overflow:"hidden",border:"1px solid var(--border2)",flexShrink:0,background:"var(--surface2)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
          {value ? (
            <>
              <img src={value} alt="preview" style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>(e.currentTarget.style.display="none")} />
              <button onClick={()=>onChange("")} title="Remove" style={{ position:"absolute",top:3,right:3,width:18,height:18,borderRadius:"50%",background:"rgba(0,0,0,0.65)",border:"none",color:"#fff",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
            </>
          ) : (
            <span style={{ fontSize:".65rem",color:"var(--text3)",textAlign:"center",padding:".5rem",lineHeight:1.4 }}>No image</span>
          )}
        </div>

        {/* Upload */}
        {tab === "upload" && (
          <div
            onDragOver={e=>{ e.preventDefault(); setDrag(true); }}
            onDragLeave={()=>setDrag(false)}
            onDrop={e=>{ e.preventDefault(); setDrag(false); const f=e.dataTransfer.files[0]; if(f) loadFile(f); }}
            onClick={()=>inputRef.current?.click()}
            style={{ flex:1,border:`2px dashed ${drag?"var(--indigo)":"var(--border2)"}`,borderRadius:8,padding:"1rem",textAlign:"center",background:drag?"rgba(99,102,241,0.05)":"var(--surface2)",cursor:"pointer",transition:"all .2s",minHeight:80,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:".3rem" }}>
            <span style={{ fontSize:"1.2rem" }}>{loading ? "⏳" : "🖼️"}</span>
            <span style={{ fontSize:".78rem",color:"var(--text2)",fontWeight:500 }}>{loading ? "Processing…" : "Drop image or click to browse"}</span>
            <span style={{ fontSize:".7rem",color:"var(--text3)" }}>PNG · JPG · WebP · max 5 MB</span>
            <input ref={inputRef} type="file" accept="image/*" style={{ display:"none" }}
              onChange={e=>{ const f=e.target.files?.[0]; if(f) loadFile(f); e.target.value=""; }} />
          </div>
        )}

        {/* URL */}
        {tab === "url" && (
          <div style={{ flex:1,display:"flex",flexDirection:"column",gap:".4rem" }}>
            <input className="input" value={value.startsWith("data:") ? "" : value}
              onChange={e=>onChange(e.target.value)}
              placeholder="https://your-image-url.com/screenshot.png" />
            <p style={{ fontSize:".72rem",color:"var(--text3)",lineHeight:1.5 }}>Paste a direct image URL. Ideal: 1200×675px (16:9).</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminProjects() {
  const [items, setItems] = useLocalStorage<Project[]>("admin_projects", initialData);
  const [form, setForm]   = useState<Project>(EMPTY);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId]       = useState<string|null>(null);
  const [deleteId, setDeleteId]   = useState<string|null>(null);
  const { toast, show }           = useToast();

  const openNew  = () => { setForm({...EMPTY, id:Date.now().toString()}); setEditId(null); setModalOpen(true); };
  const openEdit = (p: Project) => { setForm({...p}); setEditId(p.id); setModalOpen(true); };
  const save = () => {
    if (!form.title.trim()) return;
    if (editId) { setItems(items.map(i=>i.id===editId?form:i)); show("Project updated!"); }
    else        { setItems([...items,form]); show("Project added!"); }
    setModalOpen(false);
  };

  return (
    <div style={{ padding:"2.5rem", maxWidth:960 }}>
      <AdminPageHeader title="Projects" desc="Manage your portfolio projects and images."
        action={<button className="btn btn-primary btn-sm" onClick={openNew}>+ Add Project</button>} />

      <div className="card-flat" style={{ overflow:"hidden" }}>
        <table className="table">
          <thead>
            <tr>
              <th style={{width:60}}>Image</th>
              <th>Title</th>
              <th>Tech</th>
              <th>Status</th>
              <th>Featured</th>
              <th style={{width:90}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(p=>(
              <tr key={p.id}>
                <td><ProjectThumb image={p.image} title={p.title} accent={p.accentColor} /></td>
                <td style={{ color:"var(--text)",fontWeight:500 }}>{p.title}</td>
                <td>
                  <div style={{ display:"flex",gap:".3rem",flexWrap:"wrap" }}>
                    {p.tech.slice(0,3).map(t=><span key={t} className="badge badge-gray">{t}</span>)}
                    {p.tech.length>3&&<span className="badge badge-gray">+{p.tech.length-3}</span>}
                  </div>
                </td>
                <td><span className={`badge ${STATUS_BADGE[p.status]}`}>{p.status}</span></td>
                <td><Toggle checked={p.featured} onChange={v=>setItems(items.map(i=>i.id===p.id?{...i,featured:v}:i))} /></td>
                <td>
                  <div style={{ display:"flex",gap:".4rem" }}>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>openEdit(p)}>✎</button>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>setDeleteId(p.id)} style={{color:"var(--rose)"}}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} title={editId?"Edit Project":"Add Project"} onClose={()=>setModalOpen(false)} width={620}>
        <Field label="Title"><input className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Project name" /></Field>
        <Field label="Description"><textarea className="input" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="What does it do?" /></Field>

        <ImagePicker value={form.image||""} onChange={v=>setForm({...form,image:v})} />

        <div style={{ marginBottom:"1rem" }}>
          <label className="input-label">Accent Color <span style={{fontWeight:400,color:"var(--text3)"}}>(used for placeholder)</span></label>
          <div style={{ display:"flex",gap:".5rem",flexWrap:"wrap",alignItems:"center" }}>
            {ACCENT_PRESETS.map(c=>(
              <button key={c} onClick={()=>setForm({...form,accentColor:c})}
                style={{ width:28,height:28,borderRadius:6,background:c,border:form.accentColor===c?"2px solid white":"2px solid transparent",cursor:"pointer",transition:"border .15s" }} />
            ))}
            <input type="color" value={form.accentColor||"#6366f1"} onChange={e=>setForm({...form,accentColor:e.target.value})}
              style={{ width:28,height:28,padding:0,border:"1px solid var(--border2)",borderRadius:6,background:"none" }} />
          </div>
        </div>

        <Field label="Tech Stack" hint="Press Enter or comma to add">
          <TagInput value={form.tech} onChange={v=>setForm({...form,tech:v})} placeholder="React, Node.js..." />
        </Field>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem" }}>
          <Field label="Status">
            <select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value as Project["status"]})} style={{appearance:"auto"}}>
              {STATUS_OPTS.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Featured">
            <div style={{paddingTop:".5rem"}}><Toggle checked={form.featured} onChange={v=>setForm({...form,featured:v})} label="Show on homepage" /></div>
          </Field>
        </div>
        <Field label="Live URL"><input className="input" value={form.url||""} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://..." /></Field>
        <Field label="GitHub URL"><input className="input" value={form.github||""} onChange={e=>setForm({...form,github:e.target.value})} placeholder="https://github.com/..." /></Field>
        <div style={{ display:"flex",gap:".75rem",justifyContent:"flex-end",marginTop:"1.25rem",paddingTop:"1.25rem",borderTop:"1px solid var(--border2)" }}>
          <button className="btn btn-outline btn-sm" onClick={()=>setModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={save}>Save Project</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} message="This project will be permanently removed from your portfolio." onConfirm={()=>{setItems(items.filter(i=>i.id!==deleteId));setDeleteId(null);show("Deleted.","error")}} onCancel={()=>setDeleteId(null)} />
      <Toast toast={toast} />
    </div>
  );
}
