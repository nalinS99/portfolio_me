# Nalin S Bandara — Portfolio v2

A futuristic, techy personal portfolio and blog built with **Next.js**, **TypeScript**, and **Tailwind CSS**.

## Stack

- **Next.js 16** (App Router, Static Export)
- **TypeScript** — fully typed
- **Tailwind CSS** — utility classes
- **Google Fonts** — Syne + JetBrains Mono + Share Tech Mono
- **Custom CSS** — all animations, cursor, effects handcrafted

## Features

| Feature | Detail |
|---|---|
| 🔮 Custom cursor | Glowing dot + lagged ring |
| ⌨️ Typewriter hero | 4 roles, type + delete loop |
| 🌌 Particle field | 80 particles + mouse repel |
| 🃏 3D tilt cards | Perspective tilt on project cards |
| 📊 Skill bars | Scroll-triggered glowing fills |
| 👁️ Scroll reveals | Fade-up on all sections |
| 🔤 Glitch effect | CSS glitch layers on hero title |
| 📺 Scanlines | Animated CRT overlay |
| 🌐 Grid background | Cyan dot-grid atmosphere |
| 📡 Noise texture | Film grain overlay |
| 🖥️ Terminal UI | Code-window contact form |
| 📱 Mobile menu | Fullscreen animated nav overlay |

## Pages

| Route | Description |
|---|---|
| `/` | Full portfolio — Hero, Projects, Skills, Experience, Blog preview, Contact |
| `/about` | Detailed about — Timeline, values, interests, CTA |
| `/blog` | All posts listing |
| `/blog/[slug]` | Post with sidebar, code blocks, tags |
| `*` | Custom 404 terminal error page |

## Getting Started

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Customise

### Your info
- **Name, bio, location** → `app/about/page.tsx`, `components/Navbar.tsx`, `components/Footer.tsx`
- **Projects** → `app/page.tsx` — the `projects` array at the top
- **Skills** → `app/page.tsx` — the `skillGroups` array
- **Experience** → `app/page.tsx` and `app/about/page.tsx`
- **Social links** → `components/Footer.tsx`

### Add a blog post
Open `lib/posts.ts` and add to the `posts` array:

```ts
{
  slug: "my-post",
  title: "My Post Title",
  excerpt: "Short summary...",
  date: "Apr 26, 2025",
  category: "Engineering",
  readTime: "5 min",
  tags: ["TypeScript", "React"],
  content: `## Section\nYour content...\n\`\`\`js\nconsole.log('hello')\n\`\`\``,
}
```

### Change colours
Edit CSS variables in `app/globals.css`:

```css
:root {
  --bg: #060810;        /* Main background */
  --cyan: #00f5ff;      /* Primary accent */
  --green: #00ff88;     /* Secondary accent */
  --pink: #ff006e;      /* Tertiary accent */
  --amber: #ffb800;     /* Quaternary accent */
}
```

## Deploy

```bash
# Vercel (recommended)
npx vercel

# Or push to GitHub → connect at vercel.com
```
