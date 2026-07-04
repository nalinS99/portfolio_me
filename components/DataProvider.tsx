"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { Project, Skill, Experience, Post, AboutInfo } from "@/lib/data";
import { aboutInfo as defaultAbout } from "@/lib/data";

export type PortfolioData = {
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  posts: Post[];
  about: AboutInfo;
  loading: boolean;
};

const DataContext = createContext<PortfolioData>({
  projects: [],
  skills: [],
  experience: [],
  posts: [],
  about: defaultAbout,
  loading: false,
});

export function DataProvider({ data, children }: { data: PortfolioData; children: ReactNode }) {
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

export function useData(): PortfolioData {
  return useContext(DataContext);
}
