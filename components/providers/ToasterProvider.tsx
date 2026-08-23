"use client";
import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

// App-wide toast host; styles flip between white/black frosted glass per theme
export default function ToasterProvider() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Sonner
      position="bottom-right"
      theme={isDark ? "dark" : "light"}
      toastOptions={{
        style: {
          background: isDark
            ? "rgba(9, 9, 11, 0.7)"
            : "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(12px)",
        },
      }}
    />
  );
}
