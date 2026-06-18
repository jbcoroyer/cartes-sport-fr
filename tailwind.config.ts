import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        museum: '#F7F5F2',
        canvas: '#F7F5F2',
        surface: '#FFFFFF',
        panel: '#F0EDE8',
        border: '#E8E4DE',
        ink: '#2C2C2C',
        muted: '#8C8C8C',
        ghost: '#D4CFC8',
        slot: '#EAE6E1',

        accent: {
          wine: '#6B2D3E',
          forest: '#2D5A4A',
          ochre: '#8B6914',
          steel: '#4A6278',
        },

        owned: '#2D5A4A',
        missing: '#8C8C8C',
        wanted: '#4A6278',
      },

      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },

      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        display: ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-sm': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },

      borderRadius: {
        clay: '16px',
        'clay-md': '20px',
        'clay-lg': '28px',
        card: '16px',
        xl2: '1.25rem',
        xl3: '1.75rem',
      },

      boxShadow: {
        clay: '0 8px 24px -6px rgba(60,40,30,0.06), 0 2px 6px -2px rgba(60,40,30,0.04)',
        'clay-sm': '0 4px 20px -4px rgba(44,30,20,0.08)',
        'clay-hover': '0 12px 32px -8px rgba(60,40,30,0.1), 0 4px 8px -4px rgba(60,40,30,0.06)',
        card: '0 4px 20px -4px rgba(44,30,20,0.08)',
        soft: '0 1px 2px rgba(44,30,20,0.04)',
      },

      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'fill-in': 'fill-in 0.5s ease-out forwards',
        'check-draw': 'check-draw 0.4s ease-out forwards',
      },

      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fill-in': {
          '0%': { opacity: '0.3', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'check-draw': {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
