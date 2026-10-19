import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#F25C2A',
          600: '#C2410C',
        },
        blue: {
          600: '#1F6AA5',
          700: '#17527F',
        },
        navy: {
          800: '#12304D',
          900: '#0B1B2E',
        },
        slate: {
          400: '#64748B', // WCAG AA 4.6:1 contrast on white
          500: '#475569', // 5.7:1 contrast on white
          600: '#334155', // 9.6:1 contrast on white
          700: '#1E293B', // 12.6:1 contrast on white
          800: '#0F172A', // 18.2:1 contrast on white
        },
        gray: {
          50: '#F5F7FA',
        },
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      maxWidth: {
        container: '1280px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 10px 30px -5px rgba(11, 27, 46, 0.08), 0 0 0 1px rgba(11, 27, 46, 0.04)',
        elevated: '0 20px 40px -15px rgba(241, 90, 52, 0.15)',
        glow: '0 0 25px rgba(241, 90, 52, 0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config;
