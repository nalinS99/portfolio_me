"use client";
import Link from "next/link";
import { usePortfolioData } from "@/lib/clientStore";


export default function AdminOverview() {
  const { projects, skills, experience, posts, about: aboutInfo } = usePortfolioData();
  const SECTIONS = [
  { label:"Projects", count: projects.length, active: projects.filter(p=>p.status==="production").length, href:"/admin/projects", color:"var(--cyan)", desc:"Featured & all projects" },
  { label:"Skills", count: skills.length, active: skills.filter(s=>s.level>=80).length, href:"/admin/skills", color:"var(--indigo)", desc:"Skills & proficiency levels" },
  { label:"Experience", count: experience.length, active: 1, href:"/admin/experience", color:"var(--violet)", desc:"Work history & roles" },
  { label:"Blog Posts", count: posts.length, active: posts.filter(p=>p.published).length, href:"/admin/blog", color:"var(--green)", desc:"Published & draft posts" },
];
  return (
    <div style={{ padding:"2.5rem", maxWidth:1000 }}>
      {/* Header */}
      <div style={{ marginBottom:"2.5rem" }}>
        <h1 style={{ fontFamily:"'Oxanium', sans-serif", fontSize:"1.75rem", fontWeight:800, marginBottom:".4rem" }}>Dashboard</h1>
        <p style={{ color:"var(--text3)", fontSize:".9rem" }}>Manage your portfolio content. Changes here update your live site.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem", marginBottom:"2.5rem" }}>
        {SECTIONS.map(s => (
          <Link key={s.label} href={s.href}>
            <div className="card" style={{ padding:"1.25rem", transition:"all .2s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:".875rem" }}>
                <span style={{ fontSize:".78rem", fontWeight:600, color:"var(--text3)", textTransform:"uppercase", letterSpacing:".06em" }}>{s.label}</span>
                <span style={{ fontFamily:"'Fira Code',monospace", fontSize:"1.5rem", fontWeight:700, color:s.color, lineHeight:1 }}>{s.count}</span>
              </div>
              <div style={{ height:2, background:"var(--border2)", borderRadius:99, overflow:"hidden", marginBottom:".75rem" }}>
                <div style={{ height:"100%", width:`${(s.active/s.count)*100}%`, background:s.color, borderRadius:99, transition:"width 1s ease" }} />
              </div>
              <p style={{ fontSize:".78rem", color:"var(--text3)" }}>{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>
        {/* Recent posts */}
        <div className="card-flat" style={{ padding:"1.5rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
            <h2 style={{ fontFamily:"'Oxanium', sans-serif", fontSize:"1rem", fontWeight:700 }}>Blog Posts</h2>
            <Link href="/admin/blog" className="btn btn-ghost btn-sm">Manage →</Link>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:".5rem" }}>
            {posts.map(p => (
              <div key={p.slug} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:".6rem .875rem", background:"var(--surface2)", borderRadius:8 }}>
                <div style={{ minWidth:0 }}>
                  <p style={{ fontSize:".85rem", fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.title}</p>
                  <p style={{ fontSize:".72rem", color:"var(--text3)", fontFamily:"'Fira Code',monospace" }}>{p.date}</p>
                </div>
                <span className={`badge ${p.published ? "badge-green" : "badge-gray"}`} style={{ flexShrink:0, marginLeft:".75rem" }}>
                  {p.published ? "Published" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="card-flat" style={{ padding:"1.5rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
            <h2 style={{ fontFamily:"'Oxanium', sans-serif", fontSize:"1rem", fontWeight:700 }}>Projects</h2>
            <Link href="/admin/projects" className="btn btn-ghost btn-sm">Manage →</Link>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:".5rem" }}>
            {projects.map(p => (
              <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:".6rem .875rem", background:"var(--surface2)", borderRadius:8 }}>
                <div style={{ minWidth:0 }}>
                  <p style={{ fontSize:".85rem", fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.title}</p>
                  <p style={{ fontSize:".72rem", color:"var(--text3)", fontFamily:"'Fira Code',monospace", marginTop:".1rem" }}>{p.tech.slice(0,3).join(" · ")}</p>
                </div>
                <span className={`badge ${p.featured ? "badge-cyan" : "badge-gray"}`} style={{ flexShrink:0, marginLeft:".75rem" }}>
                  {p.featured ? "Featured" : "Hidden"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Site status */}
      <div className="card-flat" style={{ padding:"1.25rem", marginTop:"1.5rem", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"1.5rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
            <span style={{ width:7,height:7,borderRadius:"50%",background:"var(--green)",boxShadow:"0 0 6px var(--green)",display:"inline-block" }} />
            <span style={{ fontSize:".82rem", color:"var(--text2)" }}>Site is live</span>
          </div>
          <div style={{ fontFamily:"'Fira Code',monospace", fontSize:".75rem", color:"var(--text3)" }}>
            Available: <span style={{ color: aboutInfo.available ? "var(--green)" : "var(--rose)" }}>{aboutInfo.available ? "Yes" : "No"}</span>
          </div>
          <div style={{ fontFamily:"'Fira Code',monospace", fontSize:".75rem", color:"var(--text3)" }}>
            Published posts: <span style={{ color:"var(--cyan)" }}>{posts.filter(p=>p.published).length}/{posts.length}</span>
          </div>
        </div>
        <Link href="/" target="_blank" className="btn btn-outline btn-sm">View live site →</Link>
      </div>
    </div>
  );
}
