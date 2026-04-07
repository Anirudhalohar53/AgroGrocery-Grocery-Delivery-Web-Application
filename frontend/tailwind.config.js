/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bae5ba',
          300: '#8dd48d',
          400: '#5cb85c',
          500: '#28a745',
          600: '#1e7e34',
          700: '#155724',
          800: '#0d4318',
          900: '#062d0f',
        },
        vegetable: {
          light: '#8dd48d',
          main: '#28a745',
          dark: '#155724',
          accent: '#5cb85c',
          leaf: '#2e7d32',
          fresh: '#66bb6a',
          organic: '#4caf50',
        }
      },
    },
  },
  plugins: [],
}

