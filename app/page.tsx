"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePortfolioData, publishedPosts, featuredProjects } from "@/lib/clientStore";
import DeviceMockup from "@/components/DeviceMockup";

/* ── Typewriter ─────────────────────────────────────── */
function Typewriter({ words }: { words: string[] }) {
  const [text, setText] = useState("");
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  const [pause, setPause] = useState(false);
  useEffect(() => {
    if (pause) { const t = setTimeout(() => setPause(false), 1600); return () => clearTimeout(t); }
    const w = words[wi];
    if (!del) {
      if (ci < w.length) { const t = setTimeout(() => { setText(w.slice(0,ci+1)); setCi(c=>c+1); },55); return ()=>clearTimeout(t); }
      const t = setTimeout(() => { setPause(true); setDel(true); }, 0); return () => clearTimeout(t);
    } else {
      if (ci > 0) { const t = setTimeout(() => { setText(w.slice(0,ci-1)); setCi(c=>c-1); },28); return ()=>clearTimeout(t); }
      const t = setTimeout(() => { setDel(false); setWi(i=>(i+1)%words.length); }, 0); return () => clearTimeout(t);
    }
  },[ci,del,wi,words,pause]);
  return (
    <span style={{ display:"inline-block", minWidth:"14ch" }}>
      <span className="aurora-text">{text}<span className="blink" style={{color:"var(--cyan)"}}>|</span></span>
    </span>
  );
}

