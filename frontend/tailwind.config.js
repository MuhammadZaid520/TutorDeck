/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-background)',
        foreground: 'var(--text-foreground)',
        muted: 'var(--bg-muted)',
        border: 'var(--border-color)',
        card: 'var(--bg-card)',
        'card-foreground': 'var(--text-card-foreground)',
        
        // Semantic accents mapped to variables for clean switching
        accent:  'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger:  'var(--danger)',
        violet:  'var(--violet)',
        teal:    'var(--teal)',
        blue:    'var(--blue)',
        amber:   'var(--amber)',
        
        // Keep some legacy navy colors if needed for specific hardcoded elements during transition
        navy: {
          50:  '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#1f2937',
          900: '#111827',
          950: '#0f172a',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
        serif:   ['"DM Serif Display"', 'Georgia', 'serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'soft':  '0 4px 20px -2px var(--shadow-color)',
        'glow':  '0 0 24px -4px var(--accent-shadow)',
        'card':  '0 2px 8px var(--shadow-color)',
      },
      borderRadius: {
        'blob': '24px',
        'card': '16px',
        'btn':  '12px',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 150ms ease-out',
        'scale-in': 'scaleIn 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scaleIn': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
