import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import {
  projects as defaultProjects,
  skills as defaultSkills,
  experience as defaultExperience,
  posts as defaultPosts,
  aboutInfo as defaultAbout,
} from "@/lib/data";

const redis = Redis.fromEnv();

export async function GET() {
  const [projects, skills, experience, posts, about] = await Promise.all([
    redis.get("portfolio:projects"),
    redis.get("portfolio:skills"),
    redis.get("portfolio:experience"),
    redis.get("portfolio:posts"),
    redis.get("portfolio:about"),
  ]);

  return NextResponse.json({
    projects:   projects   ?? defaultProjects,
    skills:     skills     ?? defaultSkills,
    experience: experience ?? defaultExperience,
    posts:      posts      ?? defaultPosts,
    about:      about      ?? defaultAbout,
  }, {
    headers: {
      // Vercel CDN cache: serve instantly, refresh in background
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300",
    },
  });
}