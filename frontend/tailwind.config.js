/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB", 
        "blue-700": "#1E40AF",
        "blue-800": "#1E3A8A", 
        "blue-50": "#EFF6FF", 
        "blue-100": "#DBEAFE", 
        "gray-800": "#1F2A44",
        "gray-700": "#374151",
        "gray-300": "#D1D5DB",
        white: "#FFFFFF", 
      },
    },
  },
  plugins: [],
};