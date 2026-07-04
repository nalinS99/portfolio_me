import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import {
  projects as defaultProjects,
  skills as defaultSkills,
  experience as defaultExperience,
  posts as defaultPosts,
  aboutInfo as defaultAbout,
} from "@/lib/data";

export const runtime = "edge";

const redis = Redis.fromEnv();

const DEFAULTS: Record<string, unknown> = {
  projects: defaultProjects,
  skills: defaultSkills,
  experience: defaultExperience,
  posts: defaultPosts,
  about: defaultAbout,
};

const VALID = new Set(["projects", "skills", "experience", "posts", "about"]);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  if (!VALID.has(section)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const data = await redis.get(`portfolio:${section}`);
  return NextResponse.json(data ?? DEFAULTS[section]);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  if (!VALID.has(section)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const secret = req.headers.get("x-admin-secret");
  if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await redis.set(`portfolio:${section}`, body);
  return NextResponse.json({ ok: true });
}
