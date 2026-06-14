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
        // Stitch Design System Colors
        primary: "#003527",
        "primary-container": "#064e3b",
        "on-primary": "#ffffff",
        "on-primary-container": "#80bea6",
        secondary: "#855300",
        "secondary-container": "#fea619",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#684000",
        tertiary: "#4f1f19",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#6b342d",
        "on-tertiary-container": "#ea9e93",
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        background: "#f8faf6",
        "on-background": "#191c1b",
        surface: "#f8faf6",
        "on-surface": "#191c1b",
        "surface-variant": "#e1e3e0",
        "on-surface-variant": "#404944",
        outline: "#707974",
        "outline-variant": "#bfc9c3",
        "surface-container": "#eceeeb",
        "surface-container-low": "#f2f4f1",
        "surface-container-high": "#e7e9e5",
        "surface-container-highest": "#e1e3e0",
        "surface-container-lowest": "#ffffff",
        "surface-tint": "#2b6954",
        "primary-fixed": "#b0f0d6",
        "primary-fixed-dim": "#95d3ba",
        "on-primary-fixed": "#002117",
        "on-primary-fixed-variant": "#0b513d",
        "secondary-fixed": "#ffddb8",
        "secondary-fixed-dim": "#ffb95f",
        "on-secondary-fixed": "#2a1700",
        "on-secondary-fixed-variant": "#653e00",
        "tertiary-fixed": "#ffdad5",
        "tertiary-fixed-dim": "#ffb4a9",
        "on-tertiary-fixed": "#380d08",
        "on-tertiary-fixed-variant": "#6e372f",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "sans-serif"],
        display: ["var(--font-plus-jakarta-sans)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        "margin-mobile": "20px",
        "stack-lg": "48px",
        base: "8px",
        "margin-desktop": "64px",
        "container-max": "1280px",
        "stack-sm": "12px",
        "stack-md": "24px",
        gutter: "24px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(6, 78, 59, 0.04)",
        glow: "0 0 20px 0 var(--tw-shadow-color)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
