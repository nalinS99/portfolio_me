"use client";
import { useState, useCallback } from "react";
import { useApiStore } from "@/lib/hooks";
import { posts as initialData, type Post } from "@/lib/data";
import { Field, TagInput, Toggle, AdminPageHeader, ConfirmDialog, useToast, Toast } from "@/components/AdminUI";

const EMPTY: Post = { slug:"", title:"", excerpt:"", date:"", category:"", readTime:"", tags:[], published:false, content:"" };

export default function AdminBlog() {
  const [items, _saveItems, _loading] = useApiStore<Post[]>("posts", initialData);
  const [localItems, setLocalItemsState] = useState<Post[] | null>(null);
  const activeItems = localItems !== null ? localItems : items;
  const setItems = useCallback((val: Post[] | ((prev: Post[]) => Post[])) => {
    const next = typeof val === "function" ? val(activeItems) : val;
    setLocalItemsState(next);
    _saveItems(next);
  }, [activeItems, _saveItems]);
  const [editing, setEditing] = useState<Post|null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteSlug, setDeleteSlug] = useState<string|null>(null);
  const { toast, show } = useToast();

  const openNew = () => {
    setEditing({...EMPTY, slug:`post-${Date.now()}`, date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})});
    setIsNew(true);
  };
  const openEdit = (p: Post) => { setEditing({...p}); setIsNew(false); };
  const save = () => {
    if (!editing||!editing.title.trim()) return;
    if (isNew) { setItems([...activeItems, editing]); show("Post created!"); }
    else { setItems(activeItems.map(i=>i.slug===editing.slug?editing:i)); show("Post saved!"); }
    setEditing(null);
  };
  const set = <K extends keyof Post>(k: K) => (v: Post[K]) => setEditing(e=>e?{...e,[k]:v}:e);

  if (editing) return (
    <div style={{ padding:"2rem", maxWidth:900 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"2rem", gap:"1rem", flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
          <button className="btn btn-ghost btn-sm" onClick={()=>setEditing(null)}>← Back</button>
          <h1 style={{ fontFamily:"'Oxanium', sans-serif", fontSize:"1.25rem", fontWeight:800 }}>
            {isNew ? "New Post" : "Edit Post"}
          </h1>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:".75rem" }}>
          <Toggle checked={editing.published} onChange={set("published")} label={editing.published?"Published":"Draft"} />
          <button className="btn btn-primary btn-sm" onClick={save}>Save Post</button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:"1.5rem", alignItems:"start" }}>
        <div>
          <Field label="Title">
            <input className="input" value={editing.title} onChange={e=>set("title")(e.target.value)} placeholder="Post title..." style={{ fontSize:"1.1rem", fontWeight:600 }} />
          </Field>
          <Field label="Excerpt" hint="Short summary shown in listings">
            <textarea className="input" value={editing.excerpt} onChange={e=>set("excerpt")(e.target.value)} placeholder="A short summary of the post..." rows={3} />
          </Field>
          <Field label="Content" hint="Supports ## headings, > blockquotes, ``` code blocks, - lists">
            <textarea className="input" value={editing.content} onChange={e=>set("content")(e.target.value)} placeholder="## Introduction&#10;&#10;Write your post content here..." rows={20} style={{ fontFamily:"'Fira Code',monospace", fontSize:".82rem", lineHeight:1.7 }} />
          </Field>
        </div>

        {/* Sidebar */}
        <div style={{ display:"flex", flexDirection:"column", gap:"1rem", position:"sticky", top:"1rem" }}>
          <div className="card-flat" style={{ padding:"1.25rem" }}>
            <p style={{ fontFamily:"'Fira Code',monospace", fontSize:".68rem", textTransform:"uppercase", letterSpacing:".1em", color:"var(--indigo)", marginBottom:"1rem" }}>Post Settings</p>
            <Field label="Slug (URL)">
              <input className="input" value={editing.slug} onChange={e=>set("slug")(e.target.value)} placeholder="my-post-slug" style={{ fontFamily:"'Fira Code',monospace", fontSize:".8rem" }} />
            </Field>
            <Field label="Category">
              <input className="input" value={editing.category} onChange={e=>set("category")(e.target.value)} placeholder="TypeScript, React, Backend..." />
            </Field>
            <Field label="Date">
              <input className="input" value={editing.date} onChange={e=>set("date")(e.target.value)} placeholder="Apr 18, 2025" />
            </Field>
            <Field label="Read Time">
              <input className="input" value={editing.readTime} onChange={e=>set("readTime")(e.target.value)} placeholder="5 min" />
            </Field>
          </div>
          <div className="card-flat" style={{ padding:"1.25rem" }}>
            <p style={{ fontFamily:"'Fira Code',monospace", fontSize:".68rem", textTransform:"uppercase", letterSpacing:".1em", color:"var(--indigo)", marginBottom:"1rem" }}>Tags</p>
            <TagInput value={editing.tags} onChange={set("tags")} placeholder="Add tag..." />
          </div>
          <div className="card-flat" style={{ padding:"1.25rem" }}>
            <p style={{ fontFamily:"'Fira Code',monospace", fontSize:".68rem", textTransform:"uppercase", letterSpacing:".1em", color:"var(--indigo)", marginBottom:".75rem" }}>Visibility</p>
            <Toggle checked={editing.published} onChange={set("published")} label={editing.published ? "Published — visible on site" : "Draft — hidden from site"} />
          </div>
        </div>
      </div>
      <Toast toast={toast} />
    </div>
  );

  return (
    <div style={{ padding:"2.5rem", maxWidth:900 }}>
      <AdminPageHeader title="Blog Posts" desc="Write and manage your blog posts."
        action={<button className="btn btn-primary btn-sm" onClick={openNew}>+ New Post</button>} />

      <div className="card-flat" style={{ overflow:"hidden" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{width:90}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeItems.map(p=>(
              <tr key={p.slug}>
                <td style={{ color:"var(--text)", fontWeight:500, maxWidth:280 }}>
                  <div style={{ whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.title}</div>
                  <div style={{ fontSize:".72rem", color:"var(--text3)", fontFamily:"'Fira Code',monospace", marginTop:".15rem" }}>{p.slug}</div>
                </td>
                <td><span className="badge badge-indigo">{p.category}</span></td>
                <td style={{ fontFamily:"'Fira Code',monospace", fontSize:".78rem", color:"var(--text3)" }}>{p.date}</td>
                <td>
                  <Toggle checked={p.published} onChange={v=>setItems(activeItems.map(i=>i.slug===p.slug?{...i,published:v}:i))} label={p.published?"Live":"Draft"} />
                </td>
                <td>
                  <div style={{ display:"flex", gap:".4rem" }}>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>openEdit(p)}>✎</button>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>setDeleteSlug(p.slug)} style={{color:"var(--rose)"}}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog open={!!deleteSlug} message="This post will be permanently deleted." onConfirm={()=>{setItems(activeItems.filter(i=>i.slug!==deleteSlug));setDeleteSlug(null);show("Post deleted.","error")}} onCancel={()=>setDeleteSlug(null)} />
      <Toast toast={toast} />
    </div>
  );
}
