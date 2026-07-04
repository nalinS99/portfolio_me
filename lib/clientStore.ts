"use client";
/**
 * clientStore.ts
 * 
 * usePortfolioData() — reads from DataProvider context (server-injected data).
 * No client-side fetch needed. Data is already in the page from SSR.
 */
import { useData } from "@/components/DataProvider";
import type { PortfolioData } from "@/components/DataProvider";
import {
  type Project,
  type Skill,
  type Experience,
  type Post,
  type AboutInfo,
} from "@/lib/data";

export type { Project, Skill, Experience, Post, AboutInfo, PortfolioData };

export function usePortfolioData(): PortfolioData {
  return useData();
}

export function invalidateCache() {
  // No-op: SSR model — refresh the page to get new data
}

export function publishedPosts(data: PortfolioData) { return data.posts.filter(p => p.published); }
export function featuredProjects(data: PortfolioData) { return data.projects.filter(p => p.featured); }
export function postBySlug(data: PortfolioData, slug: string) { return data.posts.find(p => p.slug === slug); }
