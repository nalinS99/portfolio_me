import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CursorEffect from "@/components/CursorEffect";
import { ThemeProvider } from "@/components/ThemeProvider";
import FloatingIcons from "@/components/FloatingIcons";
import FlowingBackground from "@/components/FlowingBackground";
import Preloader from "@/components/Preloader";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import { headers } from "next/headers";
import { getPortfolioData } from "@/lib/serverData";
import { DataProvider } from "@/components/DataProvider";

export const metadata: Metadata = {
  title: "Nalin S Bandara — Software Engineer",
  description: "Software engineer based in Colombo, Sri Lanka. Building fast, reliable, well-crafted software.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");

  // Fetch all data server-side — injected into page, NO client fetch needed
  const portfolioData = await getPortfolioData();

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <DataProvider data={portfolioData}>
            <Preloader />
            <div className="bg-grid" />
            <div className="bg-glow" />
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <FlowingBackground />
            <FloatingIcons />
            <ScrollProgress />
            <BackToTop />
            <CursorEffect />
            {!isAdmin && <Navbar />}
            <main style={{ position: "relative", zIndex: 10 }}>
              {children}
            </main>
            {!isAdmin && <Footer />}
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
