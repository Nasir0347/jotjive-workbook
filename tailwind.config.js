/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chalkboard-dark': '#1a1a1a',
        'chalkboard-gray': '#333333',
        'oer-blue': '#38bdf8',
        'oer-yellow': '#fbbf24',
        'oer-green': '#4ade80',
        'oer-red': '#f87171',
        'oer-pink': '#f472b6',
        primary: '#38bdf8', // SaaS Blue
        secondary: '#333333', // Chalk Gray
        accent: '#fbbf24', // SaaS Yellow
      },
      backgroundImage: {
        'chalkboard-texture': "url('/assets/chalkboard-bg.png')",
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      boxShadow: {
        'tactile': '0 4px 0 rgba(0, 0, 0, 0.15)',
        'tactile-blue': '0 4px 0 #075985',
        'tactile-red': '0 4px 0 #991b1b',
      },
    },
  },
  plugins: [],
}
