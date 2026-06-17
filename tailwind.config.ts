import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas:  '#F7F6F3',
        surface: '#FFFFFF',
        panel:   '#F0EFEB',
        border:  '#E4E3DE',
        ink:     '#111110',
        muted:   '#6E6E68',

        gold: {
          DEFAULT: '#9A7340',
          light:   '#B8924F',
          dark:    '#7A5A30',
          muted:   '#F3EDE3',
        },

        owned:   '#15803D',
        missing: '#DC2626',
        wanted:  '#2563EB',

        rarity: {
          base:      '#6B7280',
          crack:     '#9333EA',
          megacrack: '#DB2777',
          invincible:'#D97706',
          momentum:  '#0891B2',
          gold:      '#9A7340',
          superfractor: '#111110',
        },
      },

      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        'display': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-sm': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },

      backgroundImage: {
        'card-shine': 'linear-gradient(135deg, transparent 0%, rgba(154,115,64,0.06) 50%, transparent 100%)',
        'gold-gradient': 'linear-gradient(135deg, #7A5A30 0%, #B8924F 50%, #7A5A30 100%)',
        'gold-gradient-soft': 'linear-gradient(135deg, rgba(154,115,64,0.08) 0%, rgba(184,146,79,0.04) 50%, rgba(154,115,64,0.08) 100%)',
        'holo-sweep': 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.5) 45%, rgba(184,146,79,0.12) 50%, rgba(255,255,255,0.5) 55%, transparent 80%)',
        'hero-radial': 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(154,115,64,0.06) 0%, transparent 70%)',
      },

      borderRadius: {
        card: '16px',
        xl2: '1.25rem',
        xl3: '1.75rem',
      },

      boxShadow: {
        card:      '0 1px 3px rgba(17,17,16,0.04), 0 4px 16px rgba(17,17,16,0.06)',
        'card-hover': '0 4px 24px rgba(17,17,16,0.1), 0 0 0 1px rgba(17,17,16,0.04)',
        glow:      '0 0 24px rgba(154,115,64,0.15)',
        'glow-sm': '0 0 12px rgba(154,115,64,0.1)',
        'glow-owned': '0 0 12px rgba(21,128,61,0.12)',
        'glow-missing': '0 0 12px rgba(220,38,38,0.1)',
        'glow-wanted': '0 0 12px rgba(37,99,235,0.1)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.8)',
        premium: '0 2px 8px rgba(17,17,16,0.04), 0 8px 32px rgba(17,17,16,0.06)',
        soft: '0 1px 2px rgba(17,17,16,0.04)',
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
