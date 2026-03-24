/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        mist: '#eef2ff',
        accent: '#0284c7',
        coral: '#fb7185',
        mint: '#10b981'
      },
      boxShadow: {
        glow: '0 24px 60px -30px rgba(2, 132, 199, 0.45)'
      }
    }
  },
  plugins: []
};
