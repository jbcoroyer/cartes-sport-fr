import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark card-display aesthetic
        canvas:  '#08080E',   // fond principal — noir bleuté
        surface: '#12121C',   // surfaces de cartes
        panel:   '#1A1A28',   // panneaux et sidebars
        border:  '#252535',   // bordures subtiles

        // Accent — reflet doré des cartes premium
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E8C96A',
          dark:    '#9A7A2E',
          muted:   '#3D3018',
        },

        // Statuts de collection
        owned:   '#22C55E',  // vert — possédée
        missing: '#EF4444',  // rouge — manquante
        wanted:  '#3B82F6',  // bleu — souhaitée

        // Niveaux de rareté (utilisés pour les badges)
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

      backgroundImage: {
        'card-shine': 'linear-gradient(135deg, transparent 0%, rgba(201,168,76,0.08) 50%, transparent 100%)',
        'gold-gradient': 'linear-gradient(135deg, #9A7A2E 0%, #E8C96A 50%, #9A7A2E 100%)',
      },

      borderRadius: {
        card: '12px',
      },

      boxShadow: {
        card:      '0 2px 8px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.2)',
        glow:      '0 0 20px rgba(201,168,76,0.3)',
      },

      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'scan-line': 'scan-line 2s ease-in-out infinite',
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
      },
    },
  },
  plugins: [],
}

export default config
