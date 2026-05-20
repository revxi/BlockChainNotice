export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      colors: {
        navy: {
          50: '#eef2ff',
          100: '#dce7ff',
          500: '#2952a3',
          600: '#1e3d82',
          700: '#163068',
          800: '#0f2050',
          900: '#0a1535',
        },
        gold: {
          400: '#f0b429',
          500: '#d9970d',
          600: '#b87d0b',
        },
      },
    },
  },
  plugins: [],
};
