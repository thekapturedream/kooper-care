import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kapture: {
          black: "#0A0A0A",
          ink: "#111111",
          coal: "#1A1A1A",
          ash: "#2A2A2A",
          smoke: "#3A3A3A",
          mist: "#9A9A9A",
          fog: "#D4D4D4",
          paper: "#F5F5F5",
          white: "#FFFFFF",
          yellow: "#FFD400",
          amber: "#F5B400",
        },
        // Audit score grades — used in /state-of-uk-logistics-2026 charts.
        score: {
          excellent: "#10B981",
          good:      "#84CC16",
          average:   "#F5B400",
          weak:      "#F97316",
          poor:      "#EF4444",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      fontSize: {
        "hero-xl": ["clamp(2.5rem, 6vw, 5.5rem)", { lineHeight: "0.95", letterSpacing: "-0.04em", fontWeight: "700" }],
        "hero-lg": ["clamp(2rem, 4.5vw, 3.75rem)", { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "700" }],
        "section": ["clamp(1.75rem, 3vw, 2.75rem)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" }],
      },
      borderRadius: {
        kapture: "10px",
      },
      boxShadow: {
        "kapture-soft": "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(0,0,0,0.10)",
        "kapture-lift": "0 24px 48px -24px rgba(0,0,0,0.18)",
        "kapture-yellow": "0 0 0 4px rgba(255,212,0,0.18)",
      },
      backgroundImage: {
        "kapture-grid":
          "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
        "kapture-grid-dark":
          "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out",
        "fade-in": "fadeIn 0.6s ease-out",
        "marquee": "marquee 32s linear infinite",
        "spin-slow": "spin 12s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
