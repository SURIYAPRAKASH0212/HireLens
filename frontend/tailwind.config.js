/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6D4AFF', // Purple
          purple: '#6D4AFF',
        },
        emerald: {
          DEFAULT: '#10B981', // Green
        },
        blue: {
          DEFAULT: '#3B82F6', // Blue
        },
        orange: {
          DEFAULT: '#F59E0B', // Orange
        },
        red: {
          DEFAULT: '#EF4444', // Red
        },
        darkBg: '#08111F',
        darkCard: '#0F172A',
        darkSidebar: '#09111F',
        lightBg: '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
      },
    },
  },
  plugins: [],
}