/* ── Reveal wrapper — scroll-triggered entrance ─────── */
type RevealDir = "up" | "down" | "left" | "right" | "scale";
function Reveal({
  children, delay = 0, style = {}, direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  direction?: RevealDir;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const initial: React.CSSProperties = {
    up:    { transform: "translateY(40px)", opacity: 0 },
    down:  { transform: "translateY(-40px)", opacity: 0 },
    left:  { transform: "translateX(-40px)", opacity: 0 },
    right: { transform: "translateX(40px)", opacity: 0 },
    scale: { transform: "scale(0.92)", opacity: 0 },
  }[direction];

  return (
    <div
      ref={ref}
      style={{
        ...initial,
        ...(visible ? { transform: "none", opacity: 1 } : {}),
        transition: `transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms, opacity 0.65s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Section title with animated underline ──────────── */
function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <Reveal>
      <p className="label" style={{ marginBottom: ".6rem" }}>{label}</p>
      <h2 style={{
        fontSize: "clamp(1.8rem,3.5vw,2.75rem)", fontWeight: 800,
        marginBottom: "3rem", position: "relative", display: "inline-block",
      }}>
        {title}
        <span style={{
          position: "absolute", bottom: -6, left: 0,
          width: "100%", height: 2,
          borderRadius: 2,
        }} className="flow-underline" />
      </h2>
    </Reveal>
  );
}

/* ── Skill bar ──────────────────────────────────────── */
function SkillBar({ name, level }: { name: string; level: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGo(true); }, { threshold: 0.5 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:".35rem" }}>
        <span style={{ fontSize:".875rem", color:"var(--text2)", fontWeight:500 }}>{name}</span>
        <span style={{ fontFamily:"'Fira Code',monospace", fontSize:".72rem", color:"var(--text3)" }}>{level}%</span>
      </div>
      <div className="skill-track">
        <div className={`skill-fill${go?" go":""}`} style={{ transform:go?`scaleX(${level/100})`:"scaleX(0)" }} />
      </div>
    </div>
  );
}

/* ── Project image ──────────────────────────────────── */
function ProjectImage({ image, title, accent }: { image?:string; title:string; accent?:string }) {
  const color = accent || "var(--indigo)";
  if (image) {
    return (
      <div className="project-img">
        <img src={image} alt={title} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .4s ease"}} />
      </div>
    );
  }
  const initials = title.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return (
    <div className="project-img">
      <div className="project-img-placeholder" style={{ background:`linear-gradient(135deg, ${color}12 0%, ${color}06 100%)` }}>
        <svg width="100%" height="100%" style={{position:"absolute",inset:0}} viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[40,80,120,160,200,240,280,320,360].map(x=><line key={`v${x}`} x1={x} y1="0" x2={x} y2="225" stroke={color} strokeOpacity="0.06"/>)}
          {[45,90,135,180].map(y=><line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke={color} strokeOpacity="0.06"/>)}
          <path d="M16 36 L16 16 L36 16" stroke={color} strokeOpacity="0.3" strokeWidth="1.5"/>
          <path d="M364 16 L384 16 L384 36" stroke={color} strokeOpacity="0.3" strokeWidth="1.5"/>
          <path d="M16 189 L16 209 L36 209" stroke={color} strokeOpacity="0.3" strokeWidth="1.5"/>
          <path d="M384 189 L384 209 L364 209" stroke={color} strokeOpacity="0.3" strokeWidth="1.5"/>
          <ellipse cx="200" cy="112" rx="70" ry="50" fill={color} fillOpacity="0.06"/>
          <text x="200" y="124" textAnchor="middle" dominantBaseline="middle"
            fontFamily="Oxanium, sans-serif" fontWeight="700" fontSize="38" fill={color} fillOpacity="0.25"
            letterSpacing="-2">{initials}</text>
          {[[60,45],[340,45],[200,180]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="2.5" fill={color} fillOpacity="0.3"/>)}
        </svg>
      </div>
    </div>
  );
}

/* ── Tilt card ──────────────────────────────────────── */
function TiltCard({ children, style={} }: { children:React.ReactNode; style?:React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX-r.left)/r.width-.5)*8;
    const y = ((e.clientY-r.top)/r.height-.5)*-8;
    el.style.transform = `perspective(700px) rotateX(${y}deg) rotateY(${x}deg)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} className="card tilt"
      style={{ transition:"transform .1s ease,border-color .25s,box-shadow .25s,background .3s", ...style }}
      onMouseMove={move} onMouseLeave={leave}>
      {children}
    </div>
  );
}

const STATUS_BADGE: Record<string,string> = { production:"badge-green", beta:"badge-amber", "open-source":"badge-cyan", wip:"badge-gray" };
const SKILL_CATS = ["Frontend","Backend","Infrastructure"] as const;

/* ── Animated stat counter ──────────────────────────── */
function StatCounter({ num, suffix, label, color }: { num:number; suffix:string; label:string; color:string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    const duration = 1400;
    const step = 16;
    const total = Math.ceil(duration / step);
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / total;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * num));
      if (frame >= total) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [started, num]);
  return (
    <div ref={ref} style={{ paddingRight:"3rem", marginBottom:"1rem" }}>
      <div style={{ fontFamily:"'Oxanium', sans-serif", fontSize:"2.1rem", fontWeight:800, lineHeight:1, marginBottom:".25rem", background:`linear-gradient(135deg, ${color}, var(--text))`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize:".78rem", color:"var(--text3)", letterSpacing:"0.01em" }}>{label}</div>
    </div>
  );
}

