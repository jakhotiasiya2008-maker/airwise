import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cpcb: {
          good: "#15803d",          // 0-50 (Green)
          satisfactory: "#65a30d",  // 51-100 (Light Green)
          moderate: "#ca8a04",      // 101-200 (Yellow / Amber)
          poor: "#ea580c",          // 201-300 (Orange)
          verypoor: "#dc2626",      // 301-400 (Red)
          severe: "#7f1d1d",        // 401-500+ (Dark Red)
        },
      },
    },
  },
  plugins: [],
};

export default config;
