/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c2d4ff',
          300: '#94b0ff',
          400: '#6085ff',
          500: '#3d5afe',
          600: '#2c3fe0',
          700: '#232ec2',
          800: '#1c259e',
          900: '#1a2280',
        },
        neon: {
          x: '#00f5d4',
          o: '#f72585',
        },
      },
      animation: {
        'scale-in':    'scale-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
        'pulse-win':   'pulse-win 0.6s ease-in-out infinite alternate',
        'fade-in':     'fade-in 0.3s ease both',
        'slide-up':    'slide-up 0.3s ease both',
        'spin-slow':   'spin 3s linear infinite',
        'bounce-in':   'bounce-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) both',
      },
      keyframes: {
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.4) rotate(-10deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        'pulse-win': {
          '0%':   { boxShadow: '0 0 8px 2px rgba(99,102,241,0.4)',  transform: 'scale(1)' },
          '100%': { boxShadow: '0 0 24px 8px rgba(99,102,241,0.8)', transform: 'scale(1.04)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-in': {
          '0%':   { opacity: '0', transform: 'scale(0.3)' },
          '50%':  { opacity: '1', transform: 'scale(1.05)' },
          '70%':  { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        neon:  '0 0 20px rgba(61, 90, 254, 0.6)',
        'neon-x': '0 0 20px rgba(0, 245, 212, 0.6)',
        'neon-o': '0 0 20px rgba(247, 37, 133, 0.6)',
      },
    },
  },
  plugins: [],
  safelist: [
    'animate-pulse-win',
    'shadow-neon-x',
    'shadow-neon-o',
    'text-neon-x',
    'text-neon-o',
    'border-neon-x',
    'border-neon-o',
    'bg-neon-x',
    'bg-neon-o',
  ],
};
