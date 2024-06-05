import type { Config } from "tailwindcss";

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
    screens: {
      laptop: "1200px",
      tablet: "1000px",
      mobile: "860px",
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        lightBlueGradient:
          "linear-gradient(180deg, rgb(245, 246, 255) 0%, rgb(255, 255, 255) 100%)",
        lightGrayGradient:
          "linear-gradient(180deg, rgb(245, 246, 255) 0%, rgb(255, 255, 255) 100%)",
      },
      backgroundColor: {
        lightGray: "rgb(230, 230, 230)",
        heroImage: "rgb(242, 221, 157)",
        groupPersonOne: "rgb(253, 219, 255)",
        groupPersonTwo: "rgb(194, 255, 239)",
        groupPersonThree: "rgb(255, 212, 204)",
      },
      maxWidth: {
        desktop: "1000px",
      },
      height: {
        heroImage: "400px",
        heroGirl: "530px",
      },
      width: {
        heroImage: "400px",
        heroGirl: "353px",
        275: "275px",
        260: "260px",
        introductionSection: "calc(100% - 290px)",
      },
      padding: {
        50: "50px",
        100: "100px",
      },
      colors: {
        darkYellow: "#FFBB0A", // yellow - 800
        lightYellow: "#D5AE35",
        neuralTone: "#e0e0e0",
        mediumDarkGray: "rgb(89, 89, 89)",
        border: "hsl(var(--border))",
        darkCharcoal: "rgb(51, 51, 51)",
        charcoalGray: "#333333",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        dimGray: "rgb(38, 38, 38)",
        dimLight: "rgb(64, 64, 64)",
        lightGray: "rgb(153, 153, 153)",
        gainsboro: "rgb(224, 224, 224)",
        aliceBlue: "rgb(245, 246, 255)",
        brilliantBlue: "rgb(51, 78, 255)",
        whiteSmoke: "rgb(235, 235, 235)",
        snow: "rgb(250, 250, 250)",
        davyGray: "rgb(102, 102, 102)",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
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
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
