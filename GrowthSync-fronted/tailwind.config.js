// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  // Ye line Tailwind ko batati hai ki CSS kahan-kahan apply karni hai
  content: [
    "./index.html",
    "./src/assets/index.css",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Yahan humne tumhare theme.js wale saare colors Tailwind mein add kar diye hain
      colors: {
        brand: {
          page: "#0d1117",
          sidebar: "#0f1923",
          card: "#161f2e",
          cardHover: "#1a2537",
          accent: "#00E6C3",
          accentDim: "rgba(0,230,195,0.12)",
          textPrimary: "#E6F4F3",
          textSecondary: "#8FB7B5",
          muted: "rgba(143,183,181,0.45)",
          textDark: "#0d1117",
          border: "rgba(255,255,255,0.07)",
          topbar: "#0f1923",
        }
      }
    },
  },
  plugins: [],
};