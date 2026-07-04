/**
 * serverData.ts — runs only on the server (RSC / layout).
 * Fetches all portfolio data from Redis in one shot.
 */
import { Redis } from "@upstash/redis";
import {
  projects as defaultProjects,
  skills as defaultSkills,
  experience as defaultExperience,
  posts as defaultPosts,
  aboutInfo as defaultAbout,
} from "@/lib/data";
import type { PortfolioData } from "@/lib/clientStore";

const redis = Redis.fromEnv();

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const [projects, skills, experience, posts, about] = await Promise.all([
      redis.get("portfolio:projects"),
      redis.get("portfolio:skills"),
      redis.get("portfolio:experience"),
      redis.get("portfolio:posts"),
      redis.get("portfolio:about"),
    ]);

    return {
      projects:   (projects   as never) ?? defaultProjects,
      skills:     (skills     as never) ?? defaultSkills,
      experience: (experience as never) ?? defaultExperience,
      posts:      (posts      as never) ?? defaultPosts,
      about:      (about      as never) ?? defaultAbout,
      loading: false,
    };
  } catch {
    return {
      projects: defaultProjects,
      skills: defaultSkills,
      experience: defaultExperience,
      posts: defaultPosts,
      about: defaultAbout,
      loading: false,
    };
  }
}
