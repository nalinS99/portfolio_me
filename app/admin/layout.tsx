"use client";
import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// ── Auth context ─────────────────────────────────────
const AuthCtx = createContext<{ authed: boolean; logout: () => void }>({ authed: false, logout: () => {} });
const ADMIN_PASSWORD = "nalin2025"; // Change this!

// ── Icons (inline SVG) ───────────────────────────────
const Icons = {
  grid: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  layers: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  zap: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  briefcase: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  edit: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  user: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  logout: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  eye: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  lock: <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
};

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: Icons.grid },
  { href: "/admin/projects", label: "Projects", icon: Icons.layers },
  { href: "/admin/skills", label: "Skills", icon: Icons.zap },
  { href: "/admin/experience", label: "Experience", icon: Icons.briefcase },
  { href: "/admin/blog", label: "Blog Posts", icon: Icons.edit },
  { href: "/admin/about", label: "About & Info", icon: Icons.user },
];

// ── Login screen ─────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [show, setShow] = useState(false);

  const submit = () => {
    if (pw === ADMIN_PASSWORD) { onLogin(); }
    else { setErr(true); setTimeout(() => setErr(false), 1200); }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--bg)", padding:"1.5rem" }}>
      <div style={{ width:"100%", maxWidth:380 }}>
        <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
          <div style={{ width:56,height:56,borderRadius:14,background:"var(--indigo)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1.25rem",boxShadow:"0 0 30px rgba(99,102,241,0.3)" }}>
            {Icons.lock}
          </div>
          <h1 style={{ fontFamily:"'Oxanium', sans-serif", fontWeight:800, fontSize:"1.5rem", marginBottom:".4rem" }}>Admin Access</h1>
          <p style={{ fontSize:".875rem", color:"var(--text3)" }}>Enter your password to continue</p>
        </div>

        <div className="card" style={{ padding:"2rem" }}>
          <label className="input-label">Password</label>
          <div style={{ position:"relative", marginBottom:"1.25rem" }}>
            <input
              className="input"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{ borderColor: err ? "var(--rose)" : undefined, paddingRight:"3rem" }}
              autoFocus
            />
            <button onClick={() => setShow(s => !s)}
              style={{ position:"absolute",right:"0.75rem",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--text3)",padding:"0.25rem" }}>
              {Icons.eye}
            </button>
          </div>
          {err && <p style={{ fontSize:".8rem", color:"var(--rose)", marginBottom:".875rem", marginTop:"-.75rem" }}>Incorrect password</p>}
          <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center" }} onClick={submit}>
            Sign in
          </button>
        </div>

        <p style={{ textAlign:"center", fontSize:".78rem", color:"var(--text3)", marginTop:"1.5rem" }}>
          <Link href="/" style={{ color:"var(--text3)" }} className="footer-link">← Back to portfolio</Link>
        </p>
      </div>
      <style>{`.footer-link:hover{color:var(--text)!important}`}</style>
    </div>
  );
}

// ── Admin shell ──────────────────────────────────────
function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useContext(AuthCtx);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{ width:220, borderRight:"1px solid var(--border2)", background:"var(--bg2)", display:"flex", flexDirection:"column", position:"fixed", top:0, bottom:0, left:0, zIndex:100 }}>
        {/* Logo */}
        <div style={{ padding:"1.25rem 1rem 1rem", borderBottom:"1px solid var(--border2)" }}>
          <Link href="/admin" style={{ display:"flex", alignItems:"center", gap:".6rem", marginBottom:".25rem" }}>
            <div style={{ width:28,height:28,background:"var(--indigo)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <span style={{ color:"white",fontFamily:"'Oxanium', sans-serif",fontWeight:800,fontSize:".8rem" }}>N</span>
            </div>
            <div>
              <div style={{ fontFamily:"'Oxanium', sans-serif",fontWeight:700,fontSize:".9rem",lineHeight:1 }}>Nalin<span style={{color:"var(--cyan)"}}>.</span></div>
              <div style={{ fontFamily:"'Fira Code',monospace",fontSize:".58rem",color:"var(--text3)",letterSpacing:".08em" }}>ADMIN PANEL</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ padding:".875rem .75rem", flex:1, display:"flex", flexDirection:"column", gap:".2rem" }}>
          <p style={{ fontFamily:"'Fira Code',monospace",fontSize:".62rem",textTransform:"uppercase",letterSpacing:".12em",color:"var(--text3)",padding:".25rem .5rem",marginBottom:".25rem" }}>Content</p>
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href}
              className={`sidebar-link${pathname === item.href ? " active" : ""}`}>
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding:".875rem .75rem", borderTop:"1px solid var(--border2)", display:"flex", flexDirection:"column", gap:".5rem" }}>
          <Link href="/" target="_blank"
            style={{ display:"flex",alignItems:"center",gap:".6rem",fontSize:".8rem",color:"var(--text3)",padding:".4rem .5rem",borderRadius:6,transition:"color .15s" }}
            className="sidebar-link">
            {Icons.eye} View Site
          </Link>
          <button onClick={logout}
            className="sidebar-link"
            style={{ border:"none",background:"none",width:"100%",textAlign:"left" }}>
            {Icons.logout} Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft:220, flex:1, minWidth:0 }}>
        {children}
      </div>
    </div>
  );
}

// ── Root layout export ───────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_auth");
    if (stored === "1") setAuthed(true);
    setChecked(true);
  }, []);

  const login = () => { sessionStorage.setItem("admin_auth","1"); setAuthed(true); };
  const logout = () => { sessionStorage.removeItem("admin_auth"); setAuthed(false); };

  if (!checked) return null;
  if (!authed) return <LoginScreen onLogin={login} />;

  return (
    <AuthCtx.Provider value={{ authed, logout }}>
      <AdminShell>{children}</AdminShell>
    </AuthCtx.Provider>
  );
}
