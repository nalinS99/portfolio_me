"use client";
/**
 * clientStore.ts - Client-side data fetcher for public pages.
 * Fetches from /api/data/<section> endpoints.
 * Falls back to static defaults while loading.
 */
import { useState, useEffect } from "react";
import {
  projects as defaultProjects,
  skills as defaultSkills,
  experience as defaultExperience,
  posts as defaultPosts,
  aboutInfo as defaultAbout,
  type Project, type Skill, type Experience, type Post, type AboutInfo,
} from "@/lib/data";

export type { Project, Skill, Experience, Post, AboutInfo };

export type PortfolioData = {
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  posts: Post[];
  about: AboutInfo;
  loading: boolean;
};

async function fetchSection<T>(section: string, fallback: T): Promise<T> {
  try {
    const r = await fetch(`/api/data/${section}`, { cache: "no-store" });
    if (!r.ok) return fallback;
    return await r.json() as T;
  } catch {
    return fallback;
  }
}

export function usePortfolioData(): PortfolioData {
  const [data, setData] = useState<PortfolioData>({
    projects: defaultProjects,
    skills: defaultSkills,
    experience: defaultExperience,
    posts: defaultPosts,
    about: defaultAbout,
    loading: true,
  });

  useEffect(() => {
    Promise.all([
      fetchSection("projects", defaultProjects),
      fetchSection("skills", defaultSkills),
      fetchSection("experience", defaultExperience),
      fetchSection("posts", defaultPosts),
      fetchSection("about", defaultAbout),
    ]).then(([projects, skills, experience, posts, about]) => {
      setData({ projects, skills, experience, posts, about, loading: false });
    });
  }, []);

  return data;
}

// Convenience helpers (sync, from already-fetched data)
export function publishedPosts(data: PortfolioData) { return data.posts.filter(p => p.published); }
export function featuredProjects(data: PortfolioData) { return data.projects.filter(p => p.featured); }
export function postBySlug(data: PortfolioData, slug: string) { return data.posts.find(p => p.slug === slug); }
