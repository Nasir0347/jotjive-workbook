/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'saas-blue': '#0ea5e9',
        'saas-yellow': '#f59e0b',
        'saas-green': '#22c55e',
        'saas-red': '#ef4444',
        'saas-magenta': '#d946ef',
        'saas-indigo': '#6366f1',
        'saas-dark': '#0c0c0c',
        primary: '#0ea5e9',
        secondary: '#f59e0b',
        accent: '#22c55e',
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
        'tactile': '0 4px 0 rgba(0, 0, 0, 0.2)',
        'tactile-blue': '0 4px 0 #0369a1',
        'tactile-red': '0 4px 0 #b91c1c',
        'tactile-green': '0 4px 0 #15803d',
        'tactile-yellow': '0 4px 0 #b45309',
      },
    },
  },
  plugins: [],
}
