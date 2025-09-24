/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {animation: {
        fadeIn: 'fadeIn 1s ease-in-out',
        fontFamily: {
        unbounded: ["Unbounded", "sans-serif"], 
        
      },
      maxWidth: {
        '8xl': '1440px',
        '9xl': '1600px',
      }
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },},
  },
  plugins: [],
}
