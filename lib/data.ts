export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  status: "production" | "beta" | "open-source" | "wip";
  url?: string;
  github?: string;
  image?: string;       // URL or path — optional
  imageAlt?: string;
  accentColor?: string; // custom per-project color for placeholder
  featured: boolean;
};

export type Skill = {
  id: string;
  name: string;
  level: number;
  category: "Frontend" | "Backend" | "Infrastructure" | "Other";
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  startYear: string;
  endYear: string;
  description: string;
  tech: string[];
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
  published: boolean;
  content: string;
};

export type AboutInfo = {
  bio: string[];
  available: boolean;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
};

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
export const projects: Project[] = [
  {
    id: "1",
    title: "NexaCommerce",
    description: "High-performance e-commerce platform handling 500K+ daily transactions with sub-100ms p95 response times. Built on a microservices architecture deployed on AWS.",
    tech: ["Next.js", "PostgreSQL", "Redis", "Stripe", "AWS"],
    status: "production",
    url: "https://example.com",
    github: "https://github.com",
    image: "",
    accentColor: "#6366f1",
    featured: true,
  },
  {
    id: "2",
    title: "DataVault API",
    description: "Secure multi-tenant data API with row-level security, real-time subscriptions, and a GraphQL interface. Serves 200+ enterprise clients globally.",
    tech: ["Node.js", "GraphQL", "TypeScript", "Supabase"],
    status: "production",
    url: "https://example.com",
    github: "https://github.com",
    image: "",
    accentColor: "#22d3ee",
    featured: true,
  },
  {
    id: "3",
    title: "Orion Analytics",
    description: "Real-time analytics dashboard with live WebSocket data streams, D3.js visualisations, and ML-powered anomaly detection. Processes 2M+ events per day.",
    tech: ["React", "D3.js", "WebSocket", "Python", "ClickHouse"],
    status: "beta",
    url: "https://example.com",
    image: "",
    accentColor: "#10b981",
    featured: true,
  },
  {
    id: "4",
    title: "CloudForge CLI",
    description: "Developer CLI tool for infrastructure-as-code deployment supporting AWS, GCP, and Vercel with a unified config format. 1.2K+ GitHub stars.",
    tech: ["Go", "AWS SDK", "Terraform", "Docker"],
    status: "open-source",
    github: "https://github.com",
    image: "",
    accentColor: "#f59e0b",
    featured: false,
  },
];

// ─── SKILLS ───────────────────────────────────────────────────────────────────
export const skills: Skill[] = [
  { id: "1",  name: "React / Next.js",    level: 95, category: "Frontend" },
  { id: "2",  name: "TypeScript",          level: 92, category: "Frontend" },
  { id: "3",  name: "CSS & Animation",    level: 88, category: "Frontend" },
  { id: "4",  name: "React Native",       level: 74, category: "Frontend" },
  { id: "5",  name: "Node.js",            level: 93, category: "Backend" },
  { id: "6",  name: "Go",                 level: 80, category: "Backend" },
  { id: "7",  name: "GraphQL",            level: 85, category: "Backend" },
  { id: "8",  name: "PostgreSQL",         level: 88, category: "Backend" },
  { id: "9",  name: "Docker / Kubernetes",level: 82, category: "Infrastructure" },
  { id: "10", name: "AWS",                level: 85, category: "Infrastructure" },
  { id: "11", name: "Redis",              level: 87, category: "Infrastructure" },
  { id: "12", name: "CI/CD Pipelines",    level: 80, category: "Infrastructure" },
];

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────
export const experience: Experience[] = [
  { id:"1", role:"Software Engineer",    company:"TechCorp Inc.",  location:"Remote",      startYear:"2023", endYear:"Present", description:"Leading frontend architecture for a B2B SaaS platform serving 10K+ businesses. Reduced bundle size 42%, improved LCP by 60ms. Mentoring 2 junior engineers.", tech:["Next.js","TypeScript","AWS","Tailwind CSS"] },
  { id:"2", role:"Full-Stack Developer", company:"StartupXYZ",     location:"Colombo, LK", startYear:"2021", endYear:"2023",    description:"First engineering hire. Built 3 products from 0→1. Owned the full stack from infra to UI. Helped grow the engineering team to 8 people.",               tech:["React","Node.js","PostgreSQL","Docker"] },
  { id:"3", role:"Junior Developer",     company:"Agency Co.",     location:"Colombo, LK", startYear:"2019", endYear:"2021",    description:"Delivered 20+ client web projects. Specialised in performance optimisation and accessibility improvements across e-commerce and media sites.",             tech:["React","PHP","MySQL","WordPress"] },
];

