import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'cursor-blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'chat-dot': {
          '0%, 60%, 100%': { opacity: '0.3', transform: 'translateY(0)' },
          '30%': { opacity: '1', transform: 'translateY(-2px)' },
        },
      },
      animation: {
        'cursor-blink': 'cursor-blink 1s step-end infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        marquee: 'marquee 30s linear infinite',
        'marquee-logos': 'marquee 25s linear infinite',
        'chat-dot': 'chat-dot 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
  corePlugins: {
    // Disable unused core plugins for smaller bundle size
    container: false,
  },
  // Enable JIT mode for better performance
  mode: 'jit',
  // Optimize for production
  ...(process.env.NODE_ENV === 'production' && {
    safelist: [
      // Keep these classes even if not detected
      'animate-pulse',
      'bg-gray-100',
      'bg-gray-800',
      'h-screen',
      'h-96',
    ],
  }),
};

export default config;
