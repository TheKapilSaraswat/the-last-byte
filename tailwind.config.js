/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: 'var(--c-obsidian)',
        surface: 'var(--c-surface)',
        surface2: 'var(--c-surface-2)',
        lime: 'var(--c-lime)',
        'lime-soft': 'var(--c-lime-soft)',
        ink: 'var(--c-ink)',
        ink2: 'var(--c-ink-2)',
        muted: 'var(--c-muted)',
        line: 'var(--c-line)',
        'line-strong': 'var(--c-line-strong)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        shell: '1320px',
        prose: '68ch',
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.14em' }],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'signal-dash': {
          to: { strokeDashoffset: '0' },
        },
        'pulse-node': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        'scan': {
          '0%': { transform: 'translateY(-120%)' },
          '100%': { transform: 'translateY(220%)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'signal-dash': 'signal-dash 2.4s linear infinite',
        'pulse-node': 'pulse-node 3s ease-in-out infinite',
        scan: 'scan 6s linear infinite',
        blink: 'blink 1.05s step-end infinite',
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
}
