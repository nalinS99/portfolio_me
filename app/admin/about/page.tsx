"use client";
import { useState } from "react";
import { aboutInfo as initialData, type AboutInfo } from "@/lib/data";
import { Toggle, AdminPageHeader, useToast, Toast } from "@/components/AdminUI";

export default function AdminAbout() {
  const [info, setInfo] = useState<AboutInfo>(initialData);
  const [saved, setSaved] = useState(false);
  const { toast, show } = useToast();
  const set = (k: keyof AboutInfo) => (v: any) => setInfo(i=>({...i,[k]:v}));

  const save = () => { show("About info saved!"); setSaved(true); setTimeout(()=>setSaved(false), 3000); };

  const updateBio = (idx: number, val: string) => {
    const b = [...info.bio]; b[idx]=val; setInfo({...info,bio:b});
  };
  const addBio = () => setInfo({...info, bio:[...info.bio,""]});
  const removeBio = (idx: number) => setInfo({...info, bio:info.bio.filter((_,i)=>i!==idx)});

  return (
    <div style={{ padding:"2.5rem", maxWidth:700 }}>
      <AdminPageHeader title="About & Info" desc="Update your bio, contact info, and availability."
        action={<button className="btn btn-primary btn-sm" onClick={save}>Save Changes</button>} />

      {/* Status */}
      <div className="card-flat" style={{ padding:"1.5rem", marginBottom:"1.5rem" }}>
        <p style={{ fontFamily:"'Fira Code',monospace", fontSize:".7rem", textTransform:"uppercase", letterSpacing:".1em", color:"var(--indigo)", marginBottom:"1.25rem" }}>Status</p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <p style={{ fontWeight:600, fontSize:".95rem", marginBottom:".25rem" }}>Available for work</p>
            <p style={{ fontSize:".82rem", color:"var(--text3)" }}>Shows the green "Available" badge on your site</p>
          </div>
          <Toggle checked={info.available} onChange={set("available")} />
        </div>
      </div>

      {/* Bio */}
      <div className="card-flat" style={{ padding:"1.5rem", marginBottom:"1.5rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
          <p style={{ fontFamily:"'Fira Code',monospace", fontSize:".7rem", textTransform:"uppercase", letterSpacing:".1em", color:"var(--indigo)" }}>Bio Paragraphs</p>
          <button className="btn btn-outline btn-sm" onClick={addBio}>+ Add paragraph</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:".75rem" }}>
          {info.bio.map((para,i)=>(
            <div key={i} style={{ display:"flex", gap:".6rem", alignItems:"flex-start" }}>
              <span style={{ fontFamily:"'Fira Code',monospace", fontSize:".7rem", color:"var(--text3)", paddingTop:".75rem", minWidth:20 }}>0{i+1}</span>
              <textarea className="input" value={para} onChange={e=>updateBio(i,e.target.value)} rows={3} style={{ flex:1 }} />
              <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>removeBio(i)} style={{color:"var(--rose)",marginTop:".35rem"}}>✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="card-flat" style={{ padding:"1.5rem", marginBottom:"1.5rem" }}>
        <p style={{ fontFamily:"'Fira Code',monospace", fontSize:".7rem", textTransform:"uppercase", letterSpacing:".1em", color:"var(--indigo)", marginBottom:"1.25rem" }}>Contact Info</p>
        <div style={{ display:"flex", flexDirection:"column", gap:".875rem" }}>
          {([["Email","email","nalin@example.com"],["Location","location","Colombo, Sri Lanka"],["GitHub","github","https://github.com/..."],["LinkedIn","linkedin","https://linkedin.com/in/..."],["Twitter","twitter","https://twitter.com/..."]] as [string,keyof AboutInfo,string][]).map(([label,key,ph])=>(
            <div key={key}>
              <label className="input-label">{label}</label>
              <input className="input" value={info[key] as string} onChange={e=>set(key)(e.target.value)} placeholder={ph} />
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="card-flat" style={{ padding:"1.5rem" }}>
        <p style={{ fontFamily:"'Fira Code',monospace", fontSize:".7rem", textTransform:"uppercase", letterSpacing:".1em", color:"var(--indigo)", marginBottom:"1.25rem" }}>Preview</p>
        <div style={{ display:"flex", alignItems:"center", gap:".6rem", marginBottom:".75rem" }}>
          <span style={{ width:8,height:8,borderRadius:"50%",background:info.available?"var(--green)":"var(--rose)",display:"inline-block",boxShadow:info.available?"0 0 8px var(--green)":"none" }} />
          <span style={{ fontFamily:"'Fira Code',monospace", fontSize:".8rem", color:info.available?"var(--green)":"var(--rose)" }}>
            {info.available ? "Available for work" : "Not available"}
          </span>
        </div>
        {info.bio.map((p,i)=>(
          <p key={i} style={{ fontSize:".875rem", color:"var(--text2)", lineHeight:1.75, marginBottom:".75rem" }}>{p}</p>
        ))}
      </div>

      <div style={{ marginTop:"1.5rem", display:"flex", justifyContent:"flex-end" }}>
        <button className="btn btn-primary" onClick={save}>Save Changes</button>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
