import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#070B1A",
          900: "#0B1226",
          800: "#111A38",
          700: "#1A2547",
        },
        electric: {
          DEFAULT: "#3B82F6",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
        },
        violet: {
          DEFAULT: "#7C3AED",
          500: "#8B5CF6",
          600: "#7C3AED",
        },
        gold: {
          DEFAULT: "#D9A441",
          300: "#EBC77E",
          400: "#D9A441",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui"],
        body: ["var(--font-body)", "system-ui"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(7,11,26,.06), 0 8px 24px rgba(7,11,26,.08)",
        glow: "0 0 60px rgba(59,130,246,.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at 1px 1px, rgba(148,163,184,.15) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
export default config;
