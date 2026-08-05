/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#eefaf9",
          100: "#d3f1ef",
          200: "#a8e3e0",
          300: "#74cdc9",
          400: "#42b0ac",
          500: "#22928f",
          600: "#0f7674",
          700: "#0c5f5f",
          800: "#0d4c4d",
          900: "#0d4041",
          950: "#032323",
        },
        coral: {
          50: "#fff3ee",
          100: "#ffe4d6",
          200: "#ffc4ac",
          300: "#ff9c76",
          400: "#ff6f3e",
          500: "#fa4a17",
          600: "#eb320d",
          700: "#c2220c",
          800: "#9a1e12",
          900: "#7c1c12",
          950: "#430a06",
        },
        sand: {
          50: "#fdfbf6",
          100: "#f9f4e8",
          200: "#f1e6cc",
          300: "#e5d1a3",
          400: "#d7b876",
          500: "#c99e51",
          600: "#b18441",
          700: "#8e6836",
          800: "#735531",
          900: "#5f472b",
        },
        ink: "#0a1f1e",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backgroundImage: {
        "sunset-gradient": "linear-gradient(135deg, #fa4a17 0%, #ff9c76 50%, #ffe4d6 100%)",
        "ocean-gradient": "linear-gradient(135deg, #0d4041 0%, #0f7674 55%, #42b0ac 100%)",
        "glass-shine": "linear-gradient(120deg, rgba(255,255,255,0.35), rgba(255,255,255,0.05))",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(10, 31, 30, 0.25)",
        card: "0 8px 24px -8px rgba(10, 31, 30, 0.18)",
        glow: "0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(250, 74, 23, 0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
