/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'nunito': ['var(--font-nunito)', 'Nunito', 'sans-serif'],
        'amatic': ['var(--font-amatic)', 'Amatic SC', 'sans-serif'],
        'pally-regular': ['var(--font-pally-regular)', 'Pally-Regular', 'sans-serif'],
        'pally-medium': ['var(--font-pally-medium)', 'Pally-Medium', 'sans-serif'],
        'pally-bold': ['var(--font-pally-bold)', 'Pally-Bold', 'sans-serif'],
      },
      colors: {
        'game-bg-primary': '#251f2b',
        'game-bg-secondary': '#1d1721',
        'game-danger': '#ff87a2',
        'game-border': '#767676',
        'game-text-faded': 'rgba(255, 255, 255, 0.8)',
        'game-success': '#d5ff95',
      },
      fontSize: {
        'game-base': '20px',
        'game-title': '2.5rem',
      },
      borderRadius: {
        'game': '8px',
      },
    },
  },
  plugins: [],
}
