"use client";
import { useState, useCallback } from "react";
import { useApiStore } from "@/lib/hooks";
import { skills as initialData, type Skill } from "@/lib/data";
import { Modal, Field, RangeInput, AdminPageHeader, ConfirmDialog, useToast, Toast } from "@/components/AdminUI";

const CATS = ["Frontend","Backend","Infrastructure","Other"] as const;
const EMPTY: Skill = { id:"", name:"", level:80, category:"Frontend" };

export default function AdminSkills() {
  const [items, _saveItems, _loading] = useApiStore<Skill[]>("skills", initialData);
  const [localItems, setLocalItemsState] = useState<Skill[] | null>(null);
  const activeItems = localItems !== null ? localItems : items;
  const setItems = useCallback((val: Skill[] | ((prev: Skill[]) => Skill[])) => {
    const next = typeof val === "function" ? val(activeItems) : val;
    setLocalItemsState(next);
    _saveItems(next);
  }, [activeItems, _saveItems]);
  const [form, setForm] = useState<Skill>(EMPTY);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [deleteId, setDeleteId] = useState<string|null>(null);
  const [activeCat, setActiveCat] = useState<string>("All");
  const { toast, show } = useToast();

  const filtered = activeCat==="All" ? activeItems : activeItems.filter(s=>s.category===activeCat);
  const openNew = () => { setForm({...EMPTY, id:Date.now().toString()}); setEditId(null); setModalOpen(true); };
  const openEdit = (s: Skill) => { setForm({...s}); setEditId(s.id); setModalOpen(true); };
  const save = () => {
    if (!form.name.trim()) return;
    if (editId) { setItems(activeItems.map((i: typeof form)=>i.id===editId?form:i)); show("Skill updated!"); }
    else { setItems([...activeItems,form]); show("Skill added!"); }
    setModalOpen(false);
  };

  return (
    <div style={{ padding:"2.5rem", maxWidth:900 }}>
      <AdminPageHeader title="Skills" desc="Manage your skill set and proficiency levels."
        action={<button className="btn btn-primary btn-sm" onClick={openNew}>+ Add Skill</button>} />

      {/* Category filter tabs */}
      <div style={{ display:"flex", gap:".4rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
        {["All",...CATS].map(c=>(
          <button key={c} onClick={()=>setActiveCat(c)}
            className={`badge ${activeCat===c?"badge-indigo":"badge-gray"}`}
            style={{ border:"none", padding:".35rem .9rem", fontSize:".78rem", fontWeight:500 }}>
            {c} {c==="All"?`(${activeItems.length})`:(`(${activeItems.filter(s=>s.category===c).length})`)}
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"1rem" }}>
        {filtered.map(s=>(
          <div key={s.id} className="card-flat" style={{ padding:"1.25rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:".875rem" }}>
              <div>
                <p style={{ fontWeight:600, fontSize:".95rem", marginBottom:".2rem" }}>{s.name}</p>
                <span className="badge badge-gray" style={{ fontSize:".68rem" }}>{s.category}</span>
              </div>
              <div style={{ display:"flex", gap:".35rem" }}>
                <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>openEdit(s)}>✎</button>
                <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>setDeleteId(s.id)} style={{color:"var(--rose)"}}>✕</button>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:".75rem" }}>
              <div className="skill-track" style={{ flex:1 }}>
                <div className="skill-fill go" style={{ transform:`scaleX(${s.level/100})` }} />
              </div>
              <span style={{ fontFamily:"'Fira Code',monospace", fontSize:".75rem", color:"var(--cyan)", minWidth:32, textAlign:"right" }}>{s.level}%</span>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} title={editId?"Edit Skill":"Add Skill"} onClose={()=>setModalOpen(false)} width={480}>
        <Field label="Skill Name"><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. React / Next.js" /></Field>
        <Field label="Category">
          <select className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value as Skill["category"]})} style={{appearance:"auto"}}>
            {CATS.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label={`Proficiency Level — ${form.level}%`}>
          <RangeInput value={form.level} onChange={v=>setForm({...form,level:v})} />
        </Field>
        <div style={{ display:"flex", gap:".75rem", justifyContent:"flex-end", marginTop:"1.25rem", paddingTop:"1.25rem", borderTop:"1px solid var(--border2)" }}>
          <button className="btn btn-outline btn-sm" onClick={()=>setModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={save}>Save Skill</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} message="This skill will be removed." onConfirm={()=>{setItems(activeItems.filter(i=>i.id!==deleteId));setDeleteId(null);show("Skill deleted.","error")}} onCancel={()=>setDeleteId(null)} />
      <Toast toast={toast} />
    </div>
  );
}
