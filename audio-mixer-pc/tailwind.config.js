/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'goxlr-blue': '#00a2ff',
        'goxlr-purple': '#7b61ff',
        'goxlr-red': '#ff0044',
        'panel-bg': '#1a1a1a',
        'dark-bg': '#141414',
        'darker-bg': '#0a0a0a',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
      },
      scale: {
        '102': '1.02',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(0, 162, 255, 0.5)',
        'glow-purple': '0 0 20px rgba(123, 97, 255, 0.5)',
        'glow-red': '0 0 20px rgba(255, 0, 68, 0.5)',
      },
      animation: {
        'vu-meter': 'vu-meter 1s ease-in-out infinite',
      },
      keyframes: {
        'vu-meter': {
          '0%, 100%': { height: '20%' },
          '50%': { height: '80%' },
        },
      },
    },
  },
  plugins: [],
}