/* ── Contact form ───────────────────────────────────── */
function ContactForm() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState("");
  const [errors, setErrors] = useState<Record<string,string>>({});
  const maxMsg = 500;

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.length < 20) e.message = "At least 20 characters";
    return e;
  };

  const bdr = (k: string) => errors[k] ? "rgba(239,68,68,0.6)" : focus === k ? "var(--indigo)" : "var(--border2)";

  const handleSend = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
  };

  if (sent) return (
    <div className="card" style={{ padding:"2.5rem", textAlign:"center" }}>
      <div style={{ width:56,height:56,borderRadius:14,background:"rgba(16,185,129,.12)",border:"1px solid rgba(16,185,129,.25)",margin:"0 auto 1.25rem",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem" }}>✓</div>
      <h3 style={{ fontSize:"1.1rem",fontWeight:700,marginBottom:".5rem",color:"var(--text)" }}>Message sent!</h3>
      <p style={{ fontSize:".875rem",color:"var(--text3)",marginBottom:"1.5rem",lineHeight:1.7 }}>Thanks {form.name.split(" ")[0]}! I&apos;ll get back to you within 24 hours.</p>
      <button className="btn btn-outline btn-sm" onClick={()=>{setSent(false);setForm({name:"",email:"",subject:"",message:""});setErrors({})}}>Send another</button>
    </div>
  );

  return (
    <div className="card" style={{ padding:"1.75rem" }}>
      <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem" }}>
          {([{k:"name",l:"Name",p:"Your name",t:"text"},{k:"email",l:"Email",p:"you@example.com",t:"email"}] as const).map(({k,l,p,t})=>(
            <div key={k}>
              <label className="input-label" style={{ display:"flex",justifyContent:"space-between" }}>
                {l}
                {errors[k] && <span style={{ fontSize:".65rem",color:"rgba(239,68,68,0.9)",fontWeight:400 }}>{errors[k]}</span>}
              </label>
              <input className="input" type={t} placeholder={p} value={form[k as keyof typeof form]}
                onChange={e=>{setForm({...form,[k]:e.target.value});if(errors[k])setErrors({...errors,[k]:""});}}
                onFocus={()=>setFocus(k)} onBlur={()=>setFocus("")}
                style={{borderColor:bdr(k),transition:"border-color .2s"}} />
            </div>
          ))}
        </div>
        <div>
          <label className="input-label">Subject <span style={{color:"var(--text3)",fontWeight:400,fontSize:".7rem"}}>(optional)</span></label>
          <input className="input" placeholder="Project inquiry" value={form.subject}
            onChange={e=>setForm({...form,subject:e.target.value})}
            onFocus={()=>setFocus("subj")} onBlur={()=>setFocus("")}
            style={{borderColor:bdr("subj"),transition:"border-color .2s"}} />
        </div>
        <div>
          <label className="input-label" style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <span style={{display:"flex",alignItems:"center",gap:".4rem"}}>
              Message
              {errors.message && <span style={{ fontSize:".65rem",color:"rgba(239,68,68,0.9)",fontWeight:400 }}>{errors.message}</span>}
            </span>
            <span style={{ fontSize:".65rem",color:form.message.length > maxMsg*0.9 ? "rgba(239,68,68,0.8)" : "var(--text3)",fontFamily:"'Fira Code',monospace" }}>
              {form.message.length}/{maxMsg}
            </span>
          </label>
          <textarea className="input" placeholder="Tell me about your project — what you're building, timeline, and how I can help..." rows={5} value={form.message}
            maxLength={maxMsg}
            onChange={e=>{setForm({...form,message:e.target.value});if(errors.message)setErrors({...errors,message:""});}}
            onFocus={()=>setFocus("msg")} onBlur={()=>setFocus("")}
            style={{borderColor:bdr("msg"),transition:"border-color .2s",resize:"vertical"}} />
        </div>
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            width:"100%", justifyContent:"center",
            padding:"0.75rem 1.5rem", borderRadius:999,
            background: loading ? "var(--surface2)" : "linear-gradient(135deg, var(--indigo), #7c3aed)",
            color: loading ? "var(--text3)" : "white",
            border:"none", fontWeight:600, fontSize:".9rem",
            cursor: loading ? "not-allowed" : "pointer",
            display:"flex",alignItems:"center",gap:".6rem",
            boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.35)",
            transition:"all .25s",
          }}>
          {loading ? (
            <>
              <span style={{ width:14,height:14,borderRadius:"50%",border:"2px solid var(--border2)",borderTopColor:"var(--indigo)",animation:"spin .7s linear infinite",display:"inline-block" }} />
              Sending…
            </>
          ) : "Send message →"}
        </button>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────── */
