/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ include all possible files
  ],
  theme: {
    extend: {
      colors: {
        primary: "#20c997",
        secondary: "#17a2b8",

        bgLight: "#ffffff",
        bgSoft: "#f8f9fa",
        bgGray: "#f1f3f5",

        dark: "#343a40",
        darkBlue: "#2f3e46",

        textPrimary: "#212529",
        textSecondary: "#6c757d",

        success: "#28a745",
        danger: "#dc3545",
        warning: "#ffc107",
        info: "#17a2b8",
      },
    },
  },
  plugins: [],
};