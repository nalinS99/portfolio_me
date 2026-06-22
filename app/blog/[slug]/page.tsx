"use client";
import { use } from "react";
import { getPostBySlug } from "@/lib/store";
import { notFound } from "next/navigation";
import Link from "next/link";

function renderContent(content: string) {
  const lines = content.trim().split("\n");
  const els: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      els.push(<h2 key={i} style={{fontFamily:"'Oxanium', sans-serif",fontSize:"1.5rem",fontWeight:700,marginTop:"2.5rem",marginBottom:".875rem",color:"var(--text)"}}>{line.slice(3)}</h2>);
    } else if (line.startsWith("> ")) {
      els.push(<blockquote key={i} style={{borderLeft:"2px solid var(--indigo)",paddingLeft:"1.25rem",margin:"1.75rem 0",color:"var(--text2)",fontStyle:"italic",lineHeight:1.75}}>{line.slice(2)}</blockquote>);
    } else if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) { codeLines.push(lines[i]); i++; }
      els.push(
        <div key={i} className="code-window" style={{marginBottom:"1.5rem"}}>
          <div className="code-bar">{["#ff5f57","#febc2e","#28c840"].map(c=><div key={c} className="code-dot" style={{background:c}}/>)}</div>
          <div className="code-body"><pre style={{margin:0}}><code>{codeLines.join("\n")}</code></pre></div>
        </div>
      );
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) { items.push(lines[i].slice(2)); i++; }
      els.push(<ul key={i} style={{listStyle:"none",padding:0,marginBottom:"1.5rem"}}>{items.map((it,j)=><li key={j} style={{display:"flex",gap:".75rem",padding:".3rem 0",fontSize:".95rem",color:"var(--text2)",lineHeight:1.7}}><span style={{color:"var(--indigo)",flexShrink:0,marginTop:".25rem"}}>▸</span>{it}</li>)}</ul>);
      continue;
    } else if (line.trim()) {
      els.push(<p key={i} style={{color:"var(--text2)",lineHeight:1.85,marginBottom:"1.25rem",fontSize:"1rem"}}>{line}</p>);
    }
    i++;
  }
  return els;
}

export default function Post({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = use(params);
  const post = getPostBySlug(slug);
  if (!post || !post.published) notFound();

  return (
    <div style={{ position:"relative", zIndex:10, maxWidth:1100, margin:"0 auto", padding:"8rem 1.5rem 6rem" }}>
      <Link href="/blog" className="back-link" style={{display:"inline-flex",alignItems:"center",gap:".4rem",fontSize:".85rem",color:"var(--text3)",marginBottom:"3rem",fontFamily:"'Fira Code',monospace"}}>
        ← All posts
      </Link>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:"4rem", alignItems:"start" }}>
        <div>
          <div style={{display:"flex",gap:".6rem",alignItems:"center",marginBottom:"1.25rem",flexWrap:"wrap"}}>
            <span className="badge badge-indigo">{post.category}</span>
            {post.tags.map(t=><span key={t} className="badge badge-gray">{t}</span>)}
          </div>
          <h1 style={{fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:800,lineHeight:1.1,marginBottom:"1rem"}}>{post.title}</h1>
          <p style={{fontSize:"1.05rem",color:"var(--text2)",lineHeight:1.75,marginBottom:"2.5rem",paddingBottom:"2rem",borderBottom:"1px solid var(--border2)"}}>{post.excerpt}</p>
          <div>{renderContent(post.content)}</div>
        </div>
        <aside style={{position:"sticky",top:"6rem"}} className="hide-md">
          <div className="card-flat" style={{padding:"1.25rem",marginBottom:"1rem"}}>
            <p style={{fontFamily:"'Fira Code',monospace",fontSize:".65rem",color:"var(--indigo)",letterSpacing:".12em",marginBottom:".875rem",textTransform:"uppercase"}}>Post info</p>
            {[["Date",post.date],["Read",post.readTime],["Category",post.category]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:".45rem 0",borderBottom:"1px solid var(--border2)"}}>
                <span style={{fontSize:".78rem",color:"var(--text3)"}}>{l}</span>
                <span style={{fontSize:".78rem",color:"var(--text2)",fontFamily:"'Fira Code',monospace"}}>{v}</span>
              </div>
            ))}
          </div>
          <div className="card-flat" style={{padding:"1.25rem"}}>
            <p style={{fontFamily:"'Fira Code',monospace",fontSize:".65rem",color:"var(--indigo)",letterSpacing:".12em",marginBottom:".875rem",textTransform:"uppercase"}}>Author</p>
            <p style={{fontSize:".95rem",fontWeight:600,marginBottom:".2rem"}}>Nalin S Bandara</p>
            <p style={{fontSize:".8rem",color:"var(--text3)"}}>Software Engineer</p>
          </div>
        </aside>
      </div>
      <style>{`.back-link:hover{color:var(--text)!important}@media(max-width:768px){[style*="1fr 260px"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
