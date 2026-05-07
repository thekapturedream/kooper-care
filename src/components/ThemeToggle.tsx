"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-kapture-fog text-kapture-black transition-all hover:bg-kapture-black hover:text-kapture-white dark:border-kapture-ash dark:text-kapture-white dark:hover:bg-kapture-white dark:hover:text-kapture-black"
    >
      {mounted ? (
        isDark ? <Sun size={16} /> : <Moon size={16} />
      ) : (
        <span className="block h-4 w-4 rounded-full bg-kapture-fog" />
      )}
    </button>
  );
}
