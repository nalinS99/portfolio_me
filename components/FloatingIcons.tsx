"use client";
import React, { useEffect, useState } from "react";
import {
  SiReact, SiTypescript, SiNodedotjs, SiNextdotjs,
  SiTailwindcss, SiDocker, SiPostgresql, SiRedis,
  SiGraphql, SiGit, SiKubernetes, SiPython,
} from "react-icons/si";

const ICONS = [
  { Icon: SiReact,       color: "#61DAFB" },
  { Icon: SiTypescript,  color: "#3178C6" },
  { Icon: SiNodedotjs,   color: "#339933" },
  { Icon: SiNextdotjs,   color: "#AAAAAA" },
  { Icon: SiTailwindcss, color: "#06B6D4" },
  { Icon: SiDocker,      color: "#2496ED" },
  { Icon: SiPostgresql,  color: "#4169E1" },
  { Icon: SiRedis,       color: "#FF4438" },
  { Icon: SiGraphql,     color: "#E10098" },
  { Icon: SiKubernetes,  color: "#326CE5" },
  { Icon: SiPython,      color: "#3776AB" },
  { Icon: SiGit,         color: "#F05032" },
];

// Wide speed range: some icons crawl (30s+), some zip (6s)
// Large drift values so they travel far across the whole page
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  iconIdx:   i % ICONS.length,
  size:      28 + ((i * 37 + 11) % 28),          // 28–55px
  left:      ((i * 47 + 13) % 110) - 5,          // -5% to 105% — starts off-screen too
  top:       ((i * 61 + 7)  % 110) - 5,
  opacity:   0.15 + ((i * 13) % 10) * 0.02,      // 0.15–0.33
  // Speed: mix of fast (6s), medium (15s), slow (35s)
  duration:  6 + ((i * 11 + i * i) % 30),        // 6–35s — very wide spread
  // Drift: large enough to cross the whole viewport
  driftX:    (((i * 73 + 29) % 160) - 80),       // -80 to +80vw equivalent in px... but we use vw below
  driftY:    (((i * 53 + 17) % 200) - 100),      // -100 to +100
  driftX2:   (((i * 41 + 61) % 140) - 70),       // second waypoint
  driftY2:   (((i * 83 + 11) % 180) - 90),
  driftX3:   (((i * 67 + 43) % 120) - 60),       // third waypoint
  driftY3:   (((i * 31 + 53) % 160) - 80),
  animDelay: -((i * 4.1) % 35),                  // stagger across full duration range
}));

export default function FloatingIcons() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { queueMicrotask(() => setMounted(true)); }, []);
  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes fi-float {
          0%   { transform: translate(0, 0) rotate(0deg); }
          30%  { transform: translate(var(--dx1), var(--dy1)) rotate(120deg); }
          60%  { transform: translate(var(--dx2), var(--dy2)) rotate(240deg); }
          80%  { transform: translate(var(--dx3), var(--dy3)) rotate(300deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
      `}</style>

      {/* position:fixed + overflow:visible so icons can roam beyond viewport edges */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          overflow: "visible",
          pointerEvents: "none",
          zIndex: 5,
        }}
      >
        {PARTICLES.map((p, i) => {
          const { Icon, color } = ICONS[p.iconIdx];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
                color,
                opacity: p.opacity,
                ["--dx1" as string]: `${p.driftX}vw`,
                ["--dy1" as string]: `${p.driftY}vh`,
                ["--dx2" as string]: `${p.driftX2}vw`,
                ["--dy2" as string]: `${p.driftY2}vh`,
                ["--dx3" as string]: `${p.driftX3}vw`,
                ["--dy3" as string]: `${p.driftY3}vh`,
                animation: `fi-float ${p.duration}s ${p.animDelay}s linear infinite`,
                willChange: "transform",
              }}
            >
              <Icon style={{ width: "100%", height: "100%", display: "block" }} />
            </div>
          );
        })}
      </div>
    </>
  );
}
