"use client";
/**
 * store.ts — reads admin-saved data from localStorage,
 * falling back to the static defaults in data.ts.
 *
 * Used by public-facing pages so they show whatever the
 * admin has saved rather than the hardcoded defaults.
 */
import {
  projects as defaultProjects,
  skills as defaultSkills,
  experience as defaultExperience,
  posts as defaultPosts,
  aboutInfo as defaultAbout,
  type Project,
  type Skill,
  type Experience,
  type Post,
  type AboutInfo,
} from "@/lib/data";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export type { Project, Skill, Experience, Post, AboutInfo };

export function getProjects(): Project[]     { return read("admin_projects",  defaultProjects);  }
export function getSkills(): Skill[]         { return read("admin_skills",    defaultSkills);    }
export function getExperience(): Experience[]{ return read("admin_experience",defaultExperience);}
export function getPosts(): Post[]           { return read("admin_posts",     defaultPosts);     }
export function getAboutInfo(): AboutInfo    { return read("admin_about",     defaultAbout);     }

export function getPublishedPosts(): Post[]  { return getPosts().filter(p => p.published); }
export function getPostBySlug(slug: string): Post | undefined { return getPosts().find(p => p.slug === slug); }
export function getFeaturedProjects(): Project[] { return getProjects().filter(p => p.featured); }
