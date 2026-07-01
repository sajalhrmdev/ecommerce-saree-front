import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
        },
        gold: {
          50: "#fdf8e8",
          100: "#f9edc5",
          200: "#f5e0a0",
          300: "#f0d07a",
          400: "#ebc55f",
          500: "#e4b946",
          600: "#d4a534",
          700: "#b88a2a",
          800: "#9c7122",
          900: "#7e5b1b",
        },
        cream: "#faf5ef",
        ivory: "#fffdf9",
        charcoal: "#1a1a2e",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        script: ["Cormorant Garamond", "Georgia", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "slide-up": "slideUp 0.8s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(212, 165, 52, 0.4)" },
          "50%": { boxShadow: "0 0 0 15px rgba(212, 165, 52, 0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
