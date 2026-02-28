/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['DM Serif Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        cream: '#f7f4ef',
        paper: '#fffef9',
        ink: '#1a1a2e',
        'ink-light': '#4a4a6a',
        teal: '#0d9488',
        'teal-light': '#14b8a6',
        'teal-pale': '#ccfbf1',
        amber: '#d97706',
        'amber-pale': '#fef3c7',
        rose: '#e11d48',
        'rose-pale': '#ffe4e6',
        sky: '#0284c7',
        'sky-pale': '#e0f2fe',
        border: '#e8e4dc',
      },
    },
  },
  plugins: [],
}
