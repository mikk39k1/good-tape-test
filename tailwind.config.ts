import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Outfit",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      colors: {
        color: {
          1: '#F1FAEE',
          2: '#A8DADC',
          3: '#457B9D',
          4: '#1D3557',
          5: '#E63946',
        },
      }
    },
  },
  plugins: [],
} satisfies Config;