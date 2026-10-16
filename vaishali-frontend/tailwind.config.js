/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#3f4a3a',
          dark: '#2a3327',
        },
        plum: '#6b2b3f',
        ivory: '#faf7f0',
        stone: '#e9e2d3',
        ink: '#2b2b26',
        muted: '#8c8471',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        script: ['Tangerine', 'cursive'],
        sans: ['Karla', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 10px rgba(43,43,38,0.05)',
        card: '0 4px 24px rgba(43,43,38,0.06)',
        lift: '0 12px 34px rgba(43,43,38,0.12)',
      },
      borderRadius: {
        xl2: '0.9rem',
      },
    },
  },
  plugins: [],
}
