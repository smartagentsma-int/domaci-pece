/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bde2ff',
          300: '#8ed0ff',
          400: '#55b4ff',
          500: '#2c93ff',
          600: '#0b6eff',
          700: '#0057e5',
          800: '#0045b3',
          900: '#003c99',
        },
        beige: {
          50: '#faf8f4',
          100: '#f5f0e8',
          200: '#e8dfd1',
          300: '#d6c8b3',
          400: '#c1ab8f',
          500: '#ad9273',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};
