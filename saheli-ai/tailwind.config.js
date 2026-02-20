/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#faf8ff',
          100: '#f3eeff',
          200: '#e9e0ff',
          300: '#d4c4fb',
          400: '#b99bf5',
          500: '#9e6eec',
          600: '#884dde',
          700: '#743bc3',
          800: '#6232a0',
          900: '#522b83',
        },
        blush: {
          50: '#fff5f7',
          100: '#ffe8ee',
          200: '#ffd6e0',
          300: '#ffb3c6',
          400: '#ff85a1',
          500: '#ff597e',
          600: '#ed2b5a',
          700: '#c81e47',
          800: '#a71c3e',
          900: '#8c1b39',
        },
        cream: {
          50: '#fffdf7',
          100: '#fef9eb',
          200: '#fdf2d1',
          300: '#fbe8ab',
          400: '#f8d97a',
          500: '#f4c44d',
        },
        sage: {
          50: '#f4f9f4',
          100: '#e6f2e6',
          200: '#cee5cf',
          300: '#a6cfa8',
          400: '#78b27c',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
