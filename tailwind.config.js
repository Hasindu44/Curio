/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cloud: "var(--surface-soft)",
        ink: "#2B3137",
        inkLight: "#6B737B",
        // Soft tints are CSS variables so they flip automatically in dark mode.
        // Brand green: primary CTA + "correct" states
        leaf: {
          light: "#7DDB4A",
          DEFAULT: "#4CC417",
          dark: "#3A9A0F",
          deep: "#2B7A08",
          soft: "var(--leaf-soft)",
        },
        // Sky blue: links, selection, secondary CTA
        sky: {
          light: "#84D8FF",
          DEFAULT: "#1CA8F0",
          dark: "#1286C4",
          soft: "var(--sky-soft)",
        },
        // Gold: XP, stars, streak
        gold: {
          DEFAULT: "#FFB81F",
          dark: "#D99400",
          soft: "var(--gold-soft)",
        },
        // Coral: hearts, wrong answers
        coral: {
          DEFAULT: "#FF5A55",
          dark: "#E0403B",
          soft: "var(--coral-soft)",
        },
        // Violet: third course track
        violet: {
          DEFAULT: "#A46CF7",
          dark: "#7F48D6",
          soft: "var(--violet-soft)",
        },
      },
      fontFamily: {
        display: ["'Baloo 2'", "sans-serif"],
        body: ["'Nunito'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        chunky: "20px",
      },
      keyframes: {
        bob: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
      },
      animation: {
        bob: "bob 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
