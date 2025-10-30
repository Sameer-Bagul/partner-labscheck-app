import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsla(var(--background))',
        foreground: 'hsla(var(--foreground))',
        card: {
          DEFAULT: 'hsla(var(--card))',
          foreground: 'hsla(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsla(var(--popover))',
          foreground: 'hsla(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsla(var(--primary))',
          foreground: 'hsla(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsla(var(--secondary))',
          foreground: 'hsla(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsla(var(--muted))',
          foreground: 'hsla(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsla(var(--accent))',
          foreground: 'hsla(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsla(var(--destructive))',
          foreground: 'hsla(var(--destructive-foreground))',
        },
        border: 'hsla(var(--border))',
        input: 'hsla(var(--input))',
        ring: 'hsla(var(--ring))',
        chart: {
          '1': 'hsla(var(--chart-1))',
          '2': 'hsla(var(--chart-2))',
          '3': 'hsla(var(--chart-3))',
          '4': 'hsla(var(--chart-4))',
          '5': 'hsla(var(--chart-5))',
        },
        // Brand color extensions
        brand: {
          900: 'var(--brand-900)',
          800: 'var(--brand-800)',
          700: 'var(--brand-700)',
          600: 'var(--brand-600)',
          500: 'var(--brand-500)',
          400: 'var(--brand-400)',
          300: 'var(--brand-300)',
          200: 'var(--brand-200)',
          100: 'var(--brand-100)',
        },
        success: 'var(--success)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        info: 'var(--info)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '0.5rem',
          sm: '1rem',
          md: '2rem',
          lg: '2rem',
          xl: '2rem',
          '2xl': '3rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1440px',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'inverted': 'var(--radius-inverted)',
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'medium': 'var(--shadow-medium)',
        'large': 'var(--shadow-large)',
        'glow': 'var(--shadow-glow)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      backdropBlur: {
        'glass': 'var(--glass-blur)',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'fade-in-subtle': 'fadeInSubtle 600ms ease-out',
        'slide-in-left': 'slideInLeft 300ms ease-out',
        'slide-in-right': 'slideInRight 300ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blob': 'blob 20s infinite',
        'blob-slow': 'blob-slow 25s infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'shimmer': 'shimmer 2s infinite',
        'stripes': 'stripes 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInSubtle: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulseRing: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0', transform: 'scale(1.5)' },
        },
        blob: {
          '0%, 100%': { 
            transform: 'translate(0px, 0px) scale(1) rotate(0deg)',
            opacity: '1',
          },
          '25%': { 
            transform: 'translate(60px, -80px) scale(1.15) rotate(90deg)',
            opacity: '0.9',
          },
          '50%': { 
            transform: 'translate(-40px, 60px) scale(0.85) rotate(180deg)',
            opacity: '1',
          },
          '75%': { 
            transform: 'translate(80px, 40px) scale(1.1) rotate(270deg)',
            opacity: '0.95',
          },
        },
        'blob-slow': {
          '0%, 100%': { 
            transform: 'translate(0px, 0px) scale(1) rotate(0deg)',
            opacity: '0.9',
          },
          '33%': { 
            transform: 'translate(-60px, 50px) scale(1.12) rotate(120deg)',
            opacity: '0.85',
          },
          '66%': { 
            transform: 'translate(60px, -50px) scale(0.92) rotate(240deg)',
            opacity: '0.95',
          },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        stripes: {
          '0%': { backgroundPosition: '1rem 0' },
          '100%': { backgroundPosition: '-1rem 0' },
        },
      },
      zIndex: {
        'base': '1',
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
