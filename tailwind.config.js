/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1', // Indigo-500
          dark: '#4f46e5',    // Indigo-600
        },
        secondary: '#10b981', // Emerald-500
        danger: '#f43f5e',    // Rose-500
        background: '#0f172a', // Slate-900
        surface: '#1e293b',    // Slate-800
        text: '#f1f5f9',       // Slate-100
        'text-muted': '#94a3b8', // Slate-400
        border: '#334155',     // Slate-700
      },
      animation: {
        'breathe-in': 'breatheIn 4s ease-in-out',
        'breathe-hold': 'breatheHold 4s ease-in-out',
        'breathe-out': 'breatheOut 4s ease-in-out',
      },
      keyframes: {
        breatheIn: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
        },
        breatheHold: {
          '0%, 100%': { transform: 'scale(1.3)' },
        },
        breatheOut: {
          '0%, 100%': { transform: 'scale(1.3)' },
          '50%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
