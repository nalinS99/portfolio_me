import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

function createFallbackResponse(message: string) {
  const prompt = message.toLowerCase();

  if (prompt.includes("skill") || prompt.includes("stack") || prompt.includes("tech")) {
    return "Nalin works with React.js, Next.js, JavaScript, TypeScript, Tailwind CSS, MUI, Bootstrap, Node.js, Express.js, MongoDB, MySQL, and SEO tools such as Lighthouse and PageSpeed Insights.";
  }

  if (prompt.includes("project")) {
    return "Nalin has worked on Agro Pulse, a School Administration System, a Library Management System, and a Business Website project. You can explore more details on the portfolio site.";
  }

  if (prompt.includes("experience") || prompt.includes("work") || prompt.includes("atdigital")) {
    return "Nalin worked as a Trainee Frontend Developer at ATDigital, where he handled client websites, SEO, Stripe checkout, and performance optimization for multiple projects.";
  }

  if (prompt.includes("available") || prompt.includes("hire") || prompt.includes("join") || prompt.includes("hiring")) {
    return "Yes — Nalin is available for Associate Frontend or Full-Stack Developer roles. You can use the contact form or email rmnsbandara99@gmail.com to reach out.";
  }

  if (prompt.includes("contact") || prompt.includes("email") || prompt.includes("linkedin") || prompt.includes("github")) {
    return "You can contact Nalin via email at rmnsbandara99@gmail.com, or through the contact form on the site. His GitHub is https://github.com/nalinS99 and LinkedIn is https://linkedin.com/in/nalin-s-bandara.";
  }

  if (prompt.includes("education") || prompt.includes("degree") || prompt.includes("university")) {
    return "Nalin is currently pursuing a BSc Hons in Computing & Information Systems at Sabaragamuwa University of Sri Lanka with a GPA of 3.34.";
  }

  return "I'm not sure about that — you can reach Nalin directly at rmnsbandara99@gmail.com.";
}

export async function POST(req: NextRequest) {
  let requestMessages: Array<{ role: string; content: string }> = [];

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

  try {
    const { messages } = await req.json();
    requestMessages = Array.isArray(messages) ? messages : [];
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_KEY) {
      return NextResponse.json(
        { error: "API Key is missing in environment variables." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_KEY);

    const preferredModel = process.env.GEMINI_MODEL?.trim();
    const modelCandidates = preferredModel
      ? [preferredModel, "gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash"]
      : ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash"];

    const uniqueCandidates = [...new Set(modelCandidates.filter(Boolean))];
    let lastError: unknown;

    for (const modelName of uniqueCandidates) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_PROMPT,
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7,
          },
        });

        // Format chat history and ensure system messages are filtered
        let rawHistory = requestMessages
          .slice(0, -1)
          .filter((m: { role: string }) => m.role !== "system")
          .map((m: { role: string; content: string }) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          }));

        // Ensure history starts with a 'user' message to prevent SDK validation errors
        while (rawHistory.length > 0 && rawHistory[0].role !== "user") {
          rawHistory.shift();
        }

        const lastUserMessage = requestMessages[requestMessages.length - 1]?.content || "";

        const chat = model.startChat({ history: rawHistory });
        const result = await chat.sendMessage(lastUserMessage);
        const responseText = result.response.text();

        return NextResponse.json({ message: responseText });
      } catch (error) {
        lastError = error;
        console.warn(`Gemini model attempt failed: ${modelName}`, error);
      }
    }

    throw lastError || new Error("No Gemini model could serve the request.");
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);

    const status = error?.status || error?.statusCode || 503;
    const isRateLimit = status === 429 || /quota|rate limit|exceeded your current quota/i.test(error?.message || "");
    const isNotFound = status === 404 || /not found|not supported for generateContent/i.test(error?.message || "");
    const fallbackMessage = createFallbackResponse(
      requestMessages[requestMessages.length - 1]?.content || ""
    );

    return NextResponse.json(
      {
        message: fallbackMessage,
        serviceStatus: isRateLimit ? "rate-limited" : isNotFound ? "model-unavailable" : "unavailable",
      },
      { status: 200 }
    );
  }
}