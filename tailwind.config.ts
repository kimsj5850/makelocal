import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#16211f",
        steel: "#4f5f5a",
        mint: "#d9f0e8",
        copper: "#b56a3c",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(22, 33, 31, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
