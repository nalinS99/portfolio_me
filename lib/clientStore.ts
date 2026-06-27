"use client";
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

// In-memory cache — data fetched once, shared across all components/pages
// until the browser tab is closed
let memoryCache: PortfolioData | null = null;
let fetchPromise: Promise<PortfolioData> | null = null;

async function fetchAll(): Promise<PortfolioData> {
  if (memoryCache) return memoryCache;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch("/api/data/all")
    .then(r => r.json())
    .then(d => {
      memoryCache = { ...d, loading: false };
      return memoryCache!;
    })
    .catch(() => {
      const fallback: PortfolioData = {
        projects: defaultProjects,
        skills: defaultSkills,
        experience: defaultExperience,
        posts: defaultPosts,
        about: defaultAbout,
        loading: false,
      };
      memoryCache = fallback;
      return fallback;
    });

  return fetchPromise;
}

export function usePortfolioData(): PortfolioData {
  const [data, setData] = useState<PortfolioData>(
    memoryCache ?? {
      projects: [],
      skills: [],
      experience: [],
      posts: [],
      about: defaultAbout,
      loading: true,
    }
  );

  useEffect(() => {
    if (memoryCache) {
      setData(memoryCache);
      return;
    }
    fetchAll().then(setData);
  }, []);

  return data;
}

// Call this after admin saves to invalidate cache
export function invalidateCache() {
  memoryCache = null;
  fetchPromise = null;
}

export function publishedPosts(data: PortfolioData) { return data.posts.filter(p => p.published); }
export function featuredProjects(data: PortfolioData) { return data.projects.filter(p => p.featured); }
export function postBySlug(data: PortfolioData, slug: string) { return data.posts.find(p => p.slug === slug); }