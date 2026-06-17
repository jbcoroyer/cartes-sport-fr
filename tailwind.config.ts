import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas:  '#08080E',
        surface: '#12121C',
        panel:   '#1A1A28',
        border:  '#252535',

        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E8C96A',
          dark:    '#9A7A2E',
          muted:   '#3D3018',
        },

        owned:   '#22C55E',
        missing: '#EF4444',
        wanted:  '#3B82F6',

        rarity: {
          base:      '#6B7280',
          crack:     '#A855F7',
          megacrack: '#EC4899',
          invincible:'#F59E0B',
          momentum:  '#06B6D4',
          gold:      '#C9A84C',
          superfractor: '#ffffff',
        },
      },

      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },

      backgroundImage: {
        'card-shine': 'linear-gradient(135deg, transparent 0%, rgba(201,168,76,0.08) 50%, transparent 100%)',
        'gold-gradient': 'linear-gradient(135deg, #9A7A2E 0%, #E8C96A 50%, #9A7A2E 100%)',
        'gold-gradient-soft': 'linear-gradient(135deg, rgba(154,122,46,0.15) 0%, rgba(232,201,106,0.08) 50%, rgba(154,122,46,0.15) 100%)',
        'holo-sweep': 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.12) 45%, rgba(201,168,76,0.2) 50%, rgba(255,255,255,0.12) 55%, transparent 80%)',
        'glass-border': 'linear-gradient(135deg, rgba(201,168,76,0.3) 0%, rgba(255,255,255,0.05) 50%, rgba(201,168,76,0.15) 100%)',
        'hero-radial': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 70%)',
      },

      borderRadius: {
        card: '12px',
        xl2: '1.25rem',
        xl3: '1.5rem',
      },

      boxShadow: {
        card:      '0 2px 8px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.2)',
        glow:      '0 0 20px rgba(201,168,76,0.3)',
        'glow-sm': '0 0 12px rgba(201,168,76,0.2)',
        'glow-owned': '0 0 16px rgba(34,197,94,0.25)',
        'glow-missing': '0 0 16px rgba(239,68,68,0.2)',
        'glow-wanted': '0 0 16px rgba(59,130,246,0.25)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.06)',
        'premium': '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)',
      },

      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'scan-line': 'scan-line 2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'holo-sweep': 'holo-sweep 3s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
      },

      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'scan-line': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        'holo-sweep': {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'pulse-ring': {
          '0%':   { transform: 'scale(0.95)', opacity: '0.6' },
          '50%':  { transform: 'scale(1)', opacity: '0.3' },
          '100%': { transform: 'scale(0.95)', opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}

export default config
