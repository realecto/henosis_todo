/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "body": "#111217",
        "primary": "#0f0f0f",
        "secondary": "#131212",
        "accent_1": "#272727",
        "accent_2": "#1b1b1b"
      }
    },
  },
  plugins: [],
}
