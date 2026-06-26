"use client";
import { useApiStore } from "@/lib/hooks";
import { aboutInfo as initialData, type AboutInfo } from "@/lib/data";
import { Toggle, AdminPageHeader, useToast, Toast } from "@/components/AdminUI";

export default function AdminAbout() {
  const [info, _saveInfo, _loading] = useApiStore<AboutInfo>("about", initialData);
  const [localInfo, setLocalInfoState] = useState<AboutInfo | null>(null);
  const activeInfo = localInfo !== null ? localInfo : info;
  const setInfo = useCallback((val: AboutInfo | ((prev: AboutInfo) => AboutInfo)) => {
    const next = typeof val === "function" ? val(activeInfo) : val;
    setLocalInfoState(next);
    _saveInfo(next);
  }, [activeInfo, _saveInfo]);
  const { toast, show } = useToast();
  const set = <K extends keyof AboutInfo>(k: K) => (v: AboutInfo[K]) => setInfo((i: AboutInfo)=>({...i,[k]:v}));

  const save = () => { _saveInfo(activeInfo).then(() => show("About info saved!")); };

  const updateBio = (idx: number, val: string) => {
    const b = [...activeInfo.bio]; b[idx]=val; setInfo({...activeInfo,bio:b});
  };
  const addBio = () => setInfo({...activeInfo, bio:[...activeInfo.bio,""]});
  const removeBio = (idx: number) => setInfo({...activeInfo, bio:activeInfo.bio.filter((_,i)=>i!==idx)});

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
            <p style={{ fontSize:".82rem", color:"var(--text3)" }}>Shows the green &quot;Available&quot; badge on your site</p>
          </div>
          <Toggle checked={activeInfo.available} onChange={set("available")} />
        </div>
      </div>

      {/* Bio */}
      <div className="card-flat" style={{ padding:"1.5rem", marginBottom:"1.5rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
          <p style={{ fontFamily:"'Fira Code',monospace", fontSize:".7rem", textTransform:"uppercase", letterSpacing:".1em", color:"var(--indigo)" }}>Bio Paragraphs</p>
          <button className="btn btn-outline btn-sm" onClick={addBio}>+ Add paragraph</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:".75rem" }}>
          {activeInfo.bio.map((para,i)=>(
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
          <span style={{ width:8,height:8,borderRadius:"50%",background:activeInfo.available?"var(--green)":"var(--rose)",display:"inline-block",boxShadow:activeInfo.available?"0 0 8px var(--green)":"none" }} />
          <span style={{ fontFamily:"'Fira Code',monospace", fontSize:".8rem", color:activeInfo.available?"var(--green)":"var(--rose)" }}>
            {activeInfo.available ? "Available for work" : "Not available"}
          </span>
        </div>
        {activeInfo.bio.map((p,i)=>(
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
