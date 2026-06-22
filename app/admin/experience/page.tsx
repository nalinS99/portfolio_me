"use client";
import { useState } from "react";
import { experience as initialData, type Experience } from "@/lib/data";
import { Modal, Field, TagInput, AdminPageHeader, ConfirmDialog, useToast, Toast } from "@/components/AdminUI";

const EMPTY: Experience = { id:"", role:"", company:"", location:"", startYear:"", endYear:"Present", description:"", tech:[] };

export default function AdminExperience() {
  const [items, setItems] = useState<Experience[]>(initialData);
  const [form, setForm] = useState<Experience>(EMPTY);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [deleteId, setDeleteId] = useState<string|null>(null);
  const { toast, show } = useToast();

  const openNew = () => { setForm({...EMPTY,id:Date.now().toString()}); setEditId(null); setModalOpen(true); };
  const openEdit = (e: Experience) => { setForm({...e}); setEditId(e.id); setModalOpen(true); };
  const save = () => {
    if (!form.role.trim()||!form.company.trim()) return;
    if (editId) { setItems(items.map(i=>i.id===editId?form:i)); show("Experience updated!"); }
    else { setItems([form,...items]); show("Experience added!"); }
    setModalOpen(false);
  };
  const set = (k: keyof Experience) => (v: any) => setForm(f=>({...f,[k]:v}));

  return (
    <div style={{ padding:"2.5rem", maxWidth:900 }}>
      <AdminPageHeader title="Experience" desc="Manage your work history and education."
        action={<button className="btn btn-primary btn-sm" onClick={openNew}>+ Add Entry</button>} />

      <div style={{ display:"flex", flexDirection:"column", gap:"1px", background:"var(--border2)", borderRadius:12, overflow:"hidden" }}>
        {items.map((exp,i)=>(
          <div key={exp.id} style={{ background:"var(--surface)", padding:"1.5rem", display:"grid", gridTemplateColumns:"160px 1fr auto", gap:"1.5rem", alignItems:"start" }}>
            <div>
              <div style={{ fontFamily:"'Fira Code',monospace", fontSize:".72rem", color:"var(--text3)" }}>{exp.startYear} — {exp.endYear}</div>
              <div style={{ fontSize:".8rem", color:"var(--text3)", marginTop:".2rem" }}>{exp.company}</div>
              <div style={{ fontSize:".72rem", color:"var(--text3)", opacity:.7, marginTop:".1rem" }}>{exp.location}</div>
            </div>
            <div>
              <p style={{ fontWeight:600, fontSize:".95rem", marginBottom:".35rem" }}>{exp.role}</p>
              <p style={{ fontSize:".85rem", color:"var(--text2)", lineHeight:1.7, marginBottom:".75rem" }}>{exp.description}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:".35rem" }}>
                {exp.tech.map(t=><span key={t} className="badge badge-gray">{t}</span>)}
              </div>
            </div>
            <div style={{ display:"flex", gap:".4rem", flexShrink:0 }}>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>openEdit(exp)}>✎</button>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>setDeleteId(exp.id)} style={{color:"var(--rose)"}}>✕</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} title={editId?"Edit Experience":"Add Experience"} onClose={()=>setModalOpen(false)}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
          <Field label="Role"><input className="input" value={form.role} onChange={e=>set("role")(e.target.value)} placeholder="Software Engineer" /></Field>
          <Field label="Company"><input className="input" value={form.company} onChange={e=>set("company")(e.target.value)} placeholder="Company Inc." /></Field>
          <Field label="Start Year"><input className="input" value={form.startYear} onChange={e=>set("startYear")(e.target.value)} placeholder="2021" /></Field>
          <Field label="End Year"><input className="input" value={form.endYear} onChange={e=>set("endYear")(e.target.value)} placeholder="Present or 2023" /></Field>
        </div>
        <Field label="Location"><input className="input" value={form.location} onChange={e=>set("location")(e.target.value)} placeholder="Colombo, LK" /></Field>
        <Field label="Description"><textarea className="input" value={form.description} onChange={e=>set("description")(e.target.value)} placeholder="What did you do? Key achievements..." /></Field>
        <Field label="Tech Stack" hint="Press Enter to add"><TagInput value={form.tech} onChange={set("tech")} /></Field>
        <div style={{ display:"flex", gap:".75rem", justifyContent:"flex-end", marginTop:"1rem", paddingTop:"1rem", borderTop:"1px solid var(--border2)" }}>
          <button className="btn btn-outline btn-sm" onClick={()=>setModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={save}>Save</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} message="This experience entry will be permanently removed." onConfirm={()=>{setItems(items.filter(i=>i.id!==deleteId));setDeleteId(null);show("Entry deleted.","error")}} onCancel={()=>setDeleteId(null)} />
      <Toast toast={toast} />
    </div>
  );
}
