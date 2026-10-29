import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        orange: {
          400: '#FB923C',
          500: '#D14316', // High-contrast WCAG AA (4.67:1 on white, 4.67:1 for white text on orange)
          600: '#B4340C', // High-contrast WCAG AAA (6.2:1 on white)
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
          300: '#94A3B8',
          400: '#475569', // High-contrast WCAG AA 5.68:1 on white
          500: '#334155', // 8.3:1 contrast on white
          600: '#1E293B', // 12.6:1 contrast on white
          700: '#0F172A', // 18.2:1 contrast on white
          800: '#020617', // 20:1 contrast on white
        },
        gray: {
          50: '#F5F7FA',
        },
        brand: {
          orange: '#F25C2A',
          navy: '#0F172A',
          blue: '#2563EB',
          sky: '#38BDF8',
        },
        pastel: {
          lavender: '#EEF0FF',
          cream: '#FFF3E8',
          butter: '#FFEFB8',
          mint: '#E3F6EC',
          sky: '#E4F1FF',
          blush: '#FFE6E6',
          indigo: '#1B1FB8',
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
