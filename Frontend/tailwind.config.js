/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xxl: '1400px',
      },
      colors: {
        text: '#000000',
        background: '#FBFBFE',
        primary: '#84A2EB',
        secondary: '#641895',
        accent: '#D440E1',
        card: '#FFFFFF',
        dark: {
          text: '#D8E0F9',
          background: '#040919',
          card: '#0F1732'
        },
      },
    },
  },
  plugins: [],
}