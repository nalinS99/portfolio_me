import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Simple in-memory rate limiting (resets on cold start)
const ipRequests = new Map<string, { count: number; resetAt: number }>();
const LIMIT_PER_IP = 20; // per day per IP
const LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

const SYSTEM_PROMPT = `You are Nalin's portfolio assistant — a friendly, concise AI on Nalin S Bandara's personal portfolio site (nalins.vercel.app).

ABOUT NALIN:
- Full name: Nalin S Bandara
- Role: Trainee Frontend Developer / Software Engineer
- Location: Colombo, Sri Lanka
- Email: rmnsbandara99@gmail.com
- GitHub: https://github.com/nalinS99
- LinkedIn: https://linkedin.com/in/nalin-s-bandara
- Education: BSc Hons in Computing & Information Systems, Sabaragamuwa University of Sri Lanka (4th year, GPA 3.34)
- Available for work: YES — seeking Associate Frontend or Full-Stack Developer roles

WORK EXPERIENCE:
- Trainee Frontend Developer @ ATDigital (Mar 2025 - Aug 2025)
  • Worked on 6+ client websites (property, insurance, legal, e-commerce)
  • Stack: Next.js, Tailwind CSS, Prismic CMS
  • Handled SEO: meta tags, structured data, robots.txt, XML sitemaps
  • Integrated Stripe for checkout, Mailgun for transactional emails
  • Performance: lazy loading, image compression, dynamic imports (Lighthouse tested)
  • Agile workflow: ClickUp, BitBucket, daily standups, weekly sprints

TECHNICAL SKILLS:
Frontend: React.js, Next.js, JavaScript, HTML, CSS, Tailwind CSS, MUI, Bootstrap, Webflow
CMS: Prismic (Slice Machine), Webflow
Backend: Node.js, Express.js
Databases: MongoDB, MySQL
Tools: Git, BitBucket, Figma, Postman, Netlify, Vercel, ClickUp
SEO: Technical SEO, On-page SEO, Google Lighthouse, PageSpeed Insights
Methodologies: Agile, Scrum

PROJECTS:
1. Agro Pulse (Group, Completed) — AI platform for farmers: pest identification from images using ML. Tech: React.js, Tailwind CSS, Flask, MongoDB, OpenCV. Role: support page design, Sinhala translation, Support Data model training.
2. School Administration System (Individual, Ongoing) — Web system for schools: teacher attendance/results, student/parent reports, principal oversight. Tech: Express.js, React.js, Node.js, MongoDB, Tailwind CSS.
3. Library Management System (Group, Ongoing) — Add/edit/delete books, download reports. Tech: Express.js, React.js, Node.js, MongoDB, Tailwind CSS.
4. Business Website (Individual, Completed) — Responsive web app with useMemo and lazy loading. Tech: React.js, Tailwind CSS.

CERTIFICATES:
- React Basics — Meta (Coursera)
- Web Design for Beginners — University of Moratuwa
- Python for Beginners — University of Moratuwa

EXTRA CURRICULAR:
- HackX 2023 Inter-University Startup Challenge participant
- PYHACK 2.0 participant (IEEE WIE, IIT)
- IEEE Member, Student Branch SUSL
- Member, Society of Computer Science, SUSL

INSTRUCTIONS:
- Answer questions about Nalin's skills, projects, experience, and availability
- Keep answers short and friendly (2-4 sentences max unless listing items)
- If asked about hiring/collaboration → encourage them to use the contact form or email rmnsbandara99@gmail.com
- If asked something you don't know about Nalin → say "I'm not sure about that — you can reach Nalin directly at rmnsbandara99@gmail.com"
- Do NOT make up information about Nalin
- Do NOT answer questions unrelated to Nalin or web development
- Respond in the same language the user writes in`;

export async function POST(req: NextRequest) {
  // Rate limiting by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const now = Date.now();
  const record = ipRequests.get(ip);

  if (record) {
    if (now < record.resetAt) {
      if (record.count >= LIMIT_PER_IP) {
        return NextResponse.json(
          { error: "Too many messages. Please try again tomorrow." },
          { status: 429 }
        );
      }
      record.count++;
    } else {
      ipRequests.set(ip, { count: 1, resetAt: now + LIMIT_WINDOW });
    }
  } else {
    ipRequests.set(ip, { count: 1, resetAt: now + LIMIT_WINDOW });
  }

  const { messages } = await req.json();
  const GEMINI_KEY = process.env.GEMINI_API_KEY!;

  // Convert messages to Gemini format
  const geminiMessages = messages.map((m: { role: string; content: string }) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: geminiMessages,
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7,
        },
      }),
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "AI unavailable" }, { status: 500 });
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't generate a response.";

  return NextResponse.json({ message: text });
}