// ─── POSTS ────────────────────────────────────────────────────────────────────
export const posts: Post[] = [
  { slug:"building-scalable-apis-nodejs", title:"Building Scalable APIs with Node.js",          excerpt:"Deep-dive into patterns and practices for APIs that handle millions of requests without breaking a sweat.", date:"Apr 18, 2025", category:"Backend",     readTime:"8 min", tags:["Node.js","API","Architecture"],      published:true,  content:`## Why Scalability Matters\n\nWhen building an API that starts small, scalability feels like a future problem. But early decisions compound over time.\n\n## Connection Pooling\n\nOpening a new DB connection per request is expensive. Maintain a pool:\n\n\`\`\`javascript\nconst pool = new Pool({\n  connectionString: process.env.DATABASE_URL,\n  max: 20,\n  idleTimeoutMillis: 30000,\n});\n\`\`\`\n\n## Caching Strategies\n\nRedis is your best friend. Cache aggressively at the route level.\n\n> The fastest request is the one you never make.\n\n## Horizontal Scaling\n\nStateless services scale horizontally. Push session state to Redis, avoid in-memory caches.\n\n## Conclusion\n\nScalability is a spectrum. Start simple, measure, then optimize actual bottlenecks.` },
  { slug:"typescript-patterns",           title:"TypeScript Patterns I Wish I Knew Earlier",   excerpt:"From discriminated unions to template literal types — features that changed how I write code.",             date:"Apr 5, 2025",  category:"TypeScript",  readTime:"6 min", tags:["TypeScript","Patterns","DX"],         published:true,  content:`## Discriminated Unions\n\nModel state machines cleanly and get exhaustive type checking:\n\n\`\`\`typescript\ntype Result<T> =\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: string }\n  | { status: 'loading' };\n\`\`\`\n\n## Template Literal Types\n\n\`\`\`typescript\ntype EventName = \`on\${Capitalize<string>}\`;\n\`\`\`\n\n## Key Takeaways\n\n- Use discriminated unions for state modeling\n- Template literal types for string-shaped APIs\n- Never use any — use unknown instead` },
  { slug:"react-server-components",       title:"React Server Components in Depth",             excerpt:"RSC represents a fundamental shift in how we think about React. Let's unpack what they actually mean.",     date:"Mar 10, 2025", category:"React",       readTime:"7 min", tags:["React","Next.js","Performance"],      published:true,  content:`## The Mental Model Shift\n\nReact Server Components blur the boundary between server and client. Fetch data on the server and render HTML directly.\n\n## When to Use Server Components\n\n- Direct database access needed\n- Large dependencies that shouldn't ship to client\n- SEO and initial load time matter\n\n## The Boundary\n\nThe "use client" directive marks the boundary. Keep it as high up as possible.\n\n## Conclusion\n\nRSC isn't replacing client-side React — it's extending it.` },
  { slug:"year-one-lessons",              title:"Lessons from My First Year as an Engineer",    excerpt:"On imposter syndrome, communication, and writing code that actually lasts.",                               date:"Feb 28, 2025", category:"Career",      readTime:"9 min", tags:["Career","Growth","Lessons"],          published:false, content:`## Imposter Syndrome is Universal\n\nEvery engineer I respect has felt like a fraud at some point.\n\n> Code is written once, read many times.\n\n## Write Code for the Reader\n\nOptimize for readability. Name things clearly. Be boring on purpose.` },
];

// ─── ABOUT ────────────────────────────────────────────────────────────────────
export const aboutInfo: AboutInfo = {
  bio: [
    "I'm a software engineer based in Colombo, Sri Lanka, specialising in high-performance web applications and the systems that power them.",
    "I've spent 5+ years turning complex problems into clean, scalable software. I care as much about developer experience as I do about end-user experience.",
    "When I'm not building, I'm writing about it — sharing what I've learned, mistakes I've made, and ideas worth exploring.",
  ],
  available: true,
  location: "Colombo, Sri Lanka",
  email: "nalin@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export function getPublishedPosts() { return posts.filter(p => p.published); }
export function getPostBySlug(slug: string) { return posts.find(p => p.slug === slug); }
export function getFeaturedProjects() { return projects.filter(p => p.featured); }
