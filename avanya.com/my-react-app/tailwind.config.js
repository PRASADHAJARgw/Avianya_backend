/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This line is crucial for React components
  ],
  theme: {
    extend: {
      // Add custom animations here
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.4s ease-out forwards',
        'bounce-subtle': 'bounce-subtle 3s infinite ease-in-out',
      },
      // Custom shadows for neumorphism-like effect
      boxShadow: {
        'neumorphic-light': '9px 9px 18px #d1d9e6, -9px -9px 18px #ffffff',
        'neumorphic-pressed': 'inset 3px 3px 6px #b8c0cc, inset -3px -3px 6px #f8ffff',
        'neumorphic-light-hover': '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff',
      },
    },
  },
  plugins: [],
}