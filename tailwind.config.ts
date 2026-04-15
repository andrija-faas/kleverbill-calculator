import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-lexend)', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#466800',
          container: '#86bc25',
          fixed: '#baf55b',
          dim: '#3d5b00',
        },
        surface: {
          DEFAULT: '#EFFCF5',
          low: '#f1f4f6',
          lowest: '#ffffff',
          high: '#e0e8ec',
          dim: '#d6dde2',
        },
        'on-surface': {
          DEFAULT: '#2b3437',
          variant: '#586064',
        },
        outline: {
          variant: '#abb3b7',
        },
        'secondary-container': '#e0e8ec',
        'on-secondary-container': '#586064',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0px 12px 32px rgba(43, 52, 55, 0.06)',
        'card-lg': '0px 24px 48px rgba(43, 52, 55, 0.10)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease forwards',
      },
    },
  },
  plugins: [],
}

export default config
