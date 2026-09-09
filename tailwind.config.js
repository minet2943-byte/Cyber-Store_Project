/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Base surfaces — near-black navy, not pure black
        void: '#0a0e1a',
        surface: '#0f1420',
        card: '#131a2b',
        'card-hover': '#171f34',
        border: '#232c42',
        // Accents
        violet: {
          DEFAULT: '#7c5cfc',
          soft: '#9b82ff',
          dim: '#4c3a9e',
        },
        teal: {
          DEFAULT: '#22d3c7',
          soft: '#5eead4',
          dim: '#0f7a70',
        },
        // Status
        ok: '#34d399',
        warn: '#f59e0b',
        danger: '#f87171',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(124,92,252,0.35), 0 0 24px rgba(124,92,252,0.15)',
        'glow-teal': '0 0 0 1px rgba(34,211,199,0.35), 0 0 24px rgba(34,211,199,0.12)',
      },
    },
  },
  plugins: [],
}