export default function Home() {
  const portfolioData = usePortfolioData();
  const { projects, skills, experience, about: aboutInfo } = portfolioData;
  const posts = publishedPosts(portfolioData).slice(0, 3);
  const featured = projects.filter(p=>p.featured);

  return (
    <div style={{ position:"relative", zIndex:10 }}>

      {/* ════ HERO ════ */}
      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", padding:"0", position:"relative", overflow:"hidden" }}>
        <div className="blob-hero" />
        <div className="container" style={{ paddingTop:"7rem", paddingBottom:"4rem", position:"relative", zIndex:2, width:"100%" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3rem", alignItems:"center" }} className="hero-grid">

            {/* ── Left: text ── */}
            <div>
              <div className="fade-up d1" style={{ marginBottom:"1.25rem" }}>
                <span className="badge badge-green" style={{ gap:".5rem" }}>
                  <span style={{ width:6,height:6,borderRadius:"50%",background:"var(--green)",display:"inline-block" }}/>
                  Open to new projects
                </span>
              </div>

              <h1 className="2" style={{ fontWeight:800, lineHeight:1.1, marginBottom:"1.25rem" }}>
                <span style={{ display:"block", fontSize:"clamp(1.6rem,3.2vw,2.6rem)", color:"var(--text2)", fontWeight:700, marginBottom:"0.3rem" }}>
                  Hi, I&apos;m Nalin —
                </span>
                <span style={{ display:"flex", alignItems:"baseline", gap:"0.35em", whiteSpace:"nowrap", fontSize:"clamp(2rem,4.2vw,3.5rem)" }}>
                  <span style={{ color:"var(--text3)", fontWeight:800 }}>I</span>
                  <Typewriter words={["build web apps.", "code full-stack.", "solve puzzles..", "love TypeScript."]} />
                </span>
              </h1>

              <p className="fade-up d3" style={{ fontSize:"1rem", color:"var(--text2)", maxWidth:440, lineHeight:1.8, marginBottom:"2.25rem" }}>
                Software Engineer specializing in fast, scalable full-stack web development and complex data problem solving.
              </p>

              <div className="fade-up d4" style={{ display:"flex", gap:".75rem", flexWrap:"wrap", marginBottom:"2.75rem" }}>
                <Link href="/#projects" className="btn btn-primary">View my work</Link>
                <Link href="/#contact" className="btn btn-outline">Get in touch</Link>
              </div>

              <div className="fade-up d5" style={{ display:"flex", gap:"0", paddingTop:"2rem", borderTop:"1px solid var(--border2)", flexWrap:"wrap" }}>
                {[
                  { num:2,  suffix:"+",  label:"Years experience",     color:"var(--indigo)" },
                  { num:6, suffix:"+",  label:"Projects completed",     color:"var(--cyan)" },
                  { num:8, suffix:"+", label:"Tech stack tools",         color:"var(--violet)" },
                  { num:99, suffix:"%",  label:"Coffee-to-code ratio", color:"var(--green)" },
                ].map((s,i)=>(
                  <Reveal key={s.label} delay={i*100} direction="up">
                    <StatCounter num={s.num} suffix={s.suffix} label={s.label} color={s.color} />
                  </Reveal>
                ))}
              </div>
            </div>

            {/* ── Right: devices ── */}
            <div className="fade-up d3 hero-devices">
              <DeviceMockup />
            </div>

          </div>
        </div>
      </section>

      {/* ════ WAVE DIVIDER ════ */}
      <div className="wave-divider" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="var(--bg2)" opacity="0.7"/>
          <path d="M0,55 C360,20 720,70 1080,30 C1260,15 1380,50 1440,55 L1440,80 L0,80 Z" fill="var(--bg2)" opacity="0.4"/>
        </svg>
      </div>

      {/* ════ PROJECTS ════ */}
      <section id="projects" style={{ padding:"6rem 0", background:"var(--bg2)", borderTop:"1px solid var(--border2)" }}>
        <div className="container">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"3rem", flexWrap:"wrap", gap:"1rem" }}>
            <SectionTitle label="Selected Work" title="Projects" />
            <Reveal direction="right">
              <Link href="/about" className="btn btn-ghost" style={{ fontSize:".875rem" }}>View all →</Link>
            </Reveal>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"1.25rem" }} className="grid-2">
            {featured.map((p,i)=>(
              <Reveal key={p.id} delay={i*100} direction={i % 2 === 0 ? "left" : "right"}>
                <TiltCard style={{ padding:"1.5rem", height:"100%", display:"flex", flexDirection:"column" }}>
                  <ProjectImage image={p.image} title={p.title} accent={p.accentColor} />
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:".625rem" }}>
                    <h3 style={{ fontSize:"1.05rem", fontWeight:700, color:"var(--text)", lineHeight:1.3 }}>{p.title}</h3>
                    <span className={`badge ${STATUS_BADGE[p.status]}`} style={{ flexShrink:0, marginLeft:".75rem" }}>{p.status}</span>
                  </div>
                  <p style={{ fontSize:".875rem", color:"var(--text2)", lineHeight:1.7, marginBottom:"1rem", flex:1 }}>{p.description}</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:".35rem", marginBottom:"1rem" }}>
                    {p.tech.map(t=><span key={t} className="badge badge-gray">{t}</span>)}
                  </div>
                  <div style={{ display:"flex", gap:"1rem", paddingTop:".875rem", borderTop:"1px solid var(--border2)" }}>
                    {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:".8rem", color:"var(--indigo)", fontWeight:500 }}>Live ↗</a>}
                    {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ fontSize:".8rem", color:"var(--text3)" }}>GitHub ↗</a>}
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ WAVE DIVIDER ════ */}
      <div className="wave-divider" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C360,70 720,10 1080,50 C1260,65 1380,20 1440,30 L1440,80 L0,80 Z" fill="var(--bg)" opacity="0.8"/>
          <path d="M0,50 C180,20 540,75 900,35 C1080,18 1320,60 1440,50 L1440,80 L0,80 Z" fill="var(--bg)" opacity="0.5"/>
        </svg>
      </div>

      {/* ════ SKILLS ════ */}
      <section id="skills" style={{ padding:"6rem 0" }}>
        <div className="container">
          <SectionTitle label="Expertise" title="Skills & Tools" />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"2.5rem 3rem" }} className="grid-3">
            {SKILL_CATS.map((cat,ci)=>(
              <Reveal key={cat} delay={ci*120} direction="up">
                <p style={{ fontFamily:"'Fira Code',monospace", fontSize:".7rem", textTransform:"uppercase", letterSpacing:".12em", color:"var(--indigo)", marginBottom:"1.5rem", fontWeight:500 }}>{cat}</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>
                  {skills.filter(s=>s.category===cat).map(s=><SkillBar key={s.id} name={s.name} level={s.level}/>)}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal style={{ marginTop:"3rem", paddingTop:"2.5rem", borderTop:"1px solid var(--border2)" }} direction="up" delay={200}>
            <p style={{ fontFamily:"'Fira Code',monospace", fontSize:".75rem", color:"var(--text3)", marginBottom:"1rem" }}>{"// also familiar with"}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:".5rem" }}>
              {["Prisma","tRPC","Zod","Playwright","Jest","Tailwind CSS","Nginx","Cloudflare","Stripe","Socket.io","Elasticsearch","MongoDB"].map((t,i)=>(
                <Reveal key={t} delay={i * 40} direction="scale">
                  <span className="badge badge-gray">{t}</span>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════ WAVE DIVIDER ════ */}
      <div className="wave-divider" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,45 C200,10 480,65 720,35 C960,5 1200,60 1440,45 L1440,80 L0,80 Z" fill="var(--bg2)" opacity="0.75"/>
          <path d="M0,60 C300,30 600,75 900,40 C1100,20 1300,55 1440,60 L1440,80 L0,80 Z" fill="var(--bg2)" opacity="0.4"/>
        </svg>
      </div>

      {/* ════ EXPERIENCE ════ */}
      <section id="experience" style={{ padding:"6rem 0", background:"var(--bg2)", borderTop:"1px solid var(--border2)" }}>
        <div className="container">
          <SectionTitle label="History" title="Experience" />
          <div style={{ position:"relative", paddingLeft:"1rem" }}>
            {/* Vertical timeline line */}
            <div style={{ position:"absolute", left:8, top:8, bottom:8, width:1, background:"linear-gradient(to bottom, var(--indigo), var(--cyan), transparent)", opacity:0.25 }} className="hide-sm" />
            <div style={{ display:"flex", flexDirection:"column" }}>
              {experience.map((exp,i)=>(
                <Reveal key={exp.id} delay={i*80} direction="left">
                  <div className="grid-exp" style={{ display:"grid", gridTemplateColumns:"160px 1fr", gap:"2rem", padding:"2rem 0", borderTop:"1px solid var(--border2)", alignItems:"start", position:"relative" }}>
                    {/* Timeline dot */}
                    <div style={{ position:"absolute", left:-12, top:"2.5rem", width:10, height:10, borderRadius:"50%", background:"var(--indigo)", boxShadow:"0 0 12px rgba(99,102,241,0.5)", border:"2px solid var(--bg2)", zIndex:2 }} className="hide-sm" />
                    <div>
                      <div style={{ fontFamily:"'Fira Code',monospace", fontSize:".75rem", color:"var(--text3)", lineHeight:1.6 }}>{exp.startYear} — {exp.endYear}</div>
                      <div style={{ fontSize:".85rem", color:"var(--text3)", marginTop:".25rem", fontWeight:500 }}>{exp.company}</div>
                      <div style={{ fontSize:".75rem", color:"var(--text3)", marginTop:".1rem", opacity:.7 }}>{exp.location}</div>
                    </div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:".5rem" }}>
                        <div style={{ fontWeight:700, fontSize:"1rem", color:"var(--text)" }}>{exp.role}</div>
                        {exp.endYear === "Present" && (
                          <span style={{ fontSize:".65rem", padding:".2rem .55rem", borderRadius:999, background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.25)", color:"var(--green)", fontWeight:600 }}>Current</span>
                        )}
                      </div>
                      <p style={{ fontSize:".875rem", color:"var(--text2)", lineHeight:1.75, marginBottom:".875rem" }}>{exp.description}</p>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:".4rem" }}>
                        {exp.tech.map(t=><span key={t} className="badge badge-gray">{t}</span>)}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
              <div style={{ borderTop:"1px solid var(--border2)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ════ WAVE DIVIDER ════ */}
      <div className="wave-divider" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,20 C300,65 600,10 900,50 C1080,70 1260,25 1440,20 L1440,80 L0,80 Z" fill="var(--bg)" opacity="0.8"/>
          <path d="M0,50 C240,80 480,20 720,55 C960,80 1200,30 1440,50 L1440,80 L0,80 Z" fill="var(--bg)" opacity="0.45"/>
        </svg>
      </div>

      {/* ════ BLOG ════ */}
      <section id="blog" style={{ padding:"6rem 0" }}>
        <div className="container">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"3rem", flexWrap:"wrap", gap:"1rem" }}>
            <SectionTitle label="Writing" title="Latest Posts" />
            <Reveal direction="right">
              <Link href="/blog" className="btn btn-ghost" style={{ fontSize:".875rem" }}>All posts →</Link>
            </Reveal>
          </div>
          <div style={{ display:"flex", flexDirection:"column" }}>
            {posts.map((post,i)=>(
              <Reveal key={post.slug} delay={i*70} direction="up">
                <Link href={`/blog/${post.slug}`} className="blog-row" style={{ textDecoration:"none", display:"block" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:"1.5rem", padding:"1.5rem 0.75rem", borderTop:"1px solid var(--border2)", alignItems:"center", borderRadius:8, transition:"background .2s, padding-left .2s" }}>
                    <div>
                      <div style={{ display:"flex", gap:".6rem", alignItems:"center", marginBottom:".5rem", flexWrap:"wrap" }}>
                        <span className="badge badge-indigo">{post.category}</span>
                        <span style={{ fontSize:".72rem", color:"var(--text3)", fontFamily:"'Fira Code',monospace", display:"flex", alignItems:"center", gap:".3rem" }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                          {post.readTime} read
                        </span>
                      </div>
                      <h3 style={{ fontSize:"1rem", fontWeight:600, color:"var(--text)", marginBottom:".3rem", lineHeight:1.4 }}>{post.title}</h3>
                      <p style={{ fontSize:".875rem", color:"var(--text3)", lineHeight:1.6 }}>{post.excerpt}</p>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontFamily:"'Fira Code',monospace", fontSize:".72rem", color:"var(--text3)", marginBottom:".4rem" }}>{post.date}</div>
                      <div className="row-arrow" style={{ width:32,height:32,borderRadius:"50%",background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--indigo)",fontSize:".9rem",marginLeft:"auto",opacity:0,transition:"opacity .2s,transform .2s" }}>→</div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
            <div style={{ borderTop:"1px solid var(--border2)" }} />
          </div>
        </div>
      </section>

      {/* ════ WAVE DIVIDER ════ */}
      <div className="wave-divider" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,35 C180,70 540,5 900,45 C1080,65 1300,15 1440,35 L1440,80 L0,80 Z" fill="var(--bg2)" opacity="0.8"/>
          <path d="M0,55 C360,20 720,70 1080,30 C1260,12 1380,52 1440,55 L1440,80 L0,80 Z" fill="var(--bg2)" opacity="0.4"/>
        </svg>
      </div>

      {/* ════ CONTACT ════ */}
      <section id="contact" style={{ padding:"6rem 0", background:"var(--bg2)", borderTop:"1px solid var(--border2)" }}>
        <div className="container">
          <SectionTitle label="Contact" title="Let's work together" />
          <Reveal direction="up">
            <p style={{ fontSize:"1rem", color:"var(--text2)", maxWidth:480, lineHeight:1.8, marginBottom:"3rem" }}>
              Open to freelance projects, full-time roles, and interesting collaborations. Based in Colombo — working globally.
            </p>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2.5rem", alignItems:"start" }} className="grid-2">
            <Reveal direction="left"><ContactForm /></Reveal>
            <Reveal delay={100} direction="right">
              <div style={{ display:"flex", flexDirection:"column", gap:".75rem" }}>
                {[
                  { label:"Email",    val:aboutInfo.email,        href:`mailto:${aboutInfo.email}`,  abbr:"@" },
                  { label:"GitHub",   val:"github.com/nalin",     href:aboutInfo.github,             abbr:"GH" },
                  { label:"LinkedIn", val:"linkedin.com/in/nalin", href:aboutInfo.linkedin,          abbr:"LI" },
                  { label:"Location", val:aboutInfo.location,     href:"#",                          abbr:"📍" },
                ].map(c=>(
                  <a key={c.label} href={c.href} target={c.href.startsWith("http")?"_blank":undefined} rel="noopener noreferrer"
                    className="card-flat contact-link"
                    style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"1rem 1.25rem", transition:"border-color .2s, background .2s" }}>
                    <div style={{ width:38,height:38,borderRadius:8,background:"var(--surface2)",border:"1px solid var(--border2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Fira Code',monospace",fontSize:".7rem",color:"var(--indigo)",fontWeight:700,flexShrink:0 }}>
                      {c.abbr}
                    </div>
                    <div>
                      <div style={{ fontSize:".7rem",color:"var(--text3)",textTransform:"uppercase",letterSpacing:".08em",fontWeight:600,marginBottom:".1rem" }}>{c.label}</div>
                      <div style={{ fontSize:".875rem",color:"var(--text2)" }}>{c.val}</div>
                    </div>
                    <div style={{ marginLeft:"auto", fontSize:".85rem", color:"var(--text3)", opacity:.5 }}>↗</div>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <style>{`
        .blog-row div:hover { background: var(--surface2) !important; padding-left: 1rem !important; }
        .blog-row:hover .row-arrow { opacity: 1 !important; transform: translateX(2px) !important; }
        .contact-link:hover { border-color: var(--border) !important; background: var(--surface) !important; }
        .hide-sm { display: block; }
        @media(max-width: 640px) {
          .hide-sm { display: none !important; }
          .grid-exp { grid-template-columns: 1fr !important; gap: 1rem !important; }
        }
        @media(max-width: 768px) {
          .grid-exp { grid-template-columns: 1fr !important; gap: 1rem !important; }
        }
      `}</style>
    </div>
  );
}
