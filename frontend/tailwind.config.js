/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        brand: {
          50: "#fef7ee",
          100: "#fdedd6",
          200: "#f9d7ad",
          300: "#f4b978",
          400: "#ee9242",
          500: "#ea751d",
          600: "#db5b13",
          700: "#b54412",
          800: "#903616",
          900: "#742f16",
          950: "#3f1509",
        },
        slate: {
          850: "#172033",
          950: "#0a0f1a",
        },
      },
      animation: {
        "pulse-slow": "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
