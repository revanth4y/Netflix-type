/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#e50914',
          black: '#141414',
          dark: '#1f1f1f',
        },
      },
      transitionDuration: {
        400: '400ms',
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('light', '.light &');
    },
  ],
};
