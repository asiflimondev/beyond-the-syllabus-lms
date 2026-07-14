/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Updated to match reference template
        primary: {
          50: '#eef0fa',
          100: '#d6daf2',
          200: '#b7bde0',
          300: '#8f98d6',
          400: '#6471c4',
          500: '#3648ad', // Main blue
          600: '#283890',
          700: '#1c2564',
          800: '#141a4a', // Darkest
          900: '#0e1235',
          950: '#080b20',
        },
        // Orange accent from template
        orange: {
          50: '#fef2ed',
          100: '#fde0d4',
          200: '#fbc4a8',
          300: '#f8a07c',
          400: '#f47a50',
          500: '#f1592a', // Main orange
          600: '#df481c',
          700: '#c93a16',
          800: '#a52f12',
          900: '#86280f',
          950: '#4a1408',
        },
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Surface colors from template
        surface: '#f2f3fb',
        ink: '#171a2e',
        'ink-soft': '#454a6b',
        muted: '#6a6f8c',
        line: '#e4e6f4',
        'line-soft': '#eef0fa',
        'on-dark': '#eef0fb',
        'on-dark-soft': '#b7bde0',
      },
      fontFamily: {
        // Display font from template
        display: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
        // Body font from template
        sans: ['Hanken Grotesk', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'sh-1': '0 1px 2px rgba(20,26,74,.06), 0 6px 20px -8px rgba(20,26,74,.14)',
        'sh-2': '0 18px 44px -18px rgba(20,26,74,.32)',
        'sh-3': '0 40px 90px -30px rgba(20,26,74,.5)',
        'sh-orange': '0 12px 26px -10px rgba(241,89,42,.7)',
        'sh-orange-lg': '0 20px 34px -12px rgba(241,89,42,.8)',
      },
      borderRadius: {
        'r': '16px',
        'r-lg': '28px',
        'r-xl': '36px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        // New animations from template
        'float-a': 'floatA 22s ease-in-out infinite',
        'float-b': 'floatB 19s ease-in-out infinite',
        'float-c': 'floatC 24s ease-in-out infinite',
        'marquee': 'marquee 34s linear infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'magnetic-hover': 'magneticHover 0.35s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        // Template animations
        floatA: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(11px, -15px) rotate(9deg)' },
        },
        floatB: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(-13px, 10px) rotate(-7deg)' },
        },
        floatC: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(9px, 7px) rotate(5deg)' },
          '50%': { transform: 'translate(2px, -11px) rotate(-4deg)' },
          '75%': { transform: 'translate(-8px, 5px) rotate(5deg)' },
        },
        marquee: {
          'to': { transform: 'translateX(-50%)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
}