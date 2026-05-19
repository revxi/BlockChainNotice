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
      backgroundColor: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        tertiary: 'var(--bg-tertiary)',
        input: 'var(--input-bg)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        tertiary: 'var(--text-tertiary)',
      },
      borderColor: {
        theme: 'var(--border-color)',
        input: 'var(--input-border)',
      },
    },
  },
  plugins: [],
};
