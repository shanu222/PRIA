import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["var(--font-jakarta)", "var(--font-inter)", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--primary-hover))",
          tint: "hsl(var(--primary-tint))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        water: {
          DEFAULT: "hsl(var(--water))",
          foreground: "hsl(var(--water-foreground))",
        },
        sand: {
          DEFAULT: "hsl(var(--sand))",
          foreground: "hsl(var(--sand-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        pending: {
          DEFAULT: "hsl(var(--pending))",
          foreground: "hsl(var(--pending-foreground))",
        },
        provisional: {
          DEFAULT: "hsl(var(--provisional))",
          foreground: "hsl(var(--provisional-foreground))",
        },
        segment: {
          mountain: "#3B82F6",
          riverine: "#16A34A",
          desert: "#D97706",
          coastal: "#0891B2",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        soft: "0 1px 2px rgb(15 23 42 / 0.04), 0 4px 12px -2px rgb(15 23 42 / 0.06)",
        lift: "0 2px 4px rgb(15 23 42 / 0.04), 0 12px 32px -8px rgb(15 23 42 / 0.14)",
        glow: "0 0 0 1px hsl(var(--primary) / 0.15), 0 12px 40px -12px hsl(var(--primary) / 0.35)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        swivel: {
          "0%, 100%": { transform: "perspective(700px) rotateY(-24deg)" },
          "50%": { transform: "perspective(700px) rotateY(24deg)" },
        },
        "swivel-spin": {
          from: { transform: "perspective(700px) rotateY(0deg)" },
          to: { transform: "perspective(700px) rotateY(360deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.08)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        swivel: "swivel 5s ease-in-out infinite",
        "swivel-spin": "swivel-spin 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
};

export default config;
