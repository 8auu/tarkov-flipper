import type { Config } from "tailwindcss";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette");

import colors from "tailwindcss/colors";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true, // Centers the container
      screens: {
        sm: "240px",
        md: "268px",
        lg: "292px", // Smaller max-width than Tailwind's default
        xl: "1200px", // Smaller max-width than Tailwind's default
      },
    },
    extend: {
      textColor: {
        subtext: "hsl(var(--subtext))",
      },
      borderColor: {
        accentBorder: "hsl(var(--accentBorder))",
      },
      colors: {
        text: "hsl(var(--text) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        darkBackground: "hsl(var(--darkBackground) / <alpha-value>)",
        primary: "hsl(var(--primary) / <alpha-value>)",
        secondary: "hsl(var(--secondary) / <alpha-value>)",
        card: "hsl(var(--card))",
        accent: "hsl(var(--accent) / <alpha-value>)",
        darkAccent: "hsl(var(--darkAccent) / <alpha-value>)",
        darkSecondary: "hsl(var(--darkSecondary) / <alpha-value>)",
        active: "hsl(var(--active))",
        baseActive: "hsl(var(--baseActive) / <alpha-value>)",
        lightGray: "hsl(var(--lightGray) / <alpha-value>)",
        blurple: "hsl(var(--blurple) / <alpha-value>)",
        red: colors.red,
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        gray: "hsl(var(--subtext))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
      },
    },
  },
  plugins: [require("tailwindcss-animate"), addVariablesForColors],
} satisfies Config;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );

  addBase({
    ":root": newVars,
  });
}

export default config;
