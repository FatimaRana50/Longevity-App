import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:                  '#3C4A3E',
        secondary:                '#546342',
        terracotta:               '#C4654A',
        'terracotta-soft':        '#E08A6F',
        'terracotta-light':       '#FAF0EC',
        'secondary-light':        '#E8F0DC',
        accent:                   '#887369',
        background:               '#FDF9F2',
        surface:                  '#F1EDE6',
        'surface-high':           '#EBE8E1',
        'surface-elevated':       '#FFFFFF',
        'text-primary':           '#1C1C18',
        'text-secondary':         '#4A4E46',
        'text-muted':             '#887369',
        'secondary-container':    '#D8E9BE',
        'on-secondary-container': '#5A6948',
        'outline-variant':        '#E3E5E0',
        outline:                  '#887369',
        border:                   '#E3E5E0',
        'border-light':           '#EDE8E1',
        'text-light':             '#FDF9F2',
        'text-light-muted':       '#B8C4A8',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans:  ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card:      '12px',
        'card-lg': '16px',
        pill:      '9999px',
        chip:      '24px',
      },
      boxShadow: {
        subtle:   '0 2px 6px rgba(0,0,0,0.06)',
        card:     '0 2px 8px rgba(0,0,0,0.10)',
        active:   '0 3px 12px rgba(84,99,66,0.15)',
        elevated: '0 4px 16px rgba(0,0,0,0.20)',
      },
    },
  },
  plugins: [],
}
export default config
