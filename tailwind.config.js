/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#FF477E',
          secondary: '#7000FF',
          accent: '#FFD166',
          dark: '#1A1A2E',
        },
        backgroundImage: {
          'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
          'romantic-gradient': 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)',
        }
      },
    },
    plugins: [],
  }