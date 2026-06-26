/**
 * store.ts — re-exports types and defaults from data.ts.
 * 
 * Public pages use lib/clientStore.ts (client-side fetch from /api/data/).
 * The API route (app/api/data/[section]/route.ts) handles all filesystem I/O directly.
 * This file is kept for any legacy imports and type re-exports only.
 */
export {
  projects,
  skills,
  experience,
  posts,
  aboutInfo,
  getPublishedPosts,
  getPostBySlug,
  getFeaturedProjects,
  type Project,
  type Skill,
  type Experience,
  type Post,
  type AboutInfo,
} from "@/lib/data";
