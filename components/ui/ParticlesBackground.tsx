"use client";

import { useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import { useTheme } from "next-themes";

export default function ParticlesBackground() {
  const [ready, setReady] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0 z-0"
      options={{
        fullScreen: { enable: false },
        background: { color: "transparent" },

        particles: {
          number: {
            value: 50, // more visible
            density: {
              enable: true,
            },
          },
          color: { value: isDark ? "#ffffff" : "#000000" },
          links: {
            enable: true,
            color: isDark ? "#ffffff" : "#000000",
            distance: 150,
            opacity: 0.35,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1.5,
          },
          size: {
            value: { min: 1, max: 3 },
          },
          opacity: { value: 0.5 },
        },

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
          },
          modes: {
            repulse: {
              distance: 90,
            },
          },
        },

        detectRetina: true,

        responsive: [
          {
            maxWidth: 768,
            options: {
              particles: {
                number: { value: 80 }, // fewer on mobile
                links: { distance: 120 },
              },
            },
          },
        ],
      }}
    />
  );
}
