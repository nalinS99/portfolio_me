"use client";
import Link from "next/link";
import { usePortfolioData, publishedPosts } from "@/lib/clientStore";

export default function BlogPage() {
  const portfolioData = usePortfolioData();
  const posts = publishedPosts(portfolioData);
  const categories = ["All", ...Array.from(new Set(posts.map(p=>p.category)))];

  return (
    <div style={{ position:"relative", zIndex:10 }}>
      <section style={{ padding:"9rem 1.5rem 4rem", maxWidth:1100, margin:"0 auto" }}>
        <p className="label fade-up d1" style={{marginBottom:".75rem"}}>Writing</p>
        <h1 className="fade-up d2" style={{ fontSize:"clamp(2.5rem,6vw,4rem)", fontWeight:800, lineHeight:1.05, marginBottom:"1rem" }}>Blog</h1>
        <p className="fade-up d3" style={{ fontSize:"1rem", color:"var(--text2)", maxWidth:480, lineHeight:1.75, marginBottom:"3rem" }}>
          Thoughts on software engineering, TypeScript, React, systems design, and the craft of building things.
        </p>

        {/* Category filters (visual only) */}
        <div className="fade-up d4" style={{ display:"flex", gap:".5rem", flexWrap:"wrap", marginBottom:"3rem" }}>
          {categories.map((c,i)=>(
            <span key={c} className={`badge ${i===0?"badge-indigo":"badge-gray"}`} style={{padding:".35rem .9rem",fontSize:".78rem"}}>{c}</span>
          ))}
        </div>

        <div style={{ display:"flex", flexDirection:"column" }}>
          {posts.map((post)=>(
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-list-row">
              <article style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:"1.5rem", padding:"1.75rem 0", borderTop:"1px solid var(--border2)", alignItems:"center", transition:"padding-left .2s" }}>
                <div>
                  <div style={{ display:"flex", gap:".6rem", alignItems:"center", marginBottom:".5rem", flexWrap:"wrap" }}>
                    <span className="badge badge-indigo">{post.category}</span>
                    {post.tags.slice(0,2).map(t=><span key={t} className="badge badge-gray">{t}</span>)}
                    <span style={{ fontSize:".75rem", color:"var(--text3)", fontFamily:"'Fira Code',monospace" }}>{post.readTime} read</span>
                  </div>
                  <h2 style={{ fontSize:"1.1rem", fontWeight:600, color:"var(--text)", marginBottom:".35rem", lineHeight:1.4 }}>{post.title}</h2>
                  <p style={{ fontSize:".875rem", color:"var(--text3)", lineHeight:1.6 }}>{post.excerpt}</p>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontFamily:"'Fira Code',monospace", fontSize:".72rem", color:"var(--text3)" }}>{post.date}</div>
                  <div className="list-arrow" style={{ color:"var(--cyan)", marginTop:".5rem", fontSize:"1.1rem", opacity:0, transition:"opacity .2s" }}>→</div>
                </div>
              </article>
            </Link>
          ))}
          <div style={{ borderTop:"1px solid var(--border2)" }} />
        </div>
      </section>
      <style>{`.blog-list-row article{transition:transform .2s ease}.blog-list-row article:hover{transform:translateX(6px)}.blog-list-row:hover .list-arrow{opacity:1!important}`}</style>
    </div>
  );
}
