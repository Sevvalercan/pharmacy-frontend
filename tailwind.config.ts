import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0d6e66",
          dark: "#095852",
          light: "#e6f4f2",
          tint: "#c5e7e2",
        },
        alert: { DEFAULT: "#b3123f", light: "#fdeaf0", dark: "#8d0d31" },
        amber: { DEFAULT: "#a35a00", light: "#fdf1e3" },
        ink: { DEFAULT: "#121b22", soft: "#4a5761", faint: "#7a868f" },
        line: { DEFAULT: "#e4e9ec", soft: "#eff2f4" },
        canvas: { DEFAULT: "#f7f9fa", card: "#ffffff" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: { DEFAULT: "10px", lg: "14px", xl: "20px" },
      boxShadow: {
        card: "0 1px 2px rgba(18,27,34,0.04)",
        pop: "0 8px 28px rgba(18,27,34,0.10)",
      },
      maxWidth: { shell: "1200px" },
    },
  },
  plugins: [],
};
export default config